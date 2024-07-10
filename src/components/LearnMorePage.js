import React from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';

function LearnMorePage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <section className="mb-12 bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold mb-6 text-[#1a237e]">Problems with Traditional Escrow Solutions</h2>
          <ul className="list-disc pl-6 space-y-4">
            <li>High fees and long processing times</li>
            <li>Lack of transparency in the escrow process</li>
            <li>Dependence on centralized third parties</li>
            <li>Limited global accessibility</li>
            <li>Vulnerability to fraud and human error</li>
          </ul>
        </section>

        <section className="mb-12 bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold mb-6 text-[#1a237e]">The Ethereum-Based Escrow Solution</h2>
          <ul className="list-disc pl-6 space-y-4">
            <li>Smart contracts ensure automatic, trustless execution of escrow terms</li>
            <li>Transparent and immutable transaction records on the blockchain</li>
            <li>Decentralized system eliminates the need for intermediaries</li>
            <li>Global accessibility to anyone with an internet connection</li>
            <li>Programmable escrow conditions for complex transactions</li>
            <li>Reduced costs due to automation and disintermediation</li>
          </ul>
        </section>

        <section className="mb-12 bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold mb-6 text-[#1a237e]">Future-Proofing with Ethereum</h2>
          <ul className="list-disc pl-6 space-y-4">
            <li>Scalability improvements with Ethereum 2.0 and Layer 2 solutions</li>
            <li>Growing ecosystem of decentralized finance (DeFi) applications</li>
            <li>Interoperability with other blockchain networks</li>
            <li>Continuous development and improvement of the Ethereum network</li>
            <li>Increasing mainstream adoption of blockchain technology</li>
          </ul>
        </section>

        <div className="text-center">
          <Link to="/app" className="bg-[#ffa000] hover:bg-[#ffb300] text-white font-bold py-3 px-8 rounded-full text-xl transition duration-300 shadow-md hover:shadow-lg inline-block">
            Try ChainGuard Escrow Now
          </Link>
        </div>
      </main>

      <footer className="bg-[#1a237e] text-white p-4 shadow-md mt-12">
        <div className="container mx-auto text-center">
          <p>&copy; {new Date().getFullYear()} ChainGuard Escrow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default LearnMorePage;