import React from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { SideMenu } from './SideMenu';
import { useStore } from '../../store';

interface LayoutProps {
  children: React.ReactNode;
  showSideMenu?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ children, showSideMenu = false }) => {
  const { ui } = useStore();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="flex">
        {showSideMenu && <SideMenu />}
        
        <main className={`flex-1 ${showSideMenu ? 'lg:ml-0' : ''}`}>
          {children}
        </main>
      </div>
      
      <Footer />
    </div>
  );
};