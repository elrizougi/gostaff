import { Worker, Site } from '@/types';

export function formatPhoneForWhatsapp(phone: string | undefined): string | null {
  if (!phone) return null;
  const digitsRaw = phone.replace(/\D/g, '');
  let intl = '';
  
  // Saudi number handling
  if (digitsRaw.startsWith('966')) intl = digitsRaw;
  else if (digitsRaw.startsWith('0') && digitsRaw.length >= 10) intl = `966${digitsRaw.slice(1)}`;
  else if (digitsRaw.startsWith('5') && digitsRaw.length === 9) intl = `966${digitsRaw}`;
  // Fallback for international numbers
  else if (digitsRaw.length >= 11) intl = digitsRaw;
  else return null;

  if (!/^\d{11,15}$/.test(intl)) return null;
  return intl;
}

export function buildWhatsappMessage(worker: Worker, site: Site, driver: Worker | undefined): string {
  const today = new Date();
  const dateStrAr = today.toLocaleDateString('ar-SA', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  const dateStrEn = today.toLocaleDateString('en-GB', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });

  const car = driver 
    ? `${driver.driverCarType || ''}${driver.driverCarPlate ? ` (${driver.driverCarPlate})` : ''}` 
    : '';
    
  const capacity = driver && typeof driver.driverCapacity === 'number' 
    ? ` - (Cap: ${driver.driverCapacity})` 
    : '';

  let driverSection = '';
  if (driver) {
    driverSection = `
السائق / Driver: ${driver.name}
جوال / Mobile: ${driver.phone || ''}
السيارة / Car: ${car}${capacity}`;
  } else {
    driverSection = `
السائق / Driver: بدون / None`;
  }

  const msg = `مرحبا / Hello ${worker.name}

التاريخ / Date: ${dateStrEn} (${dateStrAr})

المشروع / Site: ${site.name}
الموقع / Location: ${site.location || 'غير محدد / Not specified'}
${driverSection}`;

  return msg;
}

export function buildWhatsappLink(worker: Worker, site: Site | undefined, allWorkers: Worker[]): string | null {
  if (!site) return null;
  
  const phone = formatPhoneForWhatsapp(worker.phone);
  if (!phone) return null;

  const driver = allWorkers.find(dw => dw.id === site.driverId);
  const msg = buildWhatsappMessage(worker, site, driver);
  
  return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
}
