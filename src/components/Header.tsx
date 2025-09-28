"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, LayoutDashboard, Printer } from 'lucide-react'; // Import Printer icon
import { Button } from './ui/button';
import NotificationBell from './NotificationBell';
import { useTranslation } from 'react-i18next';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

const Header = () => {
  const { user, logout } = useAuth();
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const getDashboardLink = () => {
    if (!user) return '/';
    switch (user.role) {
      case 'client':
        return '/client/dashboard';
      case 'employee':
        return '/employee/dashboard';
      case 'admin':
        return '/admin/dashboard';
      default:
        return '/';
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <header className="bg-white shadow-sm py-4 px-6 flex justify-between items-center no-print">
      <div className="text-2xl font-bold text-blue-700">
        <Link to="/">Yasin Digital Solutions</Link>
      </div>
      <nav>
        <ul className="flex space-x-6 items-center">
          <li>
            <Button asChild variant="ghost" className="text-gray-700 hover:text-blue-700 font-medium">
              <Link to="/">{t('home')}</Link>
            </Button>
          </li>
          <li>
            <Button asChild variant="ghost" className="text-gray-700 hover:text-blue-700 font-medium">
              <Link to="/services">{t('services')}</Link>
            </Button>
          </li>
          <li>
            <Button asChild variant="ghost" className="text-gray-700 hover:text-blue-700 font-medium">
              <Link to="/contact">{t('contact_us')}</Link>
            </Button>
          </li>
          {user ? (
            <>
              <li>
                <Button asChild variant="ghost" className="text-gray-700 hover:text-blue-700 font-medium flex items-center space-x-1">
                  <Link to={getDashboardLink()}>
                    <LayoutDashboard size={18} />
                    <span>{t('dashboard')}</span>
                  </Link>
                </Button>
              </li>
              <li>
                <NotificationBell />
              </li>
              <li>
                <Button
                  variant="ghost"
                  onClick={logout}
                  className="text-gray-700 hover:text-blue-700 font-medium flex items-center space-x-1"
                >
                  <LogOut size={18} />
                  <span>{t('logout')}</span>
                </Button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Button asChild variant="ghost" className="text-gray-700 hover:text-blue-700 font-medium">
                  <Link to="/register">{t('register')}</Link>
                </Button>
              </li>
              <li>
                <Button asChild variant="ghost" className="text-gray-700 hover:text-blue-700 font-medium">
                  <Link to="/login">{t('login')}</Link>
                </Button>
              </li>
            </>
          )}
          <li>
            <Button
              variant="ghost"
              onClick={handlePrint}
              className="text-gray-700 hover:text-blue-700 font-medium flex items-center space-x-1"
            >
              <Printer size={18} />
              <span>{t('print')}</span>
            </Button>
          </li>
          <li>
            <Select onValueChange={changeLanguage} defaultValue={i18n.language}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder={t('language')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">{t('english')}</SelectItem>
                <SelectItem value="te">{t('telugu')}</SelectItem>
              </SelectContent>
            </Select>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;