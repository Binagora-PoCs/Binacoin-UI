import React, { Component } from "react";
import {
  Text,
  Badge,
} from '@chakra-ui/react';
import BinagoriansDataService from "../services/binagorians.service.js";
export default class BinagorianProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
        name: "",
        createdDate: "", 
        rate: 0,
        connected: ""
      };
    this.getCurrent();
  }

  getCurrent() {
    BinagoriansDataService.getCurrent()
      .then(response => {
        this.setState({
          createdDate: response.entryTime,
          name: response.name,
          rate: response.rate,
          connected: "Connected"
        });
        console.log(response);
      })
      .catch(e => {
        console.log(e);
      });
  }
  render() {
    return (
        <Text fontSize='xl' fontWeight='bold' align="right">
            { this.state.name }
            <Badge ml='1' fontSize='0.8em' colorScheme='green'>
                { this.state.connected }
            </Badge>
        </Text>
    );
  }
}