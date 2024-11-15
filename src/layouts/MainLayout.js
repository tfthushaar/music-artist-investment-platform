import React from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { useAuth } from '../hooks/useAuth';
import './MainLayout.css';

const MainLayout = ({ children }) => {
  const { currentUser } = useAuth();

  return (
    <div className="layout">
      <Navbar />
      <main className="layout__main">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;