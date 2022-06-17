import React, { Component } from "react";
import DataTable  from './data-table.component'
import { TableContainer, Button } from '@chakra-ui/react';
import BinagoriansDataService from "../services/binagorians.service.js";
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
    BinagoriansDataService.delete(row.address)
      .then(response => {
        this.getBinagorians();
      })
      .catch(e => {
        console.log(e);
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
          rate: binagorianResponse.rate.toString() 
        });
    };

    this.setState({
      loadingData : false,
      data : binagorians,
    });
  }

  render() {
    return (
        <TableContainer>
            { this.state.loadingData ? (
                <p>Loading Please wait...</p>
            ) : (
            <DataTable data={this.state.data} columns={this.state.columns}/>
            )}
        </TableContainer>
    );
  }
}