"use client";

import React from 'react';
import { Monitor, Smartphone, Megaphone, Code, Cloud, Search } from 'lucide-react';

const servicesData = [
  {
    icon: Monitor,
    title: 'Custom Website Development',
    description: 'Building responsive, high-performance websites from scratch, tailored to your unique business needs and brand identity.',
  },
  {
    icon: Smartphone,
    title: 'Mobile App Development',
    description: 'Creating intuitive and engaging mobile applications for iOS and Android platforms, ensuring a seamless user experience.',
  },
  {
    icon: Megaphone,
    title: 'Digital Marketing Strategies',
    description: 'Developing comprehensive digital marketing campaigns including SEO, social media, and content marketing to boost your online presence.',
  },
  {
    icon: Code,
    title: 'E-commerce Solutions',
    description: 'Designing and developing robust e-commerce platforms that provide a smooth shopping experience and drive sales.',
  },
  {
    icon: Cloud,
    title: 'Cloud Solutions & Hosting',
    description: 'Providing secure and scalable cloud hosting and infrastructure management to ensure your applications are always available and performant.',
  },
  {
    icon: Search,
    title: 'SEO & Analytics',
    description: 'Optimizing your digital assets for search engines and providing in-depth analytics to track performance and inform strategy.',
  },
];

const Services = () => {
  return (
    <div className="container mx-auto px-6 py-16 min-h-screen">
      <h1 className="text-4xl font-bold text-gray-800 mb-12 text-center">Our Comprehensive Services</h1>
      <p className="text-lg text-gray-700 mb-16 text-center max-w-3xl mx-auto">
        At Yasin Digital Solutions, we offer a wide range of services designed to help your business thrive in the digital landscape. From initial concept to deployment and ongoing support, we are your trusted partner.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {servicesData.map((service, index) => (
          <div key={index} className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col items-center text-center">
            <div className="text-blue-600 mb-4">
              <service.icon className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">{service.title}</h3>
            <p className="text-gray-600">{service.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;