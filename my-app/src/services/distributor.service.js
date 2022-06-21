import { DISTRIBUTOR_ABI } from '../contracts-config';
import { ethers, BigNumber } from "ethers";
import BinagoriansDataService from "./binagorians.service.js";

class DistributorDataService {

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

    async canClaim(address, amount, proof) {
        const dAddress = await BinagoriansDataService.getMerkleDistributorAddress();
        const distributorContract = this.getDistributorContract(dAddress);
        const response = distributorContract.canClaim(address, BigNumber.from(amount), proof);
        return response;
    }
    
    async claim(address, amount, proof) {
        const dAddress = await BinagoriansDataService.getMerkleDistributorAddress();
        const distributorContract = this.getDistributorContract(dAddress);
        const response = distributorContract.claim(address, BigNumber.from(amount), proof);
        return response;
    }
}
export default new DistributorDataService();