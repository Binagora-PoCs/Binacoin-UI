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
import BinagoriansDataService from "../services/binagorians.service.js";
import BinacoinDataService from "../services/binacoin.service.js";
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
    BinagoriansDataService.getCurrent()
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

  getTxs() {
    BinagoriansDataService.getTxs()
      .then(response => {
        this.setState({
          txs : response
        })
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
    this.getTxs();

    provider.on("block", (block) => {
      this.setState({ block })
    });

    // let contract = BinagoriansDataService.getBinagoriansContract();
    // contract.on("Created", (address) => {
    //   if (address) {
    //     alert('created binagorian: ' + address);
    //   }
    // });

    const tokenName = await BinacoinDataService.getName();
    const tokenBalance = await BinacoinDataService.getBalance(accounts[0]);
    const tokenUnits = await BinacoinDataService.decimals();
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