import React from 'react';
import { Link } from 'react-router-dom';
import { FaShieldAlt, FaFileAlt, FaHeadset, FaLightbulb, FaLock, FaUsers, FaBriefcase, FaUserTie, FaHome, FaWallet } from 'react-icons/fa';
import Header from './Header';
import Footer from './Footer';

function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="text-center mb-16 bg-gradient-to-r from-blue-500 to-purple-600 p-12 rounded-lg shadow-2xl text-white">
          <h2 className="text-5xl font-extrabold mb-6 leading-tight">Blockchain Escrow</h2>
          <p className="text-2xl mb-10 font-light">Smart contract based escrow solution</p>
          <div className="space-x-6">
            <Link to="/app" className="bg-white text-blue-600 hover:bg-blue-100 font-bold py-3 px-8 rounded-full text-xl transition duration-300 shadow-md hover:shadow-lg">
              Launch App
            </Link>
            <Link to="/learn-more" className="bg-transparent hover:bg-white hover:text-blue-600 text-white font-bold py-3 px-8 rounded-full text-xl transition duration-300 border-2 border-white">
              Learn More
            </Link>
          </div>
        </div>

        {/* New Custodial Timelock Section */}
        <div className="text-center mb-16 bg-gradient-to-r from-green-500 to-teal-600 p-12 rounded-lg shadow-2xl text-white">
          <h2 className="text-5xl font-extrabold mb-6 leading-tight">Custodial Timelock</h2>
          <p className="text-2xl mb-10 font-light">Time-based fund locking with permissionless release</p>
          <div className="space-x-6">
            <Link to="/custody" className="bg-white text-green-600 hover:bg-green-100 font-bold py-3 px-8 rounded-full text-xl transition duration-300 shadow-md hover:shadow-lg">
              Launch App
            </Link>
            <Link to="/learn-more-timelock" className="bg-transparent hover:bg-white hover:text-green-600 text-white font-bold py-3 px-8 rounded-full text-xl transition duration-300 border-2 border-white">
              Learn More
            </Link>
          </div>
        </div>

        {/* Rest of the existing content */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-4 text-center">Purpose Built for Our Clients</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: FaShieldAlt, title: "Decentralized Security" },
                { icon: FaFileAlt, title: "Clear Documentation" },
                { icon: FaHeadset, title: "24/7 Support" },
                { icon: FaLightbulb, title: "Latest Innovations" },
                { icon: FaLock, title: "Immutable Contracts" },
                { icon: FaUsers, title: "Community-Driven" }
              ].map((item, index) => (
                <div key={index} className="text-center p-2">
                  <item.icon className="text-3xl mb-2 mx-auto text-blue-500" />
                  <h4 className="font-semibold text-sm">{item.title}</h4>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-4 text-center">Our Customers</h3>
            <div className="grid grid-cols-3 gap-4">
              {[
                { icon: FaBriefcase, title: "Business", color: "text-blue-500" },
                { icon: FaUserTie, title: "Private Investors", color: "text-green-500" },
                { icon: FaHome, title: "Family", color: "text-red-500" }
              ].map((item, index) => (
                <div key={index} className="text-center p-2">
                  <item.icon className={`text-4xl mb-2 mx-auto ${item.color}`} />
                  <h4 className="font-semibold text-sm">{item.title}</h4>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-4 text-center">What Our Customers Say</h3>
            {[
              { quote: "ChainGuard Escrow has revolutionized how we handle our crypto transactions.", author: "Alice, Small Business Owner" },
              { quote: "As a business owner, I feel confident using ChainGuard for our high-value transactions.", author: "Bob, Tech Startup CEO" }
            ].map((testimonial, index) => (
              <div key={index} className="mb-4 last:mb-0">
                <p className="text-sm italic mb-1">{testimonial.quote}</p>
                <p className="text-xs font-semibold">- {testimonial.author}</p>
              </div>
            ))}
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-4 text-center">Supported Wallets</h3>
            <div className="flex justify-center space-x-8">
              {[
                { name: "MetaMask", color: "text-orange-500" },
                { name: "Ledger", color: "text-blue-500" },
                { name: "Coinbase", color: "text-blue-700" }
              ].map((wallet, index) => (
                <div key={index} className="text-center">
                  <FaWallet className={`text-4xl ${wallet.color} mx-auto mb-2`} />
                  <p className="text-sm">{wallet.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default LandingPage;