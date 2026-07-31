import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faCoffee } from '@fortawesome/free-solid-svg-icons';
import { faPaypal } from '@fortawesome/free-brands-svg-icons';

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <header className="text-normal">
      <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center border-b border-gray-300">
        {/* Logo */}
        <Link to="/" className="hover:text-gray-800 transition flex items-center">
          <img src="/favicon/logo.png" alt="Meal Prep Codex Logo" className="h-20 mr-3" />
        </Link>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="w-full md:w-auto flex items-center bg-sepia-100 rounded-full px-4 py-2 focus-within:ring-2 ring-sepia-500 transition-shadow mb-4 md:mb-0">
          <input
            type="text"
            placeholder="Search recipes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent outline-none placeholder-gray-500 text-normal"
            aria-label="Search recipes"
          />
          <button type="submit" className="ml-2 text-normal hover:text-sepia-500 transition-colors" style={{boxShadow: 'none', background: 'transparent', marginRight: 0}}>
            <i className="fas fa-search"></i>
          </button>
        </form>

        {/* Navigation */}
        <nav className="flex space-x-2 items-center">
          <div className="flex w-fit shadow-box-up rounded-xl dark:bg-box-dark dark:shadow-box-dark-out">
            <div className="dark:shadow-buttons-box-dark rounded-2xl w-full">
              <button title="Go to PrepWeek planner" className="text-gray-500 font-semibold hover:text-black border-2 inline-flex items-center last-of-type:mr-0 p-2.5 border-transparent bg-light-secondary shadow-button-flat-nopressed hover:shadow-button-flat-pressed focus:opacity-100 focus:outline-none active:shadow-button-flat-pressed font-medium rounded-full text-sm text-center">
                <Link to="/prepweek"> PrepWeek </Link>
              </button>
              <button title="Go to Profile" className="text-gray-500 font-semibold hover:text-black border-2 inline-flex items-center last-of-type:mr-0 p-2.5 border-transparent bg-light-secondary shadow-button-flat-nopressed hover:shadow-button-flat-pressed focus:opacity-100 focus:outline-none active:shadow-button-flat-pressed font-medium rounded-full text-sm text-center">
                <Link to="/profile"> Profile </Link>
              </button>
              <button title="Go to post list page" className="text-gray-500 font-semibold hover:text-black border-2 inline-flex items-center last-of-type:mr-0 p-2.5 border-transparent bg-light-secondary shadow-button-flat-nopressed hover:shadow-button-flat-pressed focus:opacity-100 focus:outline-none active:shadow-button-flat-pressed font-medium rounded-full text-sm text-center">
                <Link to="/recipes"> Recipes </Link>
              </button>
              <button title="Go to post API page" className="text-gray-500 font-semibold hover:text-black border-2 inline-flex items-center last-of-type:mr-0 p-2.5 border-transparent bg-light-secondary shadow-button-flat-nopressed hover:shadow-button-flat-pressed focus:opacity-100 focus:outline-none active:shadow-button-flat-pressed font-medium rounded-full text-sm text-center">
                <a href="/api/v1/"> API </a>
              </button>
              <button title="Go to post list page" className="text-gray-500 font-semibold hover:text-black border-2 inline-flex items-center last-of-type:mr-0 p-2.5 border-transparent bg-light-secondary shadow-button-flat-nopressed hover:shadow-button-flat-pressed focus:opacity-100 focus:outline-none active:shadow-button-flat-pressed font-medium rounded-full text-sm text-center">
                <a href="https://www.paypal.com/donate/?hosted_button_id=P49L3AK8RDVMN" className="text-sepia-light hover:text-gray-800 font-medium transition" target="_blank" rel="noopener noreferrer" title="Support me on PayPal">
                  <i className="fab fa-paypal"></i>
                </a>
              </button>
              <button title="Go to about me page" className="text-gray-500 font-semibold hover:text-black border-2 inline-flex items-center last-of-type:mr-0 p-2.5 border-transparent bg-light-secondary shadow-button-flat-nopressed hover:shadow-button-flat-pressed focus:opacity-100 focus:outline-none active:shadow-button-flat-pressed font-medium rounded-full text-sm text-center">
                <a href="https://www.buymeacoffee.com/shoky" className="text-sepia-light hover:text-gray-800 font-medium transition" target="_blank" rel="noopener noreferrer" title="Buy me a coffee">
                  <i className="fas fa-coffee"></i>
                </a>
              </button>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
