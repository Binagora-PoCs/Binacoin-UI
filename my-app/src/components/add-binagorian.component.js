import React, { Component } from "react";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  VStack,
  HStack,
} from '@chakra-ui/react';
import ContractsService from "../services/contracts.service.js";
import { SingleDatepicker } from 'chakra-dayzed-datepicker';
import { PendingTxsContext } from "../contexts/pending-txs-context";

export default class AddBinagorian extends Component {
  constructor(props) {
    super(props);
    this.onChangeAddress = this.onChangeAddress.bind(this);
    this.onChangeName = this.onChangeName.bind(this);
    this.onChangeCreatedDate = this.onChangeCreatedDate.bind(this);
    this.onChangeRate = this.onChangeRate.bind(this);
    this.createBinagorian = this.createBinagorian.bind(this);
    this.newBinagorian = this.newBinagorian.bind(this);
    this.state = {
      address:"",
      name: "",
      createdDate: "", 
      rate: 0,
      submitted: false
    };
  }
  onChangeAddress(e) {
    this.setState({
      address: e.target.value
    });
  }
  onChangeName(e) {
    this.setState({
      name: e.target.value
    });
  }
  onChangeCreatedDate(e) {
    this.setState({
      createdDate: e
    });
  }
  onChangeRate(e) {
    this.setState({
      rate: e.target.value
    });
  }
  
  async createBinagorian(incPendingTxs, decPendingTxs) {
    var data = {
      address: this.state.address,
      name: this.state.name,
      createdDate: Date.parse(this.state.createdDate) / 1000,
      rate: this.state.rate
    };
    
    const binagoriansContract = ContractsService.getBinagoriansContract();
    let tx = await binagoriansContract.create(data.address, data.createdDate, data.name, data.rate);

    ContractsService.handleTxExecution(tx, incPendingTxs, decPendingTxs);

    tx.wait(1).then((receipt) => {
      alert('created binagorian: ' + data.address);
    });
  }

  newBinagorian() {
    this.setState({
        address:"",
        name: "",
        createdDate: "", 
        rate: 0,
        submitted: false
    });
  }
  render() {
    return (
        <Box>
          {this.state.submitted ? (
            <div>
              <h4>You submitted successfully!</h4>
              <button className="btn btn-success" onClick={this.newBinagorian}>
                Add
              </button>
            </div>
            ) : (
              <FormControl>
                <VStack
                  spacing={4}
                  align='stretch'
                >
                  <HStack spacing={5}>
                    <FormLabel htmlFor='address'>Address</FormLabel>
                    <Input id='address' type='text' required value={this.state.address} onChange={this.onChangeAddress} />
                  </HStack>
                  <HStack spacing={5}>
                    <FormLabel htmlFor='createdDate'>Created Date</FormLabel>
                    <SingleDatepicker
                      id = 'createdDate'
                      name="date-input"
                      date={this.state.createdDate}
                      onDateChange={this.onChangeCreatedDate}
                    />
                  </HStack>
                  <HStack spacing={5}>
                    <FormLabel htmlFor='name'>Name</FormLabel>
                    <Input id='name' type='text' required value={this.state.name} onChange={this.onChangeName} />
                  </HStack>
                  <HStack spacing={5}>
                    <FormLabel htmlFor='rate'>Rate</FormLabel>
                    <Input id='rate' type='text' required value={this.state.rate} onChange={this.onChangeRate} />
                  </HStack>
                  <PendingTxsContext.Consumer>
                    {({incPendingTxs, decPendingTxs}) => (
                      <Button colorScheme='blue' size='sm' onClick={() => this.createBinagorian(incPendingTxs, decPendingTxs)}>Create</Button>
                    )}
                  </PendingTxsContext.Consumer>
                </VStack>
                
              </FormControl>
            )}
          </Box>
    );
  }
}