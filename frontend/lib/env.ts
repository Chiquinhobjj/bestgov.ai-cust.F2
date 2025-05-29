import { env } from 'next-runtime-env';
import { unstable_noStore as noStore } from 'next/cache';

export const getEnv = (key: string, defaultValue?: string): string => {
  // Prevent caching during static rendering
  noStore();
  
  try {
    // Use process.env for build time, and env() for client-side runtime
    const value = typeof window === 'undefined' 
      ? process.env[key] as string 
      : env(key);
    return value || defaultValue || '';
  } catch (error) {
    console.error(`Error getting environment variable ${key}:`, error);
    return defaultValue || '';
  }
};

export const getApiUrl = (): string => {
  return getEnv('NEXT_PUBLIC_API_URL', 'https://api-evoai.evoapicloud.com');
}; 