import React, { Component } from "react";
import { ethers, utils } from "ethers";
import {
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Box,
  Button,
  Spinner
} from '@chakra-ui/react';
import ContractsService from "../services/contracts.service.js";
import { PendingTxsContext } from "../contexts/pending-txs-context";
import { BINAGORIANS_ADDRESS } from '../contracts-config';

export default class BinagorianProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
        name: "",
        createdDate: "", 
        rate: 0,
        connected: ""
      };
    
    window.ethereum.on('accountsChanged', (accounts) => {
      // Handle the new accounts, or lack thereof.
      // "accounts" will always be an array, but it can be empty.
      this.connectToMetamask();
    });

    window.ethereum.on('connect', (accounts) => {
      // Handle the new accounts, or lack thereof.
      // "accounts" will always be an array, but it can be empty.
      this.connectToMetamask();
    });

    window.ethereum.on('disconnect', (accounts) => {
      // Handle the new accounts, or lack thereof.
      // "accounts" will always be an array, but it can be empty.
      this.connectToMetamask();
    });
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
    const tokenBalanceInContract = await binacoinContract.balanceOf(BINAGORIANS_ADDRESS);
    const tokenUnits = await binacoinContract.decimals();
    const tokenBalanceInEther = utils.formatUnits(tokenBalance, tokenUnits);
    const tokenBalanceInContractInEther = utils.formatUnits(tokenBalanceInContract, tokenUnits);

    this.setState({ selectedAddress: accounts[0], balance: balanceInEther, block, tokenName, tokenBalanceInEther, tokenBalanceInContractInEther });
  }

  renderMetamask() {
    if (!this.state.selectedAddress) {
      return (
        <Button onClick={() => this.connectToMetamask()}>Connect to Metamask</Button>
      )
    } else {
      return (
        <PendingTxsContext.Consumer>
          {({pendingTxs}) => (
          <Stat>
            <StatLabel hidden={pendingTxs === 0}>Pending Txs: {pendingTxs} <Spinner/></StatLabel>
            <StatLabel>Your ETH Balance is: {this.state.balance}</StatLabel>
            <StatLabel>Balance of {this.state.tokenName} is: {this.state.tokenBalanceInEther}</StatLabel>
            <StatLabel>Balance of {this.state.tokenName} in contract is: {this.state.tokenBalanceInContractInEther}</StatLabel>
            <StatNumber>Welcome {this.state.selectedAddress} - { this.state.name }</StatNumber>
            <StatHelpText>Current ETH Block is: {this.state.block}</StatHelpText>
          </Stat>
          )}
        </PendingTxsContext.Consumer>
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