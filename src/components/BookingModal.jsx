import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, MapPin, User, Phone, MessageSquare, Car, Camera, Clock, ShieldCheck, ArrowRight } from 'lucide-react';
import { useData } from '../context/DataContext';
import { generateWhatsAppBookingUrl } from '../services/whatsapp';
import { calculateRentalDays, formatCurrency } from '../utils/formatters';

export default function BookingModal({ isOpen, onClose, initialItem = null, defaultType = 'vehicle' }) {
  const { contact, cars, cameras } = useData();

  const [itemType, setItemType] = useState(defaultType);
  const [selectedItemId, setSelectedItemId] = useState(initialItem?.id || '');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [pickupLocation, setPickupLocation] = useState('New Delhi / NCR');
  const [additionalMessage, setAdditionalMessage] = useState('');
  const [errors, setErrors] = useState({});

  // Sync state whenever initialItem changes
  useEffect(() => {
    if (initialItem) {
      setSelectedItemId(initialItem.id);
      if (initialItem.brand && initialItem.model) {
        setItemType('camera');
      } else {
        setItemType('vehicle');
      }
    }
  }, [initialItem]);

  // Set default minimum date to today
  const todayStr = new Date().toISOString().split('T')[0];

  // Get current active item
  const currentList = itemType === 'vehicle' ? cars : cameras;
  const currentItem = currentList.find(i => i.id === selectedItemId) || initialItem || currentList[0];

  // Calculate duration and price
  const rentalDays = calculateRentalDays(pickupDate, returnDate);
  const dailyPrice = currentItem?.dailyPrice || 0;
  const estimatedTotal = dailyPrice * rentalDays;

  const validate = () => {
    const newErrors = {};
    if (!customerName.trim()) newErrors.customerName = 'Please enter your full name';
    if (!customerPhone.trim() || customerPhone.trim().length < 10) {
      newErrors.customerPhone = 'Please enter a valid 10-digit phone number';
    }
    if (!pickupDate) newErrors.pickupDate = 'Please select a pickup date';
    if (!returnDate) newErrors.returnDate = 'Please select a return date';
    if (pickupDate && returnDate && new Date(returnDate) < new Date(pickupDate)) {
      newErrors.returnDate = 'Return date cannot be earlier than pickup date';
    }
    if (!pickupLocation.trim()) newErrors.pickupLocation = 'Please provide a pickup location';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const itemName = currentItem ? `${currentItem.name} (${currentItem.brand || ''})` : 'Custom Rental';
    const durationText = `${rentalDays} Day${rentalDays > 1 ? 's' : ''}`;

    const whatsappUrl = generateWhatsAppBookingUrl({
      businessNumber: contact?.whatsappNumber || '919876543210',
      customerName,
      customerPhone,
      itemType,
      itemName,
      pickupDate,
      returnDate,
      pickupLocation,
      rentalDuration: durationText,
      dailyPrice: currentItem?.dailyPrice,
      hourlyPrice: currentItem?.hourlyPrice,
      calculatedPrice: estimatedTotal,
      additionalMessage,
    });

    // Open WhatsApp in new tab
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="relative w-full max-w-2xl bg-dark-card border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-10 my-8"
        >
          {/* Header */}
          <div className="relative px-6 py-5 border-b border-white/10 bg-dark-secondary/60 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-accent-amber/20 flex items-center justify-center text-accent-amber border border-accent-amber/30">
                {itemType === 'vehicle' ? <Car className="w-5 h-5" /> : <Camera className="w-5 h-5" />}
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Reserve via WhatsApp</h3>
                <p className="text-xs text-text-muted">Instant verification with our concierge desk</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-lg text-text-muted hover:text-white hover:bg-white/5 transition"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
            {/* Rental Category Toggle */}
            <div className="grid grid-cols-2 gap-3 p-1.5 bg-dark-primary rounded-xl border border-white/5">
              <button
                type="button"
                onClick={() => {
                  setItemType('vehicle');
                  setSelectedItemId(cars[0]?.id || '');
                }}
                className={`flex items-center justify-center space-x-2 py-2.5 rounded-lg text-sm font-semibold transition ${
                  itemType === 'vehicle'
                    ? 'bg-accent-amber text-black shadow-glow-amber'
                    : 'text-text-muted hover:text-white'
                }`}
              >
                <Car className="w-4 h-4" />
                <span>Car Rental</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setItemType('camera');
                  setSelectedItemId(cameras[0]?.id || '');
                }}
                className={`flex items-center justify-center space-x-2 py-2.5 rounded-lg text-sm font-semibold transition ${
                  itemType === 'camera'
                    ? 'bg-accent-blue text-black shadow-glow-blue'
                    : 'text-text-muted hover:text-white'
                }`}
              >
                <Camera className="w-4 h-4" />
                <span>Camera Gear</span>
              </button>
            </div>

            {/* Item Selection Dropdown */}
            <div>
              <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5">
                Selected {itemType === 'vehicle' ? 'Vehicle' : 'Camera Model'}
              </label>
              <select
                value={selectedItemId}
                onChange={(e) => setSelectedItemId(e.target.value)}
                className="w-full bg-dark-secondary border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-accent-amber transition"
              >
                {currentList.map((item) => (
                  <option key={item.id} value={item.id} className="bg-dark-secondary text-white">
                    {item.name} — {formatCurrency(item.dailyPrice)}/day
                  </option>
                ))}
              </select>
            </div>

            {/* Personal Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5">
                  Your Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-text-dim absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full bg-dark-secondary border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white text-sm focus:outline-none focus:border-accent-amber transition"
                  />
                </div>
                {errors.customerName && <p className="text-status-error text-xs mt-1">{errors.customerName}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5">
                  Phone / WhatsApp Number *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-text-dim absolute left-3.5 top-3.5" />
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="e.g. +91 98765 43210"
                    className="w-full bg-dark-secondary border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white text-sm focus:outline-none focus:border-accent-amber transition"
                  />
                </div>
                {errors.customerPhone && <p className="text-status-error text-xs mt-1">{errors.customerPhone}</p>}
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5">
                  Pickup Date *
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-text-dim absolute left-3.5 top-3.5" />
                  <input
                    type="date"
                    required
                    min={todayStr}
                    value={pickupDate}
                    onChange={(e) => {
                      setPickupDate(e.target.value);
                      if (!returnDate || new Date(returnDate) < new Date(e.target.value)) {
                        setReturnDate(e.target.value);
                      }
                    }}
                    className="w-full bg-dark-secondary border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white text-sm focus:outline-none focus:border-accent-amber transition"
                  />
                </div>
                {errors.pickupDate && <p className="text-status-error text-xs mt-1">{errors.pickupDate}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5">
                  Return Date *
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-text-dim absolute left-3.5 top-3.5" />
                  <input
                    type="date"
                    required
                    min={pickupDate || todayStr}
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="w-full bg-dark-secondary border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white text-sm focus:outline-none focus:border-accent-amber transition"
                  />
                </div>
                {errors.returnDate && <p className="text-status-error text-xs mt-1">{errors.returnDate}</p>}
              </div>
            </div>

            {/* Pickup Location */}
            <div>
              <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5">
                Pickup & Delivery Location *
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-text-dim absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  value={pickupLocation}
                  onChange={(e) => setPickupLocation(e.target.value)}
                  placeholder="e.g. Aerocity, Delhi / IGI Airport / Film City Noida"
                  className="w-full bg-dark-secondary border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white text-sm focus:outline-none focus:border-accent-amber transition"
                />
              </div>
              {errors.pickupLocation && <p className="text-status-error text-xs mt-1">{errors.pickupLocation}</p>}
            </div>

            {/* Message */}
            <div>
              <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5">
                Special Requests / Shooting Schedule (Optional)
              </label>
              <textarea
                rows={2}
                value={additionalMessage}
                onChange={(e) => setAdditionalMessage(e.target.value)}
                placeholder="Mention driver requirement, extra lenses, or specific time of delivery..."
                className="w-full bg-dark-secondary border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-accent-amber transition resize-none"
              />
            </div>

            {/* Pricing Summary Box */}
            <div className="p-4 rounded-xl bg-dark-primary/80 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <div className="text-xs text-text-muted">Estimated Duration:</div>
                <div className="text-sm font-semibold text-white flex items-center gap-1.5 mt-0.5">
                  <Clock className="w-4 h-4 text-accent-amber" />
                  {rentalDays} {rentalDays === 1 ? 'Day' : 'Days'}
                  {currentItem?.dailyPrice && (
                    <span className="text-xs text-text-dim">({formatCurrency(currentItem.dailyPrice)}/day)</span>
                  )}
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs text-text-muted">Estimated Rental Total:</div>
                <div className="text-xl font-bold text-accent-amber">
                  {formatCurrency(estimatedTotal)}
                </div>
              </div>
            </div>

            {/* Note & Submit */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-4 px-6 rounded-xl font-bold text-black bg-gradient-to-r from-accent-amber to-amber-400 hover:from-amber-400 hover:to-accent-amber transition duration-300 shadow-glow-amber flex items-center justify-center space-x-2 text-base group"
              >
                <MessageSquare className="w-5 h-5 fill-black" />
                <span>Submit & Open WhatsApp Enquiry</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <p className="text-center text-xs text-text-dim mt-3 flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-status-success" />
                No advance payment taken online. All reservations confirmed directly on WhatsApp.
              </p>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
