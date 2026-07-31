import React from 'react';

export default function Contact() {
  return (
    <div className="max-w-3xl mx-auto p-6 bg-orange-50 shadow-md rounded-lg text-center">
      <h1 className="text-3xl font-bold mb-4">Get in Touch</h1>

      <p className="text-lg mb-4">
        Have a question, found a bug, or want to collaborate? I'm always happy to hear from users, developers, and food enthusiasts.
      </p>

      <p className="text-lg mb-6">
        You can reach out via <strong>email</strong> at{' '}
        <a href="mailto:mohamed.elmoag+mealprepcodex@gmail.com" className="text-blue-600 hover:underline">
          mohamed.elmoag+mealprepcodex@gmail.com
        </a>,{' '}
        or connect with me through any of the platforms below.
      </p>

      <div className="flex justify-center space-x-4">
        {/* LinkedIn */}
        <button title="Visit my LinkedIn" className="text-gray-500 font-semibold hover:text-black border-2 inline-flex items-center p-2.5 border-transparent bg-light-secondary shadow-button-flat-nopressed hover:shadow-button-flat-pressed focus:opacity-100 focus:outline-none active:shadow-button-flat-pressed font-medium rounded-full text-2xl text-center">
          <a href="https://www.linkedin.com/in/mohamed-el-mourabit-agharbi/" className="text-blue-600 hover:text-gray-800 font-medium transition" target="_blank" rel="noopener noreferrer" title="LinkedIn">
            <i className="fab fa-linkedin"></i>
          </a>
        </button>

        {/* Portfolio */}
        <button title="Visit my Portfolio" className="text-gray-500 font-semibold hover:text-black border-2 inline-flex items-center p-2.5 border-transparent bg-light-secondary shadow-button-flat-nopressed hover:shadow-button-flat-pressed focus:opacity-100 focus:outline-none active:shadow-button-flat-pressed font-medium rounded-full text-2xl text-center">
          <a href="https://mohamed-elmourabit.netlify.app/home" className="text-sepia-light hover:text-gray-800 font-medium transition" target="_blank" rel="noopener noreferrer" title="Portfolio">
            <i className="fas fa-globe"></i>
          </a>
        </button>

        {/* Email */}
        <button title="Send me an email" className="text-gray-500 font-semibold hover:text-black border-2 inline-flex items-center p-2.5 border-transparent bg-light-secondary shadow-button-flat-nopressed hover:shadow-button-flat-pressed focus:opacity-100 focus:outline-none active:shadow-button-flat-pressed font-medium rounded-full text-2xl text-center">
          <a href="mailto:mohamed.elmoag+mealprepcodex@gmail.com" className="text-red-500 hover:text-gray-800 font-medium transition" title="Email">
            <i className="fas fa-envelope"></i>
          </a>
        </button>
      </div>

    </div>
  );
}
