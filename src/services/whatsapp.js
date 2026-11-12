import { sanitizePhoneNumber, formatCurrency } from '../utils/formatters';

export function generateWhatsAppBookingUrl({
  businessNumber,
  customerName,
  customerPhone,
  itemType = 'vehicle', // 'vehicle' or 'camera' or 'service'
  itemName,
  pickupDate,
  returnDate,
  pickupLocation,
  rentalDuration,
  dailyPrice,
  hourlyPrice,
  calculatedPrice,
  additionalMessage,
}) {
  const cleanNumber = sanitizePhoneNumber(businessNumber || '919876543210');

  const greeting = itemType === 'camera'
    ? 'Hello ApexMotion, I am interested in renting professional camera equipment.'
    : itemType === 'service'
    ? 'Hello ApexMotion, I am interested in booking a rental service package.'
    : 'Hello ApexMotion, I am interested in renting a luxury vehicle.';

  const itemLabel = itemType === 'camera' ? 'Equipment' : itemType === 'service' ? 'Service' : 'Vehicle';

  let message = `${greeting}\n\n`;
  message += `👤 *Customer Name:* ${customerName}\n`;
  if (customerPhone) {
    message += `📱 *Customer Phone:* ${customerPhone}\n`;
  }
  message += `🚘 *Selected ${itemLabel}:* ${itemName}\n`;
  message += `📅 *Pickup Date:* ${pickupDate}\n`;
  message += `📅 *Return Date:* ${returnDate}\n`;
  message += `📍 *Pickup Location:* ${pickupLocation}\n`;
  if (rentalDuration) {
    message += `⏱️ *Rental Duration:* ${rentalDuration}\n`;
  }
  if (dailyPrice) {
    message += `💰 *Daily Rate:* ${formatCurrency(dailyPrice)}/day\n`;
  }
  if (calculatedPrice) {
    message += `💵 *Estimated Total:* ${formatCurrency(calculatedPrice)}\n`;
  }
  if (additionalMessage && additionalMessage.trim()) {
    message += `📝 *Notes/Requirements:* ${additionalMessage.trim()}\n`;
  }
  message += `\nPlease confirm availability and booking procedure.`;

  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${cleanNumber}?text=${encodedMessage}`;
}

export function generateDirectContactUrl(businessNumber, customMessage = '') {
  const cleanNumber = sanitizePhoneNumber(businessNumber || '919876543210');
  const defaultText = customMessage || 'Hello ApexMotion, I would like to enquire about your car and camera rental services.';
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(defaultText)}`;
}
