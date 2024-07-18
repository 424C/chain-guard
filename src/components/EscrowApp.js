import React, { useState, useEffect } from 'react';
import Web3Service from '../services/Web3Service';
import Header from './Header';
import Footer from './Footer';

function EscrowApp() {
    const [isConnected, setIsConnected] = useState(false);
    const [address, setAddress] = useState('');
    const [escrows, setEscrows] = useState([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [newEscrow, setNewEscrow] = useState({
        arbiter: '',
        beneficiary: '',
        amount: '',
        duration: ''
    });

    useEffect(() => {
        checkConnection();
    }, []);

    const checkConnection = async () => {
        try {
            const connected = await Web3Service.connect();
            setIsConnected(connected);
            if (connected) {
                const addr = await Web3Service.signer.getAddress();
                setAddress(addr);
                loadEscrows();
            }
        } catch (error) {
            console.error("Error checking connection:", error);
            setError("Failed to connect to wallet");
        }
    };

    const loadEscrows = async () => {
        setIsLoading(true);
        try {
            console.log("Fetching escrows...");
            const escrowsList = await Web3Service.getEscrows();
            console.log("Fetched escrows:", escrowsList);
            setEscrows(escrowsList);
        } catch (error) {
            console.error("Error loading escrows:", error);
            setError("Failed to load escrows: " + error.message);
        }
        setIsLoading(false);
    };

    const handleCreateEscrow = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            await Web3Service.createEscrow(newEscrow.arbiter, newEscrow.beneficiary, newEscrow.amount, newEscrow.duration);
            setNewEscrow({ arbiter: '', beneficiary: '', amount: '', duration: '' });
            await loadEscrows();
        } catch (error) {
            console.error("Error creating escrow:", error);
            setError(`Failed to create escrow: ${error.message}`);
        }
        setIsLoading(false);
    };

    const handleApprove = async (escrowAddress) => {
        setIsLoading(true);
        setError('');
        try {
            await Web3Service.approveEscrow(escrowAddress);
            await loadEscrows();
        } catch (error) {
            console.error("Error approving escrow:", error);
            setError(`Failed to approve escrow: ${error.message}`);
        }
        setIsLoading(false);
    };

    const handleRefund = async (escrowAddress) => {
        setIsLoading(true);
        setError('');
        try {
            await Web3Service.refundEscrow(escrowAddress);
            await loadEscrows();
        } catch (error) {
            console.error("Error refunding escrow:", error);
            setError(`Failed to refund escrow: ${error.message}`);
        }
        setIsLoading(false);
    };

    const handleInputChange = (e) => {
        setNewEscrow({ ...newEscrow, [e.target.name]: e.target.value });
    };

    const formatRemainingTime = (seconds) => {
        const days = Math.floor(seconds / (3600 * 24));
        const hours = Math.floor((seconds % (3600 * 24)) / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        return `${days}d ${hours}h ${minutes}m`;
    };

    const canRefund = (escrow) => {
        return escrow.state === 'Pending' && 
               (address === escrow.arbiter || 
                (address === escrow.depositor && escrow.remainingTime === 0));
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-6 text-center">ChainGuard Escrow</h1>
                
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                        <strong className="font-bold">Error:</strong>
                        <span className="block sm:inline"> {error}</span>
                    </div>
                )}
    
                {!isConnected ? (
                    <div className="text-center">
                        <button 
                            onClick={checkConnection}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            disabled={isLoading}
                        >
                            Connect Wallet
                        </button>
                    </div>
                ) : (
                    <div>
                        <p className="mb-4">Connected Address: {address}</p>
                        
                        <form onSubmit={handleCreateEscrow} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="arbiter">
                                    Arbiter Address
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="arbiter"
                                    type="text"
                                    name="arbiter"
                                    value={newEscrow.arbiter}
                                    onChange={handleInputChange}
                                    placeholder="0x..."
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="beneficiary">
                                    Beneficiary Address
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="beneficiary"
                                    type="text"
                                    name="beneficiary"
                                    value={newEscrow.beneficiary}
                                    onChange={handleInputChange}
                                    placeholder="0x..."
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="amount">
                                    Amount (ETH)
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="amount"
                                    type="number"
                                    step="0.000000000000000001"
                                    name="amount"
                                    value={newEscrow.amount}
                                    onChange={handleInputChange}
                                    placeholder="0.1"
                                    required
                                />
                            </div>
                            <div className="mb-6">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="duration">
                                    Duration (days)
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="duration"
                                    type="number"
                                    name="duration"
                                    value={newEscrow.duration}
                                    onChange={handleInputChange}
                                    placeholder="30"
                                    required
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <button
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                    type="submit"
                                    disabled={isLoading}
                                >
                                    Create Escrow
                                </button>
                            </div>
                        </form>
    
                        <div className="mt-8">
                            <h2 className="text-2xl font-bold mb-4">Your Escrows</h2>
                            {escrows.length === 0 ? (
                                <p>No escrows found.</p>
                            ) : (
                                <ul>
                                    {escrows.map((escrow) => (
                                        <li key={escrow.address} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                                            <p>Address: {escrow.address}</p>
                                            <p>Arbiter: {escrow.arbiter}</p>
                                            <p>Beneficiary: {escrow.beneficiary}</p>
                                            <p>Amount: {escrow.amount} ETH</p>
                                            <p>Status: {escrow.state}</p>
                                            <p>Remaining Time: {formatRemainingTime(escrow.remainingTime)}</p>
                                            {escrow.state === 'Pending' && (
                                                <div className="mt-4">
                                                    <button
                                                        onClick={() => handleApprove(escrow.address)}
                                                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2"
                                                        disabled={isLoading || address !== escrow.arbiter}
                                                    >
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={() => handleRefund(escrow.address)}
                                                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                                                        disabled={isLoading || !canRefund(escrow)}
                                                    >
                                                        Refund
                                                    </button>
                                                </div>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                )}
    
                {isLoading && (
                    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
                        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
}

export default EscrowApp;