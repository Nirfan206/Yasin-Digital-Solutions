"use client";

import React from 'react';
import { Monitor, Smartphone, Megaphone } from 'lucide-react'; // Importing Lucide icons

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section Placeholder */}
      <section className="bg-gradient-to-r from-blue-700 to-purple-600 text-white py-20 text-center">
        <div className="container mx-auto px-6">
          <h1 className="text-5xl font-extrabold mb-4">Driving Your Business Forward with Digital Excellence</h1>
          <p className="text-xl mb-8">Websites, Apps, and Marketing Tailored for Growth.</p>
          <button className="bg-white text-blue-700 hover:bg-gray-100 font-bold py-3 px-8 rounded-full text-lg transition-colors duration-300">
            Get a Quote
          </button>
        </div>
      </section>

      {/* Services Overview Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-12">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Service Card 1: Website Building */}
            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="text-blue-600 mb-4">
                <Monitor className="h-12 w-12 mx-auto" /> {/* Lucide Icon */}
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Website Building</h3>
              <p className="text-gray-600">Crafting responsive, high-performance websites tailored to your brand.</p>
            </div>
            {/* Service Card 2: App Development */}
            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="text-green-600 mb-4">
                <Smartphone className="h-12 w-12 mx-auto" /> {/* Lucide Icon */}
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">App Development</h3>
              <p className="text-gray-600">Innovative mobile and web applications designed for seamless user experiences.</p>
            </div>
            {/* Service Card 3: Digital Marketing */}
            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="text-purple-600 mb-4">
                <Megaphone className="h-12 w-12 mx-auto" /> {/* Lucide Icon */}
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Digital Marketing</h3>
              <p className="text-gray-600">Strategic marketing campaigns to boost your online presence and reach.</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section Placeholder */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 text-center max-w-3xl">
          <h2 className="text-4xl font-bold text-gray-800 mb-8">About Us</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            At Yasin Digital Solutions, we are passionate about empowering businesses with cutting-edge digital tools and strategies. Our mission is to deliver innovative web and app development, coupled with effective digital marketing, to help our clients achieve sustainable growth and stand out in the competitive digital landscape. We believe in transparency, collaboration, and delivering measurable results.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Home;