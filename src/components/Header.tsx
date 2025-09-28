"use client";

import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-white shadow-sm py-4 px-6 flex justify-between items-center">
      <div className="text-2xl font-bold text-blue-700">
        <Link to="/">Yasin Digital Solutions</Link>
      </div>
      <nav>
        <ul className="flex space-x-6">
          <li>
            <Link to="/" className="text-gray-700 hover:text-blue-700 font-medium">Home</Link>
          </li>
          <li>
            <Link to="/services" className="text-gray-700 hover:text-blue-700 font-medium">Services</Link>
          </li>
          <li>
            <Link to="/register" className="text-gray-700 hover:text-blue-700 font-medium">Register</Link>
          </li>
          <li>
            <Link to="/login" className="text-gray-700 hover:text-blue-700 font-medium">Login</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;