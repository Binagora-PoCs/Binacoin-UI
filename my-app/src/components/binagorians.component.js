import React, { Component } from "react";
import DataTable  from './data-table.component'
import { TableContainer, Button, Box } from '@chakra-ui/react';
import BinagoriansDataService from "../services/binagorians.service.js";
import BinacoinDataService from "../services/binacoin.service.js";
import DistributorDataService from "../services/distributor.service.js";
import { utils } from "ethers";
import { MerkleTree } from "merkletreejs";
import keccak256 from "keccak256";
import { BINACOIN_ADDRESS } from '../contracts-config';

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
              Header: 'Airdrop amount',
              accessor: 'airdropAmount',
              isNumeric: true
            },
            {
              Header: 'Action',
              accessor: (originalRow, rowIndex) => (
                <div>
                    <Button onClick={() => this.handleEdit(originalRow)}>Edit</Button>
                    <Button onClick={() => this.handleDelete(originalRow)}>Delete</Button>
                    <Button onClick={() => this.handleCanClaim(originalRow)}>Can Claim</Button>
                    <Button onClick={() => this.handleClaim(originalRow)}>Claim</Button>
                </div>
             ),
             id: 'action',
            }
          ]
      };
    
      this.getBinagorians();
  }

  async handleDelete(row) {
    const binagoriansContract = BinagoriansDataService.getBinagoriansContract();
    binagoriansContract.remove(row.address);
    binagoriansContract.on("Deleted", (address) => {
      // Here the Binagorian is effectively deleted in the blockchain
      if (address == row.address) {
        // Reload the grid
        this.getBinagorians();
      }
    });
  }

  handleEdit(row) {
    // TODO: Move to a page to update rate
  }

  handleCanClaim(row) {
    this.canClaim(row.address, row.airdropAmount);
  }

  handleClaim(row) {
    this.claim(row.address, row.airdropAmount);
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
          rate: binagorianResponse.rate.toString(),
          airdropAmount: binagorianResponse.airdropAmount.toString()
        });
    };

    this.setState({
      loadingData : false,
      data : binagorians,
    });
  }

  async generateAirdrop() {
    const airdropAmounts = await BinagoriansDataService.getAirdropAmounts();
    const elements = airdropAmounts.map((x) =>
        utils.solidityKeccak256(["address", "uint256"], [x.addr, x.amount])
    );
    const merkleTree = new MerkleTree(elements, keccak256, { sort: true });
    const root = merkleTree.getHexRoot();

    BinagoriansDataService.generateAirdrop(BINACOIN_ADDRESS, root);
  }

  async canClaim(address, amount) {
    const airdropAmounts = await BinagoriansDataService.getAirdropAmounts();
    const elements = airdropAmounts.map((x) =>
        utils.solidityKeccak256(["address", "uint256"], [x.addr, x.amount])
    );
    const merkleTree = new MerkleTree(elements, keccak256, { sort: true });
    const leaf = utils.solidityKeccak256(["address", "uint256"], [address, amount]);
    const proof = merkleTree.getHexProof(leaf);

    let response = await DistributorDataService.canClaim(address, amount, proof);
    alert(response);
  }

  async claim(address, amount) {
    const airdropAmounts = await BinagoriansDataService.getAirdropAmounts();
    const elements = airdropAmounts.map((x) =>
        utils.solidityKeccak256(["address", "uint256"], [x.addr, x.amount])
    );
    const merkleTree = new MerkleTree(elements, keccak256, { sort: true });
    const leaf = utils.solidityKeccak256(["address", "uint256"], [address, amount]);
    const proof = merkleTree.getHexProof(leaf);

    let response = await DistributorDataService.claim(address, amount, proof);
    alert(response);
  }

  async getDistributorData() {
    const distributorAddress = await BinagoriansDataService.getMerkleDistributorAddress();
    const distributorBalance = await BinacoinDataService.getBalance(distributorAddress);

    alert("address: " + distributorAddress + ". balance: " + distributorBalance);
  }

  async mintToDistributor() {
    const mdAddress = await BinagoriansDataService.getMerkleDistributorAddress();
    BinacoinDataService.mintTo(100, mdAddress);
  }

  render() {
    return (
        <Box>
          <Button colorScheme='blue' size='sm' onClick={this.generateAirdrop}>Generate new airdrop</Button>
          <Button colorScheme='blue' size='sm' onClick={this.getDistributorData}>Get Distributor data</Button>
          <Button colorScheme='blue' size='sm' onClick={this.mintToDistributor}>Mint to distributor</Button>
          <TableContainer>
              { this.state.loadingData ? (
                  <p>Loading Please wait...</p>
              ) : (
              <DataTable data={this.state.data} columns={this.state.columns}/>
              )}
          </TableContainer>
        </Box>
    );
  }
}