import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)) }
export function formatCurrency(amount: number) { return new Intl.NumberFormat('ar-OM', { style: 'currency', currency: 'OMR', maximumFractionDigits: 0 }).format(amount) }
export function formatNumber(n: number) { return new Intl.NumberFormat('ar-OM').format(n) }