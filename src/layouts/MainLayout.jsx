import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BookingModal from '../components/BookingModal';
import ScrollToTop from '../components/ScrollToTop';
import { MessageSquare } from 'lucide-react';

export default function MainLayout() {
  const [bookingModalState, setBookingModalState] = useState({
    isOpen: false,
    item: null,
    type: 'vehicle',
  });

  const openBookingModal = (item = null, type = 'vehicle') => {
    setBookingModalState({
      isOpen: true,
      item,
      type: item?.brand && item?.model ? 'camera' : type,
    });
  };

  const closeBookingModal = () => {
    setBookingModalState((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-dark-primary text-text-main selection:bg-accent-amber selection:text-black">
      <ScrollToTop />
      <Navbar onOpenBooking={() => openBookingModal(null, 'vehicle')} />

      <main className="flex-1">
        <Outlet context={{ openBookingModal }} />
      </main>

      <Footer onOpenBooking={() => openBookingModal(null, 'vehicle')} />

      {/* Global Booking Modal */}
      <BookingModal
        isOpen={bookingModalState.isOpen}
        onClose={closeBookingModal}
        initialItem={bookingModalState.item}
        defaultType={bookingModalState.type}
      />

      {/* Floating Quick Action Button on Mobile */}
      <div className="fixed bottom-6 right-6 z-30 sm:hidden">
        <button
          onClick={() => openBookingModal(null, 'vehicle')}
          className="w-14 h-14 rounded-full bg-accent-amber text-black shadow-glow-amber flex items-center justify-center font-bold"
          aria-label="Book on WhatsApp"
        >
          <MessageSquare className="w-6 h-6 fill-black" />
        </button>
      </div>
    </div>
  );
}
