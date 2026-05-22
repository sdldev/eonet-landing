export const WHATSAPP_NUMBER = "6289624424649";
export const WHATSAPP_BASE_URL = `https://wa.me/${WHATSAPP_NUMBER}`;
export const buildWhatsAppUrl = (message: string) => `${WHATSAPP_BASE_URL}?text=${encodeURIComponent(message)}`;
