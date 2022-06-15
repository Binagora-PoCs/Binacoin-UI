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
import BinagoriansDataService from "../services/binagorians.service.js";
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
      createdDate: e.target.value
    });
  }
  onChangeRate(e) {
    this.setState({
      rate: e.target.value
    });
  }
  createBinagorian() {
    var data = {
      address: this.state.address,
      name: this.state.name,
      createdDate: this.state.createdDate,
      rate: this.state.rate
    };
    BinagoriansDataService.create(data)
      .then(response => {
        this.setState({
          address: response.data.address,
          createdDate: response.data.createdDate,
          name: response.data.name,
          rate: response.data.rate,
          submitted: true
        });
        console.log(response);
      })
      .catch(e => {
        console.log(e);
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
                    <Input id='createdDate' type='text' required value={this.state.createdDate} onChange={this.onChangeCreatedDate} />
                  </HStack>
                  <HStack spacing={5}>
                    <FormLabel htmlFor='name'>Name</FormLabel>
                    <Input id='name' type='text' required value={this.state.name} onChange={this.onChangeName} />
                  </HStack>
                  <HStack spacing={5}>
                    <FormLabel htmlFor='rate'>Rate</FormLabel>
                    <Input id='rate' type='text' required value={this.state.rate} onChange={this.onChangeRate} />
                  </HStack>
                  <Button colorScheme='blue' size='sm' onClick={this.createBinagorian}>Create</Button>
                </VStack>
                
              </FormControl>
            )}
          </Box>
    );
  }
}