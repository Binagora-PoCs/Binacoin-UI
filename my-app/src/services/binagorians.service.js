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

  create(data) {
    const contract = this.getBinagoriansContract();
    const response = contract.create(data.address, data.createdDate, data.name, data.rate);
    return response;
  }
}
export default new BinagoriansDataService();