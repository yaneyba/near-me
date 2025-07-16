/**
 * SEO Hook - Updates meta tags dynamically based on subdomain
 * This ensures proper SEO even when the React app loads
 */

import { useEffect } from 'react';
import { SubdomainInfo } from '@/types';

interface SEOData {
  title: string;
  description: string;
  keywords: string;
  canonicalUrl: string;
  ogImage: string;
}

export function useSEO(subdomainInfo: SubdomainInfo, pageTitle?: string) {
  useEffect(() => {
    const seoData = getSEOData(subdomainInfo);
    
    // Update document title
    document.title = pageTitle || seoData.title;
    
    // Update meta description
    updateMetaTag('name', 'description', seoData.description);
    
    // Update meta keywords
    updateMetaTag('name', 'keywords', seoData.keywords);
    
    // Update canonical URL
    updateLinkTag('canonical', seoData.canonicalUrl);
    
    // Update Open Graph tags
    updateMetaTag('property', 'og:title', pageTitle || seoData.title);
    updateMetaTag('property', 'og:description', seoData.description);
    updateMetaTag('property', 'og:url', seoData.canonicalUrl);
    updateMetaTag('property', 'og:image', seoData.ogImage);
    
    // Update Twitter Card tags
    updateMetaTag('name', 'twitter:title', pageTitle || seoData.title);
    updateMetaTag('name', 'twitter:description', seoData.description);
    updateMetaTag('name', 'twitter:image', seoData.ogImage);
    
  }, [subdomainInfo, pageTitle]);
}

function getSEOData(subdomainInfo: SubdomainInfo): SEOData {
  const category = subdomainInfo.category;
  
  // Custom branding for each category
  switch (category) {
    case 'senior-care':
      return {
        title: 'Senior Care Services Near Me | Trusted Elderly Care Providers | SeniorCare Connect',
        description: 'Find compassionate senior care services and trusted providers near you. Home care, assisted living, memory care, physical therapy, and specialized elderly care services. Vetted professionals for your loved ones.',
        keywords: 'senior care near me, elderly care services, home care providers, assisted living, memory care, senior home care, elder care, senior care services, nursing care, senior health services, elderly assistance',
        canonicalUrl: 'https://senior-care.near-me.us/',
        ogImage: '/og-senior-care.png'
      };
      
    case 'specialty-pet':
      return {
        title: 'Premium Specialty Pet Products & Services | Expert Pet Care | PetCare Pro',
        description: 'Discover premium pet products, accessories, and professional services. From exotic food to health supplements, grooming to training - everything for your pet\'s special needs. Shop quality brands and find trusted local experts.',
        keywords: 'specialty pet products, premium pet food, exotic pet supplies, pet accessories, pet health supplements, pet grooming products, professional pet services, pet training equipment, specialty veterinarian, pet care near me',
        canonicalUrl: 'https://specialty-pet.near-me.us/',
        ogImage: '/og-specialty-pet.png'
      };
      
    case 'water-refill':
      return {
        title: 'Water Refill Near Me | Find Local Stations | AquaFinder',
        description: 'Find clean, affordable water refill stations near you. 486+ verified locations nationwide. Save money ($0.25/gallon vs $3+ bottles) and reduce plastic waste with AquaFinder\'s verified directory.',
        keywords: 'water refill near me, water refill stations, water filling stations, refill water near me, clean water refill, affordable water refill, water station locations',
        canonicalUrl: 'https://water-refill.near-me.us/',
        ogImage: '/og-water-refill.png'
      };
      
    case 'nail-salons':
      return {
        title: 'Best Nail Salons Near You | Professional Nail Care Services',
        description: 'Find top-rated nail salons near you. Compare local providers, read reviews, and book appointments online. Professional manicures, pedicures, and nail art services.',
        keywords: 'nail salons near me, nail care, manicure, pedicure, nail art, professional nail services, local nail salons',
        canonicalUrl: 'https://nail-salons.near-me.us/',
        ogImage: '/og-nail-salons.png'
      };
      
    case 'auto-repair':
      return {
        title: 'Best Auto Repair Shops Near You | Trusted Car Service Centers',
        description: 'Find reliable auto repair shops near you. Compare local mechanics, read reviews, and get quotes online. Professional car maintenance and repair services.',
        keywords: 'auto repair near me, car repair, mechanic, automotive service, car maintenance, auto shop, vehicle repair',
        canonicalUrl: 'https://auto-repair.near-me.us/',
        ogImage: '/og-auto-repair.png'
      };
      
    default:
      return {
        title: 'Near Me Directory | Find Local Businesses & Services Nationwide',
        description: 'Find trusted local businesses and services near you. Browse nail salons, auto repair, water refill stations, senior care, and more. 80+ verified businesses nationwide.',
        keywords: 'local business directory, businesses near me, local services, find businesses, local directory',
        canonicalUrl: 'https://near-me.us/',
        ogImage: '/og-near-me.png'
      };
  }
}

function updateMetaTag(attribute: string, name: string, content: string) {
  let meta = document.querySelector(`meta[${attribute}="${name}"]`);
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute(attribute, name);
    document.head.appendChild(meta);
  }
  meta.setAttribute('content', content);
}

function updateLinkTag(rel: string, href: string) {
  let link = document.querySelector(`link[rel="${rel}"]`);
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', rel);
    document.head.appendChild(link);
  }
  link.setAttribute('href', href);
}
