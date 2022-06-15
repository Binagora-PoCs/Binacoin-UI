import React, { Component } from "react";
import DataTable  from './data-table.component'
import { TableContainer } from '@chakra-ui/react';
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
          ]
      };
    this.getBinagorians();
  }

  async getBinagorians() {
    let binagorians = [];
    let bAddresesResponse = await BinagoriansDataService.getRegisteredAddresses();
    
    for (let a of bAddresesResponse) {
        let binagorianResponse = await BinagoriansDataService.get(a);
        let d = new Date(binagorianResponse.entryTime.toString()).toDateString();
        binagorians.push({ address: a, name: binagorianResponse.name, entryTime: d, rate: binagorianResponse.rate.toString() });
    };

    this.setState({
        loadingData : false,
        data : binagorians
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