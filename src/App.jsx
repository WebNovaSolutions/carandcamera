import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Layouts
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';

// Customer Pages
import Home from './pages/Home';
import Cars from './pages/Cars';
import CarDetails from './pages/CarDetails';
import Cameras from './pages/Cameras';
import CameraDetails from './pages/CameraDetails';
import Services from './pages/Services';
import About from './pages/About';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';

// Admin Pages
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import ManageCars from './pages/admin/ManageCars';
import ManageCameras from './pages/admin/ManageCameras';
import ManageServices from './pages/admin/ManageServices';
import ManageWebsite from './pages/admin/ManageWebsite';
import ManageNavigation from './pages/admin/ManageNavigation';
import ManageContact from './pages/admin/ManageContact';

export default function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: '#182234',
            color: '#FFFFFF',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            fontSize: '13px',
            borderRadius: '12px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
          },
          success: {
            iconTheme: {
              primary: '#22C55E',
              secondary: '#182234',
            },
          },
          error: {
            iconTheme: {
              primary: '#EF4444',
              secondary: '#182234',
            },
          },
        }}
      />

      <Routes>
        {/* Customer Public Routes */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="cars" element={<Cars />} />
          <Route path="cars/:id" element={<CarDetails />} />
          <Route path="cameras" element={<Cameras />} />
          <Route path="cameras/:id" element={<CameraDetails />} />
          <Route path="services" element={<Services />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Admin Login */}
        <Route path="/admin/login" element={<Login />} />

        {/* Protected Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="cars" element={<ManageCars />} />
          <Route path="cameras" element={<ManageCameras />} />
          <Route path="services" element={<ManageServices />} />
          <Route path="website" element={<ManageWebsite />} />
          <Route path="navigation" element={<ManageNavigation />} />
          <Route path="contact" element={<ManageContact />} />
        </Route>
      </Routes>
    </>
  );
}
