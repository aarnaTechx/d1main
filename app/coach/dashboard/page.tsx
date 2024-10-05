"use client";
import { useState, useEffect } from 'react';
import React from 'react';

import '../../globals.css'; // Import CSS module
import Header from '../../components/Header';
import Brand from '../../public/images/brand.jpg';
import Image from 'next/image';
import Sidebar from '../../components/coach/Sidebar';
import DashboardTabs from '../../components/coach/DashboardTabs';
import Modal from '../../components/Modal'; 

const Dashboard: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
  
    const modalShown = localStorage.getItem('modalShown');

    if (!modalShown) {
      setIsModalOpen(true);
      localStorage.setItem('modalShown', 'true'); 
    }
  }, []);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Modal isOpen={isModalOpen} onClose={closeModal} />
      <div className="flex h-screen">
        <Sidebar />
        <main className="flex-grow bg-gray-100 p-4">
          <DashboardTabs />
        </main>
      </div>
    </>
  );
};

export default Dashboard;
