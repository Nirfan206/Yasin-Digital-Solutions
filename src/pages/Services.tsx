"use client";

import React from 'react';
import { Monitor, Smartphone, Megaphone, Code, Cloud, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next'; // Import useTranslation

const servicesData = [
  {
    icon: Monitor,
    titleKey: 'custom_website_development_title',
    descriptionKey: 'custom_website_development_description',
  },
  {
    icon: Smartphone,
    titleKey: 'mobile_app_development_title',
    descriptionKey: 'mobile_app_development_description',
  },
  {
    icon: Megaphone,
    titleKey: 'digital_marketing_strategies_title',
    descriptionKey: 'digital_marketing_strategies_description',
  },
  {
    icon: Code,
    titleKey: 'e_commerce_solutions_title',
    descriptionKey: 'e_commerce_solutions_description',
  },
  {
    icon: Cloud,
    titleKey: 'cloud_solutions_hosting_title',
    descriptionKey: 'cloud_solutions_hosting_description',
  },
  {
    icon: Search,
    titleKey: 'seo_analytics_title',
    descriptionKey: 'seo_analytics_description',
  },
];

const Services = () => {
  const { t } = useTranslation(); // Initialize useTranslation

  return (
    <div className="container mx-auto px-6 py-16 min-h-screen">
      <h1 className="text-4xl font-bold text-gray-800 mb-12 text-center">{t('our_comprehensive_services')}</h1>
      <p className="text-lg text-gray-700 mb-16 text-center max-w-3xl mx-auto">
        {t('services_intro_paragraph')}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {servicesData.map((service, index) => (
          <div key={index} className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col items-center text-center">
            <div className="text-blue-600 mb-4">
              <service.icon className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">{t(service.titleKey)}</h3>
            <p className="text-gray-600">{t(service.descriptionKey)}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;