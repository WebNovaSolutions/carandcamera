import { useEffect } from 'react';
import { useData } from '../context/DataContext';

export default function SEO({ title, description }) {
  const { website } = useData();
  const siteName = website?.name || 'ApexMotion Rentals';

  useEffect(() => {
    document.title = title ? `${title} | ${siteName}` : `${siteName} - Luxury Car & Cinema Camera Rentals`;

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription && description) {
      metaDescription.setAttribute('content', description);
    }
  }, [title, description, siteName]);

  return null;
}
