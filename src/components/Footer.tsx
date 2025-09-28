"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Linkedin } from 'lucide-react'; // Importing social media icons
import { Button } from './ui/button'; // Import shadcn/ui Button
import { useTranslation } from 'react-i18next'; // Import useTranslation

const Footer = () => {
  const { t } = useTranslation(); // Initialize useTranslation

  return (
    <footer className="bg-gray-800 text-white pt-10">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-8">
        {/* Column 1: Address & Map */}
        <div>
          <h3 className="text-lg font-semibold mb-4">{t('our_location')}</h3>
          <p className="text-gray-400 mb-4">
            {t('digital_street_address').split(', ').map((line, index) => (
              <React.Fragment key={index}>
                {line}
                {index < t('digital_street_address').split(', ').length - 1 && <br />}
              </React.Fragment>
            ))}
          </p>
          <div className="w-full h-48 bg-gray-700 rounded-md overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.2100000000005!2d144.9631!3d-37.8136!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642af0f11fd81%3A0x5045675218ce7e0!2sMelbourne%20VIC%2C%20Australia!5e0!3m2!1sen!2sus!4v1678901234567!5m2!1sen!2sus"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Google Maps Location"
            ></iframe>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4">{t('quick_links')}</h3>
          <ul className="space-y-2">
            <li>
              <Button asChild variant="link" className="p-0 h-auto text-gray-400 hover:text-blue-400 transition-colors justify-start">
                <Link to="/">{t('home')}</Link>
              </Button>
            </li>
            <li>
              <Button asChild variant="link" className="p-0 h-auto text-gray-400 hover:text-blue-400 transition-colors justify-start">
                <Link to="/services">{t('services')}</Link>
              </Button>
            </li>
            <li>
              <Button asChild variant="link" className="p-0 h-auto text-gray-400 hover:text-blue-400 transition-colors justify-start">
                <Link to="/contact">{t('contact_us')}</Link>
              </Button>
            </li>
            <li>
              <Button asChild variant="link" className="p-0 h-auto text-gray-400 hover:text-blue-400 transition-colors justify-start">
                <Link to="/login">{t('login')}</Link>
              </Button>
            </li>
            <li>
              <Button asChild variant="link" className="p-0 h-auto text-gray-400 hover:text-blue-400 transition-colors justify-start">
                <Link to="/register">{t('register')}</Link>
              </Button>
            </li>
          </ul>
        </div>

        {/* Column 3: Social Media & Contact Info */}
        <div>
          <h3 className="text-lg font-semibold mb-4">{t('connect_with_us')}</h3>
          <p className="text-gray-400">
            {t('stay_updated_with_news')}
          </p>
          <div className="flex space-x-4 mt-4">
            <Button asChild variant="ghost" size="icon" className="text-gray-400 hover:text-blue-400 transition-colors">
              <a href="#" aria-label="Facebook"><Facebook size={24} /></a>
            </Button>
            <Button asChild variant="ghost" size="icon" className="text-gray-400 hover:text-blue-400 transition-colors">
              <a href="#" aria-label="Twitter"><Twitter size={24} /></a>
            </Button>
            <Button asChild variant="ghost" size="icon" className="text-gray-400 hover:text-blue-400 transition-colors">
              <a href="#" aria-label="LinkedIn"><Linkedin size={24} /></a>
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-gray-900 py-4 text-center text-gray-500 text-sm">
        <p>{t('copyright_notice')}</p>
      </div>
    </footer>
  );
};

export default Footer;