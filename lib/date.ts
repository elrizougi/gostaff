export function daysRemaining(dateStr: string | undefined): number | undefined {
  if (!dateStr) return undefined;
  const target = new Date(dateStr);
  if (isNaN(target.getTime())) return undefined;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);
  const ms = target.getTime() - today.getTime();
  const days = Math.ceil(ms / (1000 * 60 * 60 * 24));
  return Math.max(0, days);
}

export function statusClasses(days?: number): string {
  if (days === undefined) return "bg-gray-100 text-gray-600";
  if (days <= 5) return "bg-red-100 text-red-700";
  if (days <= 10) return "bg-yellow-100 text-yellow-700";
  return "bg-green-100 text-green-700";
}

export function labelFor(days?: number, hasDate?: boolean): string {
  if (!hasDate) return "غير مسجل";
  if (days === undefined) return "غير مسجل";
  if (days === 0) return "منتهي";
  return `${days} يوم`;
}

export function calculateDaysWorked(dateStr: string | undefined): number | undefined {
  if (!dateStr) return undefined;
  const start = new Date(dateStr);
  if (isNaN(start.getTime())) return undefined;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  start.setHours(0, 0, 0, 0);
  const ms = today.getTime() - start.getTime();
  const days = Math.ceil(ms / (1000 * 60 * 60 * 24));
  return Math.max(0, days);
}

export function calculateDurationString(dateStr: string | undefined): string {
  if (!dateStr) return "";
  const start = new Date(dateStr);
  if (isNaN(start.getTime())) return "";
  const today = new Date();
  
  let years = today.getFullYear() - start.getFullYear();
  let months = today.getMonth() - start.getMonth();
  let days = today.getDate() - start.getDate();

  if (days < 0) {
    months--;
  }
  if (months < 0) {
    years--;
    months += 12;
  }

  if (years < 0) return ""; 

  const parts = [];
  if (years > 0) parts.push(`${years} سنة`);
  if (months > 0) parts.push(`${months} شهر`);
  
  if (parts.length === 0) {
      if (years === 0 && months === 0) return "أقل من شهر";
  }

  return parts.join(" و ");
}
