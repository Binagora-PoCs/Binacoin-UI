import React, { Component } from "react";
import { Box, TableContainer, Center} from '@chakra-ui/react';
import ContractsService from "../services/contracts.service.js";
import { BigNumber, utils } from "ethers";
import { PendingTxsContext } from "../contexts/pending-txs-context";
import DataTable  from './data-table.component'
import WithdrawalModal  from './withdrawal-modal.component'
import { useParams } from 'react-router-dom';

export function withRouter(Children){
  return(props)=>{

     const match  = {params: useParams()};
     return <Children {...props}  match = {match}/>
 }
}

class Binagorian extends Component {
  constructor(props) {
    super(props);
    this.state = {
        loadingData: true,
        data: [],
        columns: [
            {
              Header: 'Date',
              accessor: 'date',
            },
            {
              Header: 'Amount',
              accessor: 'amount',
            }
          ]
      };

      const address = this.props.match.params.address
    
      this.getBurns(address);
  }

  async burnPto(tokensToBurn, incPendingTxs, decPendingTxs) {
    const binacoinContract = ContractsService.getBinacoinContract();
    const binacoinDecimals = await binacoinContract.decimals();
    let tx = await binacoinContract.burn(utils.parseUnits(tokensToBurn, BigNumber.from(binacoinDecimals)));

    ContractsService.handleTxExecution(tx, incPendingTxs, decPendingTxs);
  }

  async getBurns(address) {
    let burns = [];
    const binacoinContract = ContractsService.getBinacoinContract();
    let tokenUnits = await binacoinContract.decimals();
    let burnsResponse
    if (!address)
      burnsResponse = await binacoinContract.getMyBurns();
    else
      burnsResponse = await binacoinContract.getBurnsByAddress(address);

    for (let b of burnsResponse) {
      let amountInEther = utils.formatUnits(b.amount, tokenUnits);
      burns.push({ 
        amount: amountInEther, 
        date: new Date(b.date * 1000).toDateString()
      });
    };

    this.setState({
      loadingData : false,
      data : burns
    });
  }

  render() {
    return (
        <PendingTxsContext.Consumer>
          {({incPendingTxs, decPendingTxs}) => (
            <Box>
              <WithdrawalModal incPendingTxs={incPendingTxs} decPendingTxs={decPendingTxs} burnPto={this.burnPto}/>

              <Center fontSize="xl">
                  Withdrawals
              </Center>
              <Center>
                <TableContainer>
                    { this.state.loadingData ? (
                        <p>Loading Please wait...</p>
                    ) : (
                    <DataTable data={this.state.data} columns={this.state.columns}/>
                    )}
                </TableContainer>  
              </Center>
              
            </Box>
          )}
        </PendingTxsContext.Consumer>
    );
  }
}

export default withRouter(Binagorian);