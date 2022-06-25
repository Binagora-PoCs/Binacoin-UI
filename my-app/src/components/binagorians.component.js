import React, { Component } from "react";
import DataTable  from './data-table.component'
import { TableContainer, Button, Box } from '@chakra-ui/react';
import BinagoriansDataService from "../services/binagorians.service.js";
import BinacoinDataService from "../services/binacoin.service.js";
import { BINACOIN_ADDRESS, BINAGORIANS_ADDRESS } from '../contracts-config';

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
    const binagoriansContract = BinagoriansDataService.getBinagoriansContract();
    binagoriansContract.remove(row.address);
    binagoriansContract.on("Deleted", (address) => {
      // Here the Binagorian is effectively deleted in the blockchain
      if (address === row.address) {
        // Reload the grid
        this.getBinagorians();
      }
    });
  }

  handleEdit(row) {
    // TODO: Move to a page to update rate
  }

  async getBinagorians() {
    let binagorians = [];
    let bAddresesResponse = await BinagoriansDataService.getRegisteredAddresses();
    
    for (let a of bAddresesResponse) {
        let binagorianResponse = await BinagoriansDataService.get(a);
        binagorians.push({ 
          address: a, 
          name: binagorianResponse.name, 
          entryTime: new Date(binagorianResponse.entryTime * 1000).toDateString(), 
          rate: binagorianResponse.rate.toString(),
          airdropAmount: binagorianResponse.airdropAmount.toString()
        });
    };

    this.setState({
      loadingData : false,
      data : binagorians,
    });
  }

  async generateAirdrop() {
    BinagoriansDataService.generateAirdrop(BINACOIN_ADDRESS);
  }

  async mintToBinagorians() {
    BinacoinDataService.mintTo(100, BINAGORIANS_ADDRESS);
  }

  render() {
    return (
        <Box>
          <Button colorScheme='blue' size='sm' onClick={this.generateAirdrop}>Generate new airdrop</Button>
          <Button colorScheme='blue' size='sm' onClick={this.mintToBinagorians}>Mint to Binagorians</Button>
          <TableContainer>
              { this.state.loadingData ? (
                  <p>Loading Please wait...</p>
              ) : (
              <DataTable data={this.state.data} columns={this.state.columns}/>
              )}
          </TableContainer>
        </Box>
    );
  }
}