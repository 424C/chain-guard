import React from 'react';
import Header from './Header';
import Footer from './Footer';

function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-6 text-[#1a237e]">About ChainGuard Escrow</h1>
        <div className="bg-white shadow-lg rounded-lg p-6">
          <p className="mb-4">
            ChainGuard Escrow was founded in 2024 by a team of blockchain enthusiasts and cybersecurity experts. Our mission is to provide secure, transparent, and efficient escrow services leveraging the power of blockchain technology.
          </p>
          <p className="mb-4">
            With the rise of digital transactions and decentralized finance, we recognized the need for a trustless escrow solution that could cater to both individuals and businesses. ChainGuard Escrow was born out of this vision, combining cutting-edge blockchain technology with user-friendly interfaces.
          </p>
          <p className="mb-4">
            Our team brings together expertise from various fields including blockchain development, smart contract auditing, financial services, and user experience design. This diverse skill set allows us to offer a comprehensive escrow service that is not only secure and efficient but also intuitive and accessible to users of all backgrounds.
          </p>
          <p className="mb-4">
            At ChainGuard Escrow, we believe in the potential of blockchain to revolutionize traditional financial services. Our platform utilizes smart contracts on the Ethereum blockchain to automate and secure the escrow process, eliminating the need for intermediaries and reducing the risk of fraud.
          </p>
          <p>
            As we continue to grow and evolve, our commitment remains steadfast: to provide our users with the most secure, transparent, and efficient escrow services in the blockchain space. Join us in shaping the future of digital transactions with ChainGuard Escrow.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default AboutPage;