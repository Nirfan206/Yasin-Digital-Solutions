"use client";

import React from 'react';
import { Monitor, Smartphone, Megaphone } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useTranslation } from 'react-i18next'; // Import useTranslation

const Home = () => {
  const { t } = useTranslation(); // Initialize useTranslation

  return (
    <div className="min-h-screen">
      {/* Hero Section Placeholder */}
      <section className="bg-gradient-to-r from-blue-700 to-purple-600 text-white py-20 text-center">
        <div className="container mx-auto px-6">
          <h1 className="text-5xl font-extrabold mb-4">{t('driving_business_forward')}</h1>
          <p className="text-xl mb-8">{t('websites_apps_marketing')}</p>
          <Button className="bg-white text-blue-700 hover:bg-gray-100 font-bold py-3 px-8 rounded-full text-lg transition-colors duration-300">
            {t('get_a_quote')}
          </Button>
        </div>
      </section>

      {/* Services Overview Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-12">{t('our_services')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Service Card 1: Website Building */}
            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="text-blue-600 mb-4">
                <Monitor className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">{t('website_building')}</h3>
              <p className="text-gray-600">{t('crafting_responsive_websites')}</p>
            </div>
            {/* Service Card 2: App Development */}
            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="text-green-600 mb-4">
                <Smartphone className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">{t('app_development')}</h3>
              <p className="text-gray-600">{t('innovative_mobile_applications')}</p>
            </div>
            {/* Service Card 3: Digital Marketing */}
            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="text-purple-600 mb-4">
                <Megaphone className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">{t('digital_marketing')}</h3>
              <p className="text-gray-600">{t('strategic_marketing_campaigns')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section Placeholder */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 text-center max-w-3xl">
          <h2 className="text-4xl font-bold text-gray-800 mb-8">{t('about_us')}</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            {t('about_us_description')}
          </p>
        </div>
      </section>
    </div>
  );
};

export default Home;