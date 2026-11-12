import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { fetchJsonData, saveJsonData } from '../services/api';
import toast from 'react-hot-toast';

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [cars, setCars] = useState([]);
  const [cameras, setCameras] = useState([]);
  const [services, setServices] = useState([]);
  const [website, setWebsite] = useState(null);
  const [contact, setContact] = useState(null);
  const [navigation, setNavigation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadAllData = useCallback(async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const [carsData, camerasData, servicesData, websiteData, contactData, navData] =
        await Promise.all([
          fetchJsonData('cars.json'),
          fetchJsonData('cameras.json'),
          fetchJsonData('services.json'),
          fetchJsonData('website.json'),
          fetchJsonData('contact.json'),
          fetchJsonData('navigation.json'),
        ]);

      setCars(carsData || []);
      setCameras(camerasData || []);
      setServices(servicesData || []);
      setWebsite(websiteData || {});
      setContact(contactData || {});
      setNavigation(navData || {});
      setError(null);
    } catch (err) {
      console.error('Error fetching application content:', err);
      setError(err.message);
      if (!silent) {
        toast.error('Failed to load website content. Please refresh.');
      }
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  // Save content and immediately update state
  const saveSection = async (fileName, updatedContent) => {
    try {
      const toastId = toast.loading(`Saving ${fileName}...`);
      const res = await saveJsonData(fileName, updatedContent);

      // Instantly update local React state
      if (fileName === 'cars.json') setCars(updatedContent);
      else if (fileName === 'cameras.json') setCameras(updatedContent);
      else if (fileName === 'services.json') setServices(updatedContent);
      else if (fileName === 'website.json') setWebsite(updatedContent);
      else if (fileName === 'contact.json') setContact(updatedContent);
      else if (fileName === 'navigation.json') setNavigation(updatedContent);

      toast.success(res.message || 'Changes saved successfully!', { id: toastId });
      return res;
    } catch (err) {
      toast.error(err.message || 'Error saving changes');
      throw err;
    }
  };

  return (
    <DataContext.Provider
      value={{
        cars,
        cameras,
        services,
        website,
        contact,
        navigation,
        loading,
        error,
        refreshData: () => loadAllData(true),
        saveSection,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
