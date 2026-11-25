import React from 'react';
import { cn } from '@/lib/utils';

// Official Reclaim Me brand mark
export const BRAND_LOGO_URL = 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/697e9969762b8f3d6e3c90bd/49cc55b37_1000009828.png';

export default function SharedBrandLogo({ className, alt = 'Reclaim Me logo' }) {
  return (
    <img
      src={BRAND_LOGO_URL}
      alt={alt}
      className={cn('object-contain select-none', className)}
      draggable={false}
    />
  );
}