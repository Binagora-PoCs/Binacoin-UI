import React, { Component } from "react";
import { ethers, utils } from "ethers";
import {
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Box,
  Button
} from '@chakra-ui/react';
import ContractsService from "../services/contracts.service.js";
export default class BinagorianProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
        name: "",
        createdDate: "", 
        rate: 0,
        connected: ""
      };
  }

  getCurrent() {
    const binagoriansContract = ContractsService.getBinagoriansContract();
    binagoriansContract.getCurrent()
      .then(response => {
        this.setState({
          createdDate: response.entryTime,
          name: response.name,
          rate: response.rate
        });
      })
      .catch(e => {
        console.log(e);
      });
  }

  async connectToMetamask() {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const accounts = await provider.send("eth_requestAccounts", []);
    const balance = await provider.getBalance(accounts[0]);
    const balanceInEther = ethers.utils.formatEther(balance);
    const block = await provider.getBlockNumber();

    this.getCurrent();

    provider.on("block", (block) => {
      this.setState({ block })
    });

    const binacoinContract = ContractsService.getBinacoinContract();
    const tokenName = await binacoinContract.name();
    const tokenBalance = await binacoinContract.balanceOf(accounts[0]);
    const tokenUnits = await binacoinContract.decimals();
    const tokenBalanceInEther = utils.formatUnits(tokenBalance, tokenUnits);

    this.setState({ selectedAddress: accounts[0], balance: balanceInEther, block, tokenName, tokenBalanceInEther })
  }

  renderMetamask() {
    if (!this.state.selectedAddress) {
      return (
        <Button onClick={() => this.connectToMetamask()}>Connect to Metamask</Button>
      )
    } else {
      return (
          <Stat>
            <StatLabel>Your ETH Balance is: {this.state.balance}</StatLabel>
            <StatLabel>Balance of {this.state.tokenName} is: {this.state.tokenBalanceInEther}</StatLabel>
            <StatNumber>Welcome {this.state.selectedAddress} - { this.state.name }</StatNumber>
            <StatHelpText>Current ETH Block is: {this.state.block}</StatHelpText>
          </Stat>
      );
    }
  }

  render() {
    return(
      <Box align="right">
        {this.renderMetamask()}
      </Box>
    )
  }
}