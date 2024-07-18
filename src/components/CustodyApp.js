import React, { useState, useEffect } from 'react';
import Web3Service from '../services/Web3Service';
import Header from './Header';
import Footer from './Footer';

function CustodyApp() {
    const [isConnected, setIsConnected] = useState(false);
    const [address, setAddress] = useState('');
    const [timeLocks, setTimeLocks] = useState([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [newTimeLock, setNewTimeLock] = useState({
        duration: '',
        amount: ''
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
                loadTimeLocks();
            }
        } catch (error) {
            console.error("Error checking connection:", error);
            setError("Failed to connect to wallet");
        }
    };

    const loadTimeLocks = async () => {
        setIsLoading(true);
        try {
            console.log("Loading time locks...");
            const timeLocksList = await Web3Service.getTimeLocks();
            console.log("Loaded time locks:", timeLocksList);
            setTimeLocks(timeLocksList);
        } catch (error) {
            console.error("Error loading time locks:", error);
            setError("Failed to load time locks: " + error.message);
        }
        setIsLoading(false);
    };

    const handleCreateTimeLock = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            await Web3Service.createTimeLock(newTimeLock.duration, newTimeLock.amount);
            setNewTimeLock({ duration: '', amount: '' });
            await loadTimeLocks();
        } catch (error) {
            console.error("Error creating time lock:", error);
            setError(`Failed to create time lock: ${error.message}`);
        }
        setIsLoading(false);
    };

    const handleRelease = async (timeLockAddress) => {
        setIsLoading(true);
        setError('');
        try {
            await Web3Service.releaseTimeLock(timeLockAddress);
            await loadTimeLocks();
        } catch (error) {
            console.error("Error releasing time lock:", error);
            setError(`Failed to release time lock: ${error.message}`);
        }
        setIsLoading(false);
    };

    const handleInputChange = (e) => {
        setNewTimeLock({ ...newTimeLock, [e.target.name]: e.target.value });
    };

    const formatRemainingTime = (seconds) => {
        if (seconds <= 0) return "Ready for release";
        
        const months = Math.floor(seconds / (30 * 24 * 60 * 60));
        const days = Math.floor((seconds % (30 * 24 * 60 * 60)) / (24 * 60 * 60));
        const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
        
        let result = [];
        if (months > 0) result.push(`${months} month${months !== 1 ? 's' : ''}`);
        if (days > 0) result.push(`${days} day${days !== 1 ? 's' : ''}`);
        if (hours > 0) result.push(`${hours} hour${hours !== 1 ? 's' : ''}`);
        
        return result.join(', ');
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-6 text-center">ChainGuard Custody</h1>
                
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
                        
                        <form onSubmit={handleCreateTimeLock} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="duration">
                                    Duration (months)
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="duration"
                                    type="number"
                                    name="duration"
                                    value={newTimeLock.duration}
                                    onChange={handleInputChange}
                                    placeholder="3"
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
                                    value={newTimeLock.amount}
                                    onChange={handleInputChange}
                                    placeholder="0.1"
                                    required
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <button
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                    type="submit"
                                    disabled={isLoading}
                                >
                                    Create Time Lock
                                </button>
                            </div>
                        </form>

                        <div className="mt-8">
                            <h2 className="text-2xl font-bold mb-4">Your Time Locks</h2>
                            {timeLocks.length === 0 ? (
                                <p>No time locks found.</p>
                            ) : (
                                <ul>
                                    {timeLocks.map((timeLock) => (
                                        <li key={timeLock.address} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                                            <p>Address: {timeLock.address}</p>
                                            <p>Beneficiary: {timeLock.beneficiary}</p>
                                            <p>Amount: {timeLock.amount} ETH</p>
                                            <p>Release Time: {timeLock.releaseTime}</p>
                                            <p>Remaining Time: {formatRemainingTime(timeLock.remainingTime)}</p>
                                            {timeLock.remainingTime <= 0 && (
                                                <div className="mt-4">
                                                    <button
                                                        onClick={() => handleRelease(timeLock.address)}
                                                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                                                        disabled={isLoading}
                                                    >
                                                        Release Funds
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

export default CustodyApp;