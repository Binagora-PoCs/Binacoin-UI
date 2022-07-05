import { BINAGORIANS_ABI, BINAGORIANS_ADDRESS, BINACOIN_ABI, BINACOIN_ADDRESS } from '../contracts-config';
import { ethers } from "ethers";

class ContractsService {
  
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
  
}
export default new ContractsService();