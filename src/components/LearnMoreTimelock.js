import React from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';

function LearnMoreTimelock() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <section className="mb-12 bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold mb-6 text-[#1a237e]">Understanding Custodial Timelocks</h2>
          <p className="mb-4">
            Custodial Timelocks are smart contracts that lock assets for a predetermined period, 
            releasing them only when specific conditions are met.
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Automated fund release based on time conditions</li>
            <li>Immutable and transparent contract terms</li>
            <li>Decentralized custody without intermediaries</li>
          </ul>
        </section>

        <section className="mb-12 bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold mb-6 text-[#1a237e]">Key Benefits of Timelocks</h2>
          <ul className="list-disc pl-6 space-y-4">
            <li>Enhanced Security: Cryptographic protection against unauthorized access</li>
            <li>Trustless Operations: No need for third-party custodians</li>
            <li>Transparency: All parties can verify contract terms and execution</li>
            <li>Cost-Effective: Reduced overhead compared to traditional custodial services</li>
            <li>Flexibility: Customizable timelock periods</li>
            <li>Global Accessibility: Operate across borders without intermediaries</li>
          </ul>
        </section>

        <section className="mb-12 bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold mb-6 text-[#1a237e]">Use Cases for Custodial Timelocks</h2>
          <ul className="list-disc pl-6 space-y-4">
            <li>Token Vesting: Gradual release of tokens for team members or investors</li>
            <li>Inheritance Planning: Secure asset transfer to beneficiaries after a set period</li>
            <li>Time-Bound Donations: Schedule charitable contributions</li>
            <li>Savings Accounts: Self-imposed restrictions on fund accessibility</li>
            <li>Deferred Payments: Automate future payments for goods or services</li>
          </ul>
        </section>

        <section className="mb-12 bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold mb-6 text-[#1a237e]">How Our Timelock Service Works</h2>
          <ol className="list-decimal pl-6 space-y-4">
            <li>Connect your wallet to our dApp</li>
            <li>Specify the beneficiary address and lock duration</li>
            <li>Deposit the assets you want to timelock</li>
            <li>Confirm the transaction to deploy the smart contract</li>
            <li>Monitor the lock status through our intuitive interface</li>
            <li>Assets become available to the beneficiary when the timelock expires</li>
          </ol>
        </section>

        <section className="mb-12 bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold mb-6 text-[#1a237e]">Security</h2>
          <p className="mb-4">
            We implement best practices in smart contract development 
            to ensure the highest level of security for your assets.
          </p>
          <p>
            For transparency, all our smart contract code is open-source and verifiable on the blockchain.
          </p>
        </section>

        <div className="text-center">
          <Link to="/custody" className="bg-[#ffa000] hover:bg-[#ffb300] text-white font-bold py-3 px-8 rounded-full text-xl transition duration-300 shadow-md hover:shadow-lg inline-block">
            Try ChainGuard Timelock Now
          </Link>
        </div>
      </main>

      <footer className="bg-[#1a237e] text-white p-4 shadow-md mt-12">
        <div className="container mx-auto text-center">
          <p>&copy; {new Date().getFullYear()} ChainGuard Timelock. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default LearnMoreTimelock;