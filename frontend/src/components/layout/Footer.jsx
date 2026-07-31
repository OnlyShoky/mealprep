import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-sepia text-normal py-4">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">

        {/* Right: Donation Links (commented out in Django too) */}
        <div className="flex space-x-4">
          <button title="Visit my LinkedIn" className="text-gray-500 font-semibold hover:text-black border-2 inline-flex items-center p-2.5 border-transparent bg-light-secondary shadow-button-flat-nopressed hover:shadow-button-flat-pressed focus:opacity-100 focus:outline-none active:shadow-button-flat-pressed font-medium rounded-full text-xl text-center">
            <a href="https://www.linkedin.com/in/mohamed-el-mourabit-agharbi/" className="hover:text-gray-800 font-medium transition" target="_blank" rel="noopener noreferrer" title="LinkedIn">
              <i className="fab fa-linkedin"></i>
            </a>
          </button>

          {/* Portfolio */}
          <button title="Visit my Portfolio" className="text-gray-500 font-semibold hover:text-black border-2 inline-flex items-center p-2.5 border-transparent bg-light-secondary shadow-button-flat-nopressed hover:shadow-button-flat-pressed focus:opacity-100 focus:outline-none active:shadow-button-flat-pressed font-medium rounded-full text-xl text-center">
            <a href="https://mohamed-elmourabit.netlify.app/home" className="text-sepia-light hover:text-gray-800 font-medium transition" target="_blank" rel="noopener noreferrer" title="Portfolio">
              <i className="fas fa-globe"></i>
            </a>
          </button>

          {/* Email */}
          <button title="Send me an email" className="text-gray-500 font-semibold hover:text-black border-2 inline-flex items-center p-2.5 border-transparent bg-light-secondary shadow-button-flat-nopressed hover:shadow-button-flat-pressed focus:opacity-100 focus:outline-none active:shadow-button-flat-pressed font-medium rounded-full text-xl text-center">
            <a href="mailto:mohamed.elmoag+mealprepcodex@gmail.com" className="hover:text-gray-800 font-medium transition" title="Email">
              <i className="fas fa-envelope"></i>
            </a>
          </button>
        </div>

        {/* Center: Copyright */}
        <p className="text-gray-500 text-center flex-grow">&copy; 2025 Meal Prep Codex. Built with passion and curiosity.</p>

        {/* Left: Navigation Links */}
        <div className="flex space-x-4">
          <Link to="/contact" className="text-gray-500 font-semibold hover:text-black border-2 inline-flex items-center p-2.5 border-transparent bg-light-secondary shadow-button-flat-nopressed hover:shadow-button-flat-pressed focus:opacity-100 focus:outline-none active:shadow-button-flat-pressed font-medium rounded-full text-center">Contact</Link>
          <Link to="/faq" className="text-gray-500 font-semibold hover:text-black border-2 inline-flex items-center p-2.5 border-transparent bg-light-secondary shadow-button-flat-nopressed hover:shadow-button-flat-pressed focus:opacity-100 focus:outline-none active:shadow-button-flat-pressed font-medium rounded-full text-center">FAQ</Link>
          <Link to="/about" className="text-gray-500 font-semibold hover:text-black border-2 inline-flex items-center p-2.5 border-transparent bg-light-secondary shadow-button-flat-nopressed hover:shadow-button-flat-pressed focus:opacity-100 focus:outline-none active:shadow-button-flat-pressed font-medium rounded-full text-center">About</Link>
        </div>

      </div>
    </footer>
  );
}
