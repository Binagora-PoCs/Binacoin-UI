import { BINAGORIANS_ABI, BINAGORIANS_ADDRESS } from '../contracts-config';
import { ethers } from "ethers";

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

  async getTxs() {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      provider.waitForTransaction()
      const count = await provider.getTransactionCount('0xdD2FD4581271e230360230F9337D5c0430Bf44C0');
      return count;
    }

    return 0;
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

  generateAirdrop(tokenAddress) {
    const contract = this.getBinagoriansContract();
    const response = contract.generateAirdrop(tokenAddress);
    return response;
  }
}
export default new BinagoriansDataService();