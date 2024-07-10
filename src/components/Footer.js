import React from 'react';
import { FaTwitter, FaLinkedin, FaGithub, FaMedium } from 'react-icons/fa';

function Footer() {
  return (
    <footer className="bg-[#1a237e] text-white p-6 shadow-md">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0">
          <p>&copy; {new Date().getFullYear()} ChainGuard Escrow. All rights reserved.</p>
        </div>
        <div className="flex space-x-4">
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#00838f] transition duration-300">
            <FaTwitter size={24} />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#00838f] transition duration-300">
            <FaLinkedin size={24} />
          </a>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#00838f] transition duration-300">
            <FaGithub size={24} />
          </a>
          <a href="https://medium.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#00838f] transition duration-300">
            <FaMedium size={24} />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;