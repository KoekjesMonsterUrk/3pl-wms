/**
 * Utility functions for 3PL WMS
 */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, formatDistanceToNow, parseISO, isValid } from 'date-fns';
import { nl } from 'date-fns/locale';

/**
 * Merge Tailwind CSS classes with clsx
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a date string or Date object
 */
export function formatDate(
  date: string | Date | null | undefined,
  formatStr: string = 'dd-MM-yyyy'
): string {
  if (!date) return '-';

  const parsedDate = typeof date === 'string' ? parseISO(date) : date;

  if (!isValid(parsedDate)) return '-';

  return format(parsedDate, formatStr, { locale: nl });
}

/**
 * Format a datetime string or Date object
 */
export function formatDateTime(
  date: string | Date | null | undefined,
  formatStr: string = 'dd-MM-yyyy HH:mm'
): string {
  return formatDate(date, formatStr);
}

/**
 * Format a relative time string
 */
export function formatRelativeTime(date: string | Date | null | undefined): string {
  if (!date) return '-';

  const parsedDate = typeof date === 'string' ? parseISO(date) : date;

  if (!isValid(parsedDate)) return '-';

  return formatDistanceToNow(parsedDate, { addSuffix: true, locale: nl });
}

/**
 * Format a number as currency
 */
export function formatCurrency(
  amount: number | null | undefined,
  currency: string = 'EUR',
  locale: string = 'nl-NL'
): string {
  if (amount === null || amount === undefined) return '-';

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount);
}

/**
 * Format a number with decimal places
 */
export function formatNumber(
  value: number | null | undefined,
  decimals: number = 2,
  locale: string = 'nl-NL'
): string {
  if (value === null || value === undefined) return '-';

  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Format a quantity with unit
 */
export function formatQuantity(
  quantity: number | null | undefined,
  unit: string = 'EA'
): string {
  if (quantity === null || quantity === undefined) return '-';

  return `${formatNumber(quantity, quantity % 1 === 0 ? 0 : 2)} ${unit}`;
}

/**
 * Format a weight in kg
 */
export function formatWeight(
  weight: number | null | undefined,
  unit: string = 'kg'
): string {
  if (weight === null || weight === undefined) return '-';

  return `${formatNumber(weight, 2)} ${unit}`;
}

/**
 * Format a percentage
 */
export function formatPercentage(
  value: number | null | undefined,
  decimals: number = 1
): string {
  if (value === null || value === undefined) return '-';

  return `${formatNumber(value, decimals)}%`;
}

/**
 * Format file size in human readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';

  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const size = bytes / Math.pow(1024, i);

  return `${formatNumber(size, i > 0 ? 1 : 0)} ${units[i]}`;
}

/**
 * Truncate a string to a maximum length
 */
export function truncate(str: string, maxLength: number = 50): string {
  if (str.length <= maxLength) return str;
  return `${str.slice(0, maxLength - 3)}...`;
}

/**
 * Generate a unique ID
 */
export function generateId(): string {
  return crypto.randomUUID();
}

/**
 * Debounce a function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Capitalize the first letter of a string
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Convert a string to title case
 */
export function toTitleCase(str: string): string {
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => capitalize(word))
    .join(' ');
}

/**
 * Convert a camelCase or snake_case string to human readable
 */
export function humanize(str: string): string {
  return str
    .replace(/([A-Z])/g, ' $1')
    .replace(/_/g, ' ')
    .trim()
    .toLowerCase()
    .replace(/^\w/, (c) => c.toUpperCase());
}

/**
 * Get status color for badges
 */
export function getStatusColor(status: string): string {
  const statusColors: Record<string, string> = {
    // General
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800',
    pending: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    on_hold: 'bg-orange-100 text-orange-800',

    // Inventory
    available: 'bg-green-100 text-green-800',
    hold: 'bg-orange-100 text-orange-800',
    damaged: 'bg-red-100 text-red-800',
    quarantine: 'bg-purple-100 text-purple-800',
    reserved: 'bg-blue-100 text-blue-800',
    allocated: 'bg-cyan-100 text-cyan-800',
    expired: 'bg-red-100 text-red-800',

    // Orders
    draft: 'bg-gray-100 text-gray-800',
    confirmed: 'bg-blue-100 text-blue-800',
    picking: 'bg-yellow-100 text-yellow-800',
    picked: 'bg-lime-100 text-lime-800',
    packing: 'bg-amber-100 text-amber-800',
    packed: 'bg-emerald-100 text-emerald-800',
    shipped: 'bg-green-100 text-green-800',
    delivered: 'bg-green-100 text-green-800',
    receiving: 'bg-amber-100 text-amber-800',
    received: 'bg-lime-100 text-lime-800',
    putaway: 'bg-teal-100 text-teal-800',

    // Quality
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    conditional: 'bg-yellow-100 text-yellow-800',

    // Priority
    critical: 'bg-red-100 text-red-800',
    urgent: 'bg-red-100 text-red-800',
    high: 'bg-orange-100 text-orange-800',
    normal: 'bg-blue-100 text-blue-800',
    low: 'bg-gray-100 text-gray-800',

    // Tasks
    assigned: 'bg-blue-100 text-blue-800',
    in_progress: 'bg-amber-100 text-amber-800',

    // Waves
    released: 'bg-blue-100 text-blue-800',
  };

  return statusColors[status.toLowerCase()] || 'bg-gray-100 text-gray-800';
}

