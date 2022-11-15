import React, { Component } from "react";
import { Button, Box } from '@chakra-ui/react';
import ContractsService from "../services/contracts.service.js";
import { BigNumber, utils } from "ethers";
import { PendingTxsContext } from "../contexts/pending-txs-context";

export default class Binagorians extends Component {
  constructor(props) {
    super(props);
  }

  async burnPto(incPendingTxs, decPendingTxs) {
    const binacoinContract = ContractsService.getBinacoinContract();
    const binacoinDecimals = await binacoinContract.decimals();
    // TODO: Need to allow user set the amount of PTOs to burn
    let tx = await binacoinContract.burn(utils.parseUnits("1", BigNumber.from(binacoinDecimals)));

    ContractsService.handleTxExecution(tx, incPendingTxs, decPendingTxs);
  }

  render() {
    return (
        <PendingTxsContext.Consumer>
          {({incPendingTxs, decPendingTxs}) => (
            <Box>
              <Button colorScheme='blue' size='sm' onClick={() => this.burnPto(incPendingTxs, decPendingTxs)}>Burn PTOs</Button>
            </Box>
          )}
        </PendingTxsContext.Consumer>
    );
  }
}