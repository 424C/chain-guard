import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Web3Service from '../services/Web3Service';
import Header from './Header';
import Footer from './Footer';

function EscrowApp() {
    const [isConnected, setIsConnected] = useState(false);
    const [address, setAddress] = useState('');
    const [escrows, setEscrows] = useState([]);
    const [error, setError] = useState('');
    const [showNewEscrowForm, setShowNewEscrowForm] = useState(false);
    const [newEscrow, setNewEscrow] = useState({
        arbiter: '',
        beneficiary: '',
        amount: ''
    });
    const [transactionStatus, setTransactionStatus] = useState('');

    useEffect(() => {
        checkConnection();
        if (window.ethereum) {
            window.ethereum.on('accountsChanged', handleAccountsChanged);
            return () => {
                window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
            };
        }
    }, []);

    const handleAccountsChanged = async (accounts) => {
        if (accounts.length === 0) {
            setIsConnected(false);
            setAddress('');
        } else {
            setAddress(accounts[0]);
            loadEscrows();
        }
    };

    const checkConnection = async () => {
        try {
            const connected = await Web3Service.isConnected();
            setIsConnected(connected);
            if (connected) {
                const addr = await Web3Service.getAddress();
                setAddress(addr);
                loadEscrows();
            }
        } catch (error) {
            console.error("Error checking connection:", error);
            setError("Failed to check wallet connection");
        }
    };

    const connectWallet = async () => {
        try {
            const connected = await Web3Service.connect();
            if (connected) {
                setIsConnected(true);
                const addr = await Web3Service.getAddress();
                setAddress(addr);
                loadEscrows();
            } else {
                setError("Failed to connect wallet");
            }
        } catch (error) {
            console.error("Error connecting wallet:", error);
            setError("Failed to connect wallet: " + error.message);
        }
    };

    const loadEscrows = async () => {
        try {
            setTransactionStatus('Loading escrows...');
            const escrowsList = await Web3Service.getEscrows();
            setEscrows(escrowsList);
            setTransactionStatus('');
        } catch (error) {
            console.error("Error loading escrows:", error);
            setError("Failed to load escrows");
            setTransactionStatus('');
        }
    };

    const handleNewEscrowChange = (e) => {
        setNewEscrow({ ...newEscrow, [e.target.name]: e.target.value });
    };

    const handleNewEscrowSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            setTransactionStatus('Creating new escrow...');
            await Web3Service.createEscrow(newEscrow.arbiter, newEscrow.beneficiary, newEscrow.amount);
            setShowNewEscrowForm(false);
            setTransactionStatus('New escrow created! Refreshing list...');
            await loadEscrows();
            setTransactionStatus('');
        } catch (error) {
            console.error('Error creating new escrow:', error);
            setError(`Failed to create new escrow: ${error.message}`);
            setTransactionStatus('');
        }
    };

    const handleApprove = async (escrowAddress) => {
        try {
            setTransactionStatus(`Approving escrow ${escrowAddress}...`);
            await Web3Service.approveEscrow(escrowAddress);
            setTransactionStatus('Escrow approved! Refreshing list...');
            await loadEscrows();
            setTransactionStatus('');
        } catch (error) {
            console.error('Error approving escrow:', error);
            setError(`Failed to approve escrow: ${error.message}`);
            setTransactionStatus('');
        }
    };

    const handleRefund = async (escrowAddress) => {
        try {
            setTransactionStatus(`Refunding escrow ${escrowAddress}...`);
            await Web3Service.refundEscrow(escrowAddress);
            setTransactionStatus('Escrow refunded! Refreshing list...');
            await loadEscrows();
            setTransactionStatus('');
        } catch (error) {
            console.error('Error refunding escrow:', error);
            setError(`Failed to refund escrow: ${error.message}`);
            setTransactionStatus('');
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8">
                <motion.h1 
                    className="text-3xl font-bold mb-6 text-center"
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    ChainGuard Escrow
                </motion.h1>
                
                <AnimatePresence>
                    {error && (
                        <motion.div 
                            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
                            role="alert"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <strong className="font-bold">Error:</strong>
                            <span className="block sm:inline"> {error}</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {transactionStatus && (
                        <motion.div 
                            className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative mb-4"
                            role="alert"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <strong className="font-bold">Status:</strong>
                            <span className="block sm:inline"> {transactionStatus}</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                {!isConnected ? (
                    <motion.div 
                        className="text-center"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        <button 
                            onClick={connectWallet}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Connect Wallet
                        </button>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <p className="mb-4">Connected Address: {address}</p>
                        
                        <motion.button
                            onClick={() => setShowNewEscrowForm(!showNewEscrowForm)}
                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-4"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {showNewEscrowForm ? 'Cancel' : 'New Escrow'}
                        </motion.button>

                        <AnimatePresence>
                            {showNewEscrowForm && (
                                <motion.form 
                                    onSubmit={handleNewEscrowSubmit} 
                                    className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
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
                                            onChange={handleNewEscrowChange}
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
                                            onChange={handleNewEscrowChange}
                                            placeholder="0x..."
                                            required
                                        />
                                    </div>
                                    <div className="mb-6">
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
                                            onChange={handleNewEscrowChange}
                                            placeholder="0.1"
                                            required
                                        />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <motion.button
                                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                            type="submit"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            Create Escrow
                                        </motion.button>
                                    </div>
                                </motion.form>
                            )}
                        </AnimatePresence>

                        <motion.div 
                            className="mt-8"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <h2 className="text-2xl font-bold mb-4">Your Escrows</h2>
                            {escrows.length === 0 ? (
                                <p>No escrows found.</p>
                            ) : (
                                <motion.ul layout>
                                    <AnimatePresence>
                                        {escrows.map((escrow, index) => (
                                            <motion.li 
                                                key={escrow.address}
                                                className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
                                                initial={{ opacity: 0, y: 50 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -50 }}
                                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                            >
                                                <p>Address: {escrow.address}</p>
                                                <p>Arbiter: {escrow.arbiter}</p>
                                                <p>Beneficiary: {escrow.beneficiary}</p>
                                                <p>Balance: {escrow.amount} ETH</p>
                                                <p>Status: {
                                                    escrow.isApproved ? 'Approved' : 
                                                    escrow.isRefunded ? 'Refunded' : 
                                                    escrow.balance === '0' ? 'Completed' : 'Pending'
                                                }</p>
                                                {!escrow.isApproved && !escrow.isRefunded && escrow.balance !== '0' && (
                                                    <div className="mt-4">
                                                        <motion.button
                                                            onClick={() => handleApprove(escrow.address)}
                                                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2"
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.95 }}
                                                        >
                                                            Approve
                                                        </motion.button>
                                                        <motion.button
                                                            onClick={() => handleRefund(escrow.address)}
                                                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.95 }}
                                                        >
                                                            Refund
                                                        </motion.button>
                                                    </div>
                                                )}
                                            </motion.li>
                                        ))}
                                    </AnimatePresence>
                                </motion.ul>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </main>
            <Footer />
        </div>
    );
}

export default EscrowApp;