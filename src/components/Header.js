import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const dropdownRef = useRef(null);
  let timeoutId = null;

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const openServices = () => {
    clearTimeout(timeoutId);
    setIsServicesOpen(true);
  };

  const closeServices = () => {
    timeoutId = setTimeout(() => {
      setIsServicesOpen(false);
    }, 300); // 300ms delay before closing
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsServicesOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      <header className="bg-[#1a237e] text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold hover:text-[#00838f] transition duration-300">
            ChainGuard Escrow
          </Link>
          <div className="md:hidden">
            <button onClick={toggleMenu} className="text-white focus:outline-none">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
          <nav className="hidden md:block">
            <ul className="flex space-x-4 items-center">
              <li><Link to="/about" className="hover:text-[#00838f] transition duration-300">About</Link></li>
              <li className="relative" ref={dropdownRef}>
                <button 
                  onMouseEnter={openServices}
                  onMouseLeave={closeServices}
                  className="hover:text-[#00838f] transition duration-300 focus:outline-none"
                >
                  Services
                </button>
                {isServicesOpen && (
                  <div 
                    className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none overflow-hidden"
                    onMouseEnter={openServices}
                    onMouseLeave={closeServices}
                  >
                    <ul>
                      <li>
                        <Link to="/services/escrow" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition duration-300">
                          Escrow
                        </Link>
                      </li>
                      <li>
                        <Link to="/services/custody" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition duration-300">
                          Custody
                        </Link>
                      </li>
                      <li>
                        <Link to="/services/multisig" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition duration-300">
                          MultiSig
                        </Link>
                      </li>
                    </ul>
                  </div>
                )}
              </li>
              <li><Link to="/contact" className="hover:text-[#00838f] transition duration-300">Contact</Link></li>
            </ul>
          </nav>
        </div>
      </header>

      {isMenuOpen && (
        <div className="md:hidden bg-[#1a237e] p-4 shadow-md">
          <nav>
            <ul className="space-y-2">
              <li><Link to="/about" className="block hover:text-[#00838f] transition duration-300" onClick={toggleMenu}>About</Link></li>
              <li>
                <button 
                  onClick={() => setIsServicesOpen(!isServicesOpen)}
                  className="w-full text-left hover:text-[#00838f] transition duration-300 focus:outline-none"
                >
                  Services
                </button>
                {isServicesOpen && (
                  <ul className="ml-4 mt-2 space-y-2">
                    <li><Link to="/services/escrow" className="block hover:text-[#00838f] transition duration-300" onClick={toggleMenu}>Escrow</Link></li>
                    <li><Link to="/services/custody" className="block hover:text-[#00838f] transition duration-300" onClick={toggleMenu}>Custody</Link></li>
                    <li><Link to="/services/multisig" className="block hover:text-[#00838f] transition duration-300" onClick={toggleMenu}>MultiSig</Link></li>
                  </ul>
                )}
              </li>
              <li><Link to="/contact" className="block hover:text-[#00838f] transition duration-300" onClick={toggleMenu}>Contact</Link></li>
            </ul>
          </nav>
        </div>
      )}
    </>
  );
}

export default Header;