import { BINAGORIANS_ABI, BINAGORIANS_ADDRESS, DISTRIBUTOR_ABI, BINACOIN_ABI, BINACOIN_ADDRESS } from '../contracts-config';
import { ethers, BigNumber } from "ethers";

class BinagoriansDataService {
  
  getBinagoriansContract() {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      return new ethers.Contract(
          BINAGORIANS_ADDRESS,
          BINAGORIANS_ABI,
          signer
      );
    }
  }

  getDistributorContract(distributorAddress) {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      return new ethers.Contract(
          distributorAddress,
          DISTRIBUTOR_ABI,
          signer
      );
    }
  }

  getBinacoinContract() {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      return new ethers.Contract(
          BINACOIN_ADDRESS,
          BINACOIN_ABI,
          signer
      );
    }
  }

  create(data) {
    const contract = this.getBinagoriansContract();
    const response = contract.create(data.address, data.createdDate, data.name, data.rate);
    return response;
  }

  getCurrent() {
    const contract = this.getBinagoriansContract();
    const response = contract.getCurrent();
    return response;
  }

  get(address) {
    const contract = this.getBinagoriansContract();
    const response = contract.get(address);
    return response;
  }

  getRegisteredAddresses() {
    const contract = this.getBinagoriansContract();
    const response = contract.getRegisteredAddresses();
    return response;
  }

  delete(address) {
    const contract = this.getBinagoriansContract();
    const response = contract.remove(address);
    return response;
  }

  getAirdropAmounts() {
    const contract = this.getBinagoriansContract();
    const response = contract.getAirdropAmounts();
    return response;
  }

  generateAirdrop(tokenAddress, root) {
    const contract = this.getBinagoriansContract();
    const response = contract.generateAirdrop(tokenAddress, root);
    return response;
  }

  async canClaim(address, amount, proof) {
    const binagoriansContract = this.getBinagoriansContract();
    const dAddress = await binagoriansContract.distributor();

    const distributorContract = this.getDistributorContract(dAddress);
    const response = distributorContract.canClaim(address, amount, proof);
    return response;
  }

  async claim(address, amount, proof) {
    const binagoriansContract = this.getBinagoriansContract();
    const dAddress = await binagoriansContract.distributor();

    const distributorContract = this.getDistributorContract(dAddress);
    const response = distributorContract.claim(address, BigNumber.from(amount), proof);
    return response;
  }

  getMerkleDistributorAddress() {
    const contract = this.getBinagoriansContract();
    const response = contract.distributor();
    return response;
  }

  async mintToDistributor(amount) {
    const dAddress = await this.getMerkleDistributorAddress();
    const binacoinContract = this.getBinacoinContract();
    const binacoinDecimals = await binacoinContract.decimals();
    const response = binacoinContract.mint(dAddress, BigNumber.from(amount).mul(BigNumber.from(10).pow(BigNumber.from(binacoinDecimals))));
    return response;
  }

  async getDistributorBalance() {
    const dAddress = await this.getMerkleDistributorAddress();
    const binacoinContract = this.getBinacoinContract();
    const response = binacoinContract.balanceOf(dAddress);
    return response;
  }
}
export default new BinagoriansDataService();