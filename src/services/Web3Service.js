import { ethers } from 'ethers';
import EscrowFactory from '../artifacts/contracts/EscrowFactory.sol/EscrowFactory.json';
import ChainGuardEscrow from '../artifacts/contracts/ChainGuardEscrow.sol/ChainGuardEscrow.json';

class Web3Service {
    constructor() {
        this.provider = null;
        this.signer = null;
        this.factoryAddress = "0xd8178DD0534A4faC3FD67b522d41761a754a9c8e"; // Replace with your deployed factory address
    }

    async connect() {
        if (typeof window.ethereum !== 'undefined') {
            try {
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                this.provider = new ethers.BrowserProvider(window.ethereum);
                this.signer = await this.provider.getSigner();
                
                // Check if we're on Sepolia
                const network = await this.provider.getNetwork();
                if (network.chainId !== 11155111n) { // Sepolia chain ID
                    throw new Error("Please connect to the Sepolia network");
                }
                
                return true;
            } catch (error) {
                console.error("User denied account access or wrong network", error);
                return false;
            }
        } else {
            console.log('Please install MetaMask!');
            return false;
        }
    }

    async isConnected() {
        if (this.signer) {
            return true;
        }
        if (typeof window.ethereum !== 'undefined') {
            const accounts = await window.ethereum.request({ method: 'eth_accounts' });
            if (accounts.length > 0) {
                await this.connect();
                return true;
            }
        }
        return false;
    }

    async getAddress() {
        if (!this.signer) {
            const connected = await this.connect();
            if (!connected) throw new Error("Wallet not connected");
        }
        return await this.signer.getAddress();
    }

    async getFactoryContract() {
        if (!this.signer) {
            await this.connect();
        }
        return new ethers.Contract(this.factoryAddress, EscrowFactory.abi, this.signer);
    }

    async createEscrow(arbiter, beneficiary, amount) {
        const factory = await this.getFactoryContract();
        const tx = await factory.createEscrow(arbiter, beneficiary, { value: ethers.parseEther(amount) });
        const receipt = await tx.wait();
        
        const event = receipt.logs.find(log => log.topics[0] === ethers.id("EscrowCreated(address,address,address,uint256)"));
        if (event) {
            const decodedEvent = factory.interface.parseLog({ topics: event.topics, data: event.data });
            const escrowDetails = {
                address: decodedEvent.args.escrowAddress,
                arbiter: decodedEvent.args.arbiter,
                beneficiary: decodedEvent.args.beneficiary,
                amount: ethers.formatEther(decodedEvent.args.amount),
                isApproved: false
            };
            return escrowDetails;
        }
    }

    async getEscrows() {
        try {
            const factory = await this.getFactoryContract();
            console.log("Factory contract retrieved");

            const escrowAddresses = await factory.getEscrows();
            console.log("Escrow addresses retrieved:", escrowAddresses);

            const escrows = await Promise.all(escrowAddresses.map(async (address) => {
                try {
                    const contract = new ethers.Contract(address, ChainGuardEscrow.abi, this.provider);
                    const arbiter = await contract.arbiter();
                    const beneficiary = await contract.beneficiary();
                    const isApproved = await contract.isApproved();
                    const isRefunded = await contract.isRefunded();
                    const balance = await this.provider.getBalance(address);
                    
                    return {
                        address,
                        arbiter,
                        beneficiary,
                        amount: ethers.formatEther(balance),
                        isApproved,
                        isRefunded
                    };
                } catch (error) {
                    console.error(`Error fetching details for escrow at ${address}:`, error);
                    return null;
                }
            }));

            console.log("Escrows retrieved:", escrows);
            return escrows.filter(escrow => escrow !== null);
        } catch (error) {
            console.error("Error in getEscrows:", error);
            throw error;
        }
    }

    async approveEscrow(escrowAddress) {
        const escrow = new ethers.Contract(escrowAddress, ChainGuardEscrow.abi, this.signer);
        const tx = await escrow.approve();
        await tx.wait();
    }

    async refundEscrow(escrowAddress) {
        if (!this.signer) {
            await this.connect();
        }
        const escrow = new ethers.Contract(escrowAddress, ChainGuardEscrow.abi, this.signer);
        
        try {
            const balance = await escrow.getBalance();
            console.log(`Contract balance: ${ethers.formatEther(balance)} ETH`);
            
            if (balance.isZero()) {
                throw new Error("Contract has no funds to refund");
            }
            
            const tx = await escrow.refund();
            await tx.wait();
            return tx;
        } catch (error) {
            console.error("Error in refundEscrow:", error);
            if (error.reason) {
                throw new Error(`Refund failed: ${error.reason}`);
            } else {
                throw error;
            }
        }
    }
}

export default new Web3Service();