/**
 * Get priority color
 */
export function getPriorityColor(priority: number | string): string {
  if (typeof priority === 'string') {
    return getStatusColor(priority);
  }

  if (priority <= 2) return 'bg-red-100 text-red-800';
  if (priority <= 4) return 'bg-orange-100 text-orange-800';
  if (priority <= 6) return 'bg-blue-100 text-blue-800';
  return 'bg-gray-100 text-gray-800';
}

/**
 * Calculate percentage
 */
export function calculatePercentage(
  value: number,
  total: number
): number {
  if (total === 0) return 0;
  return (value / total) * 100;
}

/**
 * Parse a barcode and return type
 */
export function parseBarcodeType(barcode: string): 'ean13' | 'ean8' | 'upc' | 'code128' | 'unknown' {
  if (/^\d{13}$/.test(barcode)) return 'ean13';
  if (/^\d{8}$/.test(barcode)) return 'ean8';
  if (/^\d{12}$/.test(barcode)) return 'upc';
  if (/^[A-Za-z0-9\-\.$/+%\s]+$/.test(barcode)) return 'code128';
  return 'unknown';
}

/**
 * Validate EAN-13 barcode checksum
 */
export function validateEAN13(barcode: string): boolean {
  if (!/^\d{13}$/.test(barcode)) return false;

  const digits = barcode.split('').map(Number);
  const checkDigit = digits.pop()!;

  const sum = digits.reduce((acc, digit, index) => {
    return acc + digit * (index % 2 === 0 ? 1 : 3);
  }, 0);

  const calculatedCheck = (10 - (sum % 10)) % 10;
  return calculatedCheck === checkDigit;
}

/**
 * Sleep for a specified number of milliseconds
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Check if a value is empty (null, undefined, empty string, empty array, empty object)
 */
export function isEmpty(value: unknown): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}

/**
 * Deep clone an object
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Group an array by a key
 */
export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce((result, item) => {
    const groupKey = String(item[key]);
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {} as Record<string, T[]>);
}

/**
 * Sort an array of objects by a key
 */
export function sortBy<T>(
  array: T[],
  key: keyof T,
  order: 'asc' | 'desc' = 'asc'
): T[] {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];

    if (aVal < bVal) return order === 'asc' ? -1 : 1;
    if (aVal > bVal) return order === 'asc' ? 1 : -1;
    return 0;
  });
}

/**
 * Calculate warehouse location code from components
 */
export function buildLocationCode(
  aisle?: string,
  rack?: string,
  level?: string,
  position?: string
): string {
  const parts = [aisle, rack, level, position].filter(Boolean);
  return parts.join('-');
}

/**
 * Parse a location code into components
 */
export function parseLocationCode(code: string): {
  aisle?: string;
  rack?: string;
  level?: string;
  position?: string;
} {
  const parts = code.split('-');
  return {
    aisle: parts[0],
    rack: parts[1],
    level: parts[2],
    position: parts[3],
  };
}

/**
 * Format order number for display
 */
export function formatOrderNumber(type: 'inbound' | 'outbound', number: number): string {
  const prefix = type === 'inbound' ? 'INB' : 'OUT';
  const year = new Date().getFullYear();
  return `${prefix}-${year}-${String(number).padStart(4, '0')}`;
}

/**
 * Generate an order number
 */
export function generateOrderNumber(type: 'inbound' | 'outbound'): string {
  const prefix = type === 'inbound' ? 'INB' : 'OUT';
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `${prefix}-${year}-${random}`;
}

/**
 * Format a phone number for display
 */
export function formatPhoneNumber(phone: string | null | undefined): string {
  if (!phone) return '-';

  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');

  // Dutch phone number formatting
  if (digits.startsWith('31')) {
    const national = digits.slice(2);
    if (national.length === 9) {
      return `+31 ${national.slice(0, 2)} ${national.slice(2, 5)} ${national.slice(5)}`;
    }
  }

  // Return as-is if we can't format it
  return phone;
}

/**
 * Format an address for display
 */
export function formatAddress(address: {
  line1?: string;
  line2?: string;
  street1?: string;
  street2?: string;
  city?: string;
  postal_code?: string;
  postalCode?: string;
  country?: string;
} | null | undefined): string {
  if (!address) return '-';

  const parts = [
    address.line1 || address.street1,
    address.line2 || address.street2,
    [(address.postal_code || address.postalCode), address.city].filter(Boolean).join(' '),
    address.country,
  ].filter(Boolean);

  return parts.join(', ');
}

/**
 * Format address for multiline display
 */
export function formatAddressLines(address: {
  line1?: string;
  line2?: string;
  street1?: string;
  street2?: string;
  city?: string;
  postal_code?: string;
  postalCode?: string;
  country?: string;
} | null | undefined): string[] {
  if (!address) return [];

  return [
    address.line1 || address.street1,
    address.line2 || address.street2,
    [(address.postal_code || address.postalCode), address.city].filter(Boolean).join(' '),
    address.country,
  ].filter(Boolean) as string[];
}

/**
 * Get initials from a name
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Generate a wave number
 */
export function generateWaveNumber(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `W-${year}-${random}`;
}
