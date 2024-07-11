import { ethers } from 'ethers';
import EscrowFactory from '../artifacts/contracts/EscrowFactory.sol/EscrowFactory.json';
import ChainGuardEscrow from '../artifacts/contracts/ChainGuardEscrow.sol/ChainGuardEscrow.json';
import TimeLockFactory from '../artifacts/contracts/TimeLockFactory.sol/TimeLockFactory.json';
import TimeLock from '../artifacts/contracts/TimeLock.sol/TimeLock.json';

class Web3Service {
    constructor() {
        this.provider = null;
        this.signer = null;
        this.escrowFactoryAddress = "0x447e9BBfE5010BeF5460De7e4eCcAE186a9cf78c";
        this.timeLockFactoryAddress = "0x3E23F35b523C61af24255F1F81db6A6E26FbAcac";
    }

    async connect() {
        if (typeof window.ethereum !== 'undefined') {
            this.provider = new ethers.BrowserProvider(window.ethereum);
            this.signer = await this.provider.getSigner();
            return true;
        }
        return false;
    }

    async getFactoryContract() {
        if (!this.signer) await this.connect();
        return new ethers.Contract(this.factoryAddress, EscrowFactory.abi, this.signer);
    }

    async createEscrow(arbiter, beneficiary, amount, durationInDays) {
        const factory = await this.getFactoryContract();
        const tx = await factory.createEscrow(arbiter, beneficiary, durationInDays, { value: ethers.parseEther(amount) });
        const receipt = await tx.wait();
        const event = receipt.logs.find(log => log.fragment.name === 'EscrowCreated');
        return event.args.escrowAddress;
    }

    async getEscrows() {
        const factory = await this.getFactoryContract();
        const escrowAddresses = await factory.getEscrows();
        const escrows = await Promise.all(escrowAddresses.map(async (address) => {
            const contract = new ethers.Contract(address, ChainGuardEscrow.abi, this.provider);
            const arbiter = await contract.arbiter();
            const depositor = await contract.depositor();
            const beneficiary = await contract.beneficiary();
            const isApproved = await contract.isApproved();
            const balance = await this.provider.getBalance(address);
            const remainingTime = await contract.getRemainingTime();
            return {
                address,
                arbiter,
                depositor,
                beneficiary,
                amount: ethers.formatEther(balance),
                isApproved,
                remainingTime: Number(remainingTime)
            };
        }));
        return escrows;
    }

    async approveEscrow(escrowAddress) {
        const escrow = new ethers.Contract(escrowAddress, ChainGuardEscrow.abi, this.signer);
        const tx = await escrow.approve();
        await tx.wait();
    }

    async refundEscrow(escrowAddress) {
        const escrow = new ethers.Contract(escrowAddress, ChainGuardEscrow.abi, this.signer);
        const tx = await escrow.refund();
        await tx.wait();
    }

async getTimeLockFactoryContract() {
    if (!this.signer) await this.connect();
    return new ethers.Contract(this.timeLockFactoryAddress, TimeLockFactory.abi, this.signer);
}

async createTimeLock(durationInMonths, amount) {
    const factory = await this.getTimeLockFactoryContract();
    const tx = await factory.createTimeLock(durationInMonths, { value: ethers.parseEther(amount) });
    const receipt = await tx.wait();
    const event = receipt.logs.find(log => log.eventName === 'TimeLockCreated');
    return event.args.timeLockAddress;
}

async getTimeLocks() {
    const factory = await this.getTimeLockFactoryContract();
    const timeLockAddresses = await factory.getTimeLocks();
    const timeLocks = await Promise.all(timeLockAddresses.map(async (address) => {
        const contract = new ethers.Contract(address, TimeLock.abi, this.provider);
        const beneficiary = await contract.beneficiary();
        const releaseTime = await contract.releaseTime();
        const balance = await contract.getBalance();
        const remainingTime = await contract.getRemainingTime();
        return {
            address,
            beneficiary,
            releaseTime: new Date(releaseTime * 1000).toLocaleString(),
            amount: ethers.formatEther(balance),
            remainingTime: Math.floor(remainingTime / (30 * 24 * 60 * 60)) // Convert to months
        };
    }));
    return timeLocks;
}

async releaseTimeLock(timeLockAddress) {
    const timeLock = new ethers.Contract(timeLockAddress, TimeLock.abi, this.signer);
    const tx = await timeLock.release();
    await tx.wait();
}
}


export default new Web3Service();