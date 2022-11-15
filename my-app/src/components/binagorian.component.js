import React, { Component } from "react";
import { Button, Box, TableContainer, Heading, Divider, Center } from '@chakra-ui/react';
import ContractsService from "../services/contracts.service.js";
import { BigNumber, utils } from "ethers";
import { PendingTxsContext } from "../contexts/pending-txs-context";
import DataTable  from './data-table.component'

export default class Binagorians extends Component {
  constructor(props) {
    super(props);
    this.state = {
        loadingData: true,
        data: [],
        columns: [
            {
              Header: 'Date',
              accessor: 'date',
            },
            {
              Header: 'Amount',
              accessor: 'amount',
            }
          ]
      };
    
      this.getMyBurns();
  }

  async burnPto(incPendingTxs, decPendingTxs) {
    const binacoinContract = ContractsService.getBinacoinContract();
    const binacoinDecimals = await binacoinContract.decimals();
    // TODO: Need to allow user set the amount of PTOs to burn
    let tx = await binacoinContract.burn(utils.parseUnits("1", BigNumber.from(binacoinDecimals)));

    ContractsService.handleTxExecution(tx, incPendingTxs, decPendingTxs);
  }

  async getMyBurns() {
    let myBurns = [];
    const binacoinContract = ContractsService.getBinacoinContract();
    let tokenUnits = await binacoinContract.decimals();
    let myBurnsResponse = await binacoinContract.getMyBurns();

    for (let b of myBurnsResponse) {
      let amountInEther = utils.formatUnits(b.amount, tokenUnits);
      myBurns.push({ 
        amount: amountInEther, 
        date: new Date(b.date * 1000).toDateString()
      });
    };

    this.setState({
      loadingData : false,
      data : myBurns,
    });
  }

  render() {
    return (
        <PendingTxsContext.Consumer>
          {({incPendingTxs, decPendingTxs}) => (
            <Box>
              <Button colorScheme='blue' size='sm' onClick={() => this.burnPto(incPendingTxs, decPendingTxs)}>Burn PTOs</Button>
              <Center fontSize="xl">
                  Withdrawals
              </Center>
              <Center>
                <TableContainer>
                    { this.state.loadingData ? (
                        <p>Loading Please wait...</p>
                    ) : (
                    <DataTable data={this.state.data} columns={this.state.columns}/>
                    )}
                </TableContainer>  
              </Center>
              
            </Box>
          )}
        </PendingTxsContext.Consumer>
    );
  }
}