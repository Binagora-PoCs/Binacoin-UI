import React, { Component } from "react";
import DataTable  from './data-table.component'
import { TableContainer, Button, Box } from '@chakra-ui/react';
import ContractsService from "../services/contracts.service.js";
import { BINACOIN_ADDRESS, BINAGORIANS_ADDRESS } from '../contracts-config';
import { BigNumber, utils } from "ethers";
import { PendingTxsContext } from "../contexts/pending-txs-context";

export default class Binagorians extends Component {
  constructor(props) {
    super(props);
    this.state = {
        loadingData: true,
        data: [],
        columns: [
            {
              Header: 'Address',
              accessor: 'address',
            },
            {
              Header: 'Name',
              accessor: 'name',
            },
            {
              Header: 'Entry time',
              accessor: 'entryTime',
              
            },
            {
              Header: 'Rate',
              accessor: 'rate',
              isNumeric: true
            },
            {
              Header: 'Airdrop amount',
              accessor: 'airdropAmount',
              isNumeric: true
            },
            {
              Header: 'Pending amount',
              accessor: 'pendingAmount',
              isNumeric: true
            },
            {
              Header: 'Action',
              accessor: (originalRow, rowIndex) => (
                <div>
                    <Button onClick={() => this.handleEdit(originalRow)}>Edit</Button>
                    <Button onClick={() => this.handleDelete(originalRow)}>Delete</Button>
                </div>
             ),
             id: 'action',
            }
          ]
      };
    
      this.getBinagorians();
  }

  async handleDelete(row) {
    const binagoriansContract = ContractsService.getBinagoriansContract();
    let tx = await binagoriansContract.remove(row.address);

    tx.wait(1).then((receipt) => {
      // This gets called once there are 1 confirmation
      // Reload the grid
      this.getBinagorians();
    });
  }

  handleEdit(row) {
    // TODO: Move to a page to update rate
  }

  async getBinagorians() {
    let binagorians = [];
    const binagoriansContract = ContractsService.getBinagoriansContract();
    const binacoinContract = ContractsService.getBinacoinContract();
    let bAddresesResponse = await binagoriansContract.getRegisteredAddresses();
    
    for (let a of bAddresesResponse) {
        let binagorianResponse = await binagoriansContract.get(a);
        let tokenBalance = await binacoinContract.balanceOf(a);
        let tokenUnits = await binacoinContract.decimals();
        let tokenBalanceInEther = utils.formatUnits(tokenBalance, tokenUnits);

        binagorians.push({ 
          address: a, 
          name: binagorianResponse.name, 
          entryTime: new Date(binagorianResponse.entryTime * 1000).toDateString(), 
          rate: binagorianResponse.rate.toString(),
          airdropAmount: binagorianResponse.airdropAmount.toString(),
          pendingAmount: tokenBalanceInEther,
        });
    };

    this.setState({
      loadingData : false,
      data : binagorians,
    });
  }

  async generateAirdrop(incPendingTxs, decPendingTxs) {
    const binagoriansContract = ContractsService.getBinagoriansContract();
    let tx = await binagoriansContract.generateAirdrop(BINACOIN_ADDRESS);
    
    incPendingTxs();

    tx.wait(1).then((receipt) => {
      // This gets called once there are 1 confirmation
      alert("Airdrop Confirmation received: " + receipt.transactionHash);
      decPendingTxs();
    });
  }

  async mintToBinagorians(incPendingTxs, decPendingTxs) {
    const binacoinContract = ContractsService.getBinacoinContract();
    const binacoinDecimals = await binacoinContract.decimals();
    let tx = await binacoinContract.mint(BINAGORIANS_ADDRESS, BigNumber.from(100).mul(BigNumber.from(10).pow(BigNumber.from(binacoinDecimals))));
    incPendingTxs();
    
    tx.wait(1).then((receipt) => {
      // This gets called once there are 1 confirmation
      alert("Mint Confirmation received: " + receipt.transactionHash);
      decPendingTxs();
    });
  }

  render() {
    return (
        <PendingTxsContext.Consumer>
          {({incPendingTxs, decPendingTxs}) => (
            <Box>
              <Button colorScheme='blue' size='sm' onClick={() => this.generateAirdrop(incPendingTxs, decPendingTxs)}>Generate new airdrop</Button>
              <Button colorScheme='blue' size='sm' onClick={() => this.mintToBinagorians(incPendingTxs, decPendingTxs)}>Mint to Binagorians</Button>
              <TableContainer>
                  { this.state.loadingData ? (
                      <p>Loading Please wait...</p>
                  ) : (
                  <DataTable data={this.state.data} columns={this.state.columns}/>
                  )}
              </TableContainer>
            </Box>
          )}
        </PendingTxsContext.Consumer>
    );
  }
}