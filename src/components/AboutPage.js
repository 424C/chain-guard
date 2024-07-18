import React from 'react';
import Header from './Header';
import Footer from './Footer';

function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-6 text-[#1a237e]">About ChainGuard Solutions</h1>
        <div className="bg-white shadow-lg rounded-lg p-6">
          <p className="mb-4">
            ChainGuard was founded in 2024 by a passionate solo developer with a vision to democratize financial security in the digital age. Recognizing the pressing need for trustless, decentralized solutions in both escrow and custody services, I set out to create a platform that would serve as a public good for the blockchain community.
          </p>
          <p className="mb-4">
            As a solo developer with a background in blockchain technology and cybersecurity, I've poured my expertise and dedication into crafting ChainGuard. This platform offers two core services: a secure escrow system for trustless transactions and a robust custodial timelock service for asset protection and scheduled releases.
          </p>
          <p className="mb-4">
            ChainGuard's mission is to provide accessible, transparent, and efficient financial tools that leverage the power of blockchain technology. By eliminating intermediaries and utilizing smart contracts on the Ethereum network, ChainGuard ensures that users have full control over their assets while benefiting from the security and immutability of the blockchain.
          </p>
          <p className="mb-4">
            What sets ChainGuard apart is its commitment to being a public good. As an open-source project, ChainGuard invites scrutiny, collaboration, and continuous improvement from the global developer community. This approach not only enhances the security and reliability of the platform but also fosters innovation in the decentralized finance space.
          </p>
          <p className="mb-4">
            ChainGuard is more than just a service; it's a testament to the power of individual initiative in creating solutions that benefit the many. As the sole developer, my goal is to continually refine and expand ChainGuard's capabilities, always with the end-user in mind. Whether you're an individual looking to secure a personal transaction or a business seeking robust custodial solutions, ChainGuard is here to serve your needs.
          </p>
          <p>
            Join me in embracing the future of decentralized finance. With ChainGuard, we're not just transacting and storing assets; we're building a more secure, transparent, and accessible financial ecosystem for all.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default AboutPage;