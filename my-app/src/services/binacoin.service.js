import { BINACOIN_ABI, BINACOIN_ADDRESS } from '../contracts-config';
import { ethers, BigNumber } from "ethers";

class BinacoinDataService {

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

    async mintTo(amount, address) {
        const binacoinContract = this.getBinacoinContract();
        const binacoinDecimals = await binacoinContract.decimals();
        const response = binacoinContract.mint(address, BigNumber.from(amount).mul(BigNumber.from(10).pow(BigNumber.from(binacoinDecimals))));
        return response;
    }
    
    async getBalance(address) {
        const binacoinContract = this.getBinacoinContract();
        const response = binacoinContract.balanceOf(address);
        return response;
    }

    async getName() {
        const binacoinContract = this.getBinacoinContract();
        const response = binacoinContract.name();
        return response;
    }

    async decimals() {
        const binacoinContract = this.getBinacoinContract();
        const response = binacoinContract.decimals();
        return response;
    }
}
export default new BinacoinDataService();