import React, { useState } from 'react';
import Header from './Header';
import Footer from './Footer';

function FAQ() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleQuestion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqItems = [
    {
      question: "What is ChainGuard?",
      answer: "ChainGuard is a decentralized platform offering two main services: a secure blockchain escrow system and a custodial timelock service. It's designed to provide trustless, transparent, and efficient financial tools for individuals and businesses."
    },
    {
      question: "How does the escrow service work?",
      answer: "Our escrow service uses smart contracts on the Ethereum blockchain. When you create an escrow, funds are locked in the contract until predetermined conditions are met. Once fulfilled, the funds are released to the beneficiary. If conditions aren't met, funds can be refunded to the depositor."
    },
    {
      question: "What is a custodial timelock?",
      answer: "A custodial timelock is a smart contract that locks assets for a predetermined period. Once the specified time has elapsed, the assets are automatically released to the designated beneficiary. This service is useful for token vesting, scheduled payments, or creating time-bound savings."
    },
    {
      question: "Is ChainGuard secure?",
      answer: "Yes, ChainGuard prioritizes security. Our smart contracts are open-source and thoroughly tested before production. We leverage the security of the Ethereum blockchain and implement best practices in smart contract development. However, as with any blockchain interaction, users should exercise caution and understand the risks involved."
    },
    {
        question: "Who can access my funds?",
        answer: "For escrows, all funds are held in smart contracts and can only be moved between to either depositor or the beneficiary by the arbiter role. For custody, the contract holds all funds until maturity, and only the beneficiary can receive them. ChainGuard cannot access any customer funds."
    },
    {
        question: "What happens if my escrow arbiter is inactive?",
        answer: "Escrow creations use a depositor based duration input for terms of the contract. If this duration has passed, the depositor can recover all funds back to their account"
    },
    {
        question: "Can the contracts be changed after deployment?",
        answer: "No, all contracts deployed using ChainGuard are immutable and non upgradeable."
    },
    {
        question: "I entered a wrong address when creating my escrow. Are my funds lost?",
        answer: "ChainGuard was developed to be completely decentralized. We never have access to funds or permissions, so it is impossible to recover any user funds lost this way. Always confirm the wallet address of your arbiter and beneficiary before creating escrows."
    },
    {
      question: "What fees does ChainGuard charge?",
      answer: "ChainGuard doesn't charge any additional fees beyond the standard Ethereum network gas fees required for contract deployment and interactions. We've used the latest development methods to reduce gas usage as much as possible. ChainGuard operates as a public good and does not profit from the platform."
    },
    {
      question: "Can I cancel an escrow or timelock once it's created?",
      answer: "For escrows, only the arbiter can move funds after creation. For timelocks, once the contract is deployed, it cannot be cancelled or modified before the release time."
    },
    {
      question: "What cryptocurrencies does ChainGuard support?",
      answer: "ChainGuard supports Ether (ETH) on the Ethereum network. We're exploring options to expand to ERC20 tokens in the future."
    },
    {
      question: "How do I connect my wallet to use ChainGuard?",
      answer: "ChainGuard supports various Ethereum wallets including MetaMask and Coinbase Wallet. Simply click the 'Connect Wallet' button on our platform."
    },
    {
      question: "Is ChainGuard open-source?",
      answer: "Yes, ChainGuard is fully open-source. Our smart contract code and frontend application are available for review and contribution on GitHub. We believe in transparency and community-driven development."
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-6 text-[#1a237e]">Frequently Asked Questions</h1>
        <div className="bg-white shadow-lg rounded-lg p-6">
          {faqItems.map((item, index) => (
            <div key={index} className="mb-4">
              <button
                className="flex justify-between items-center w-full text-left font-semibold text-lg text-[#1a237e] hover:text-[#3f51b5] focus:outline-none"
                onClick={() => toggleQuestion(index)}
              >
                <span>{item.question}</span>
                <span>{activeIndex === index ? '−' : '+'}</span>
              </button>
              {activeIndex === index && (
                <p className="mt-2 text-gray-600">{item.answer}</p>
              )}
              <hr className="my-4" />
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default FAQ;