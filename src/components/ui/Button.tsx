'use client';

import React from 'react';
import { openMackModal, ModalType } from './InteractionModals';

export type ButtonVariant = 'primary-black' | 'secondary-outline' | 'primary-white' | 'cta-outline';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  href?: string;
  exactWidth?: string | number;
  exactHeight?: string | number;
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void;
}

export function Button({
  variant = 'primary-black',
  href,
  exactWidth,
  exactHeight,
  children,
  className = '',
  onClick,
  ...props
}: ButtonProps) {
  const baseStyles =
    'inline-flex items-center justify-center font-montserrat rounded-[8px] transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 select-none cursor-pointer active:scale-[0.98]';

  let variantStyles = '';
  switch (variant) {
    case 'primary-black':
      variantStyles =
        'bg-[#000000] text-[#FFFFFF] hover:bg-[#1F2937] active:bg-[#111827] focus-visible:ring-black';
      break;
    case 'secondary-outline':
      variantStyles =
        'bg-transparent border border-[#D1D5DB] text-[#374151] hover:bg-black/5 active:bg-black/10 focus-visible:ring-gray-400';
      break;
    case 'primary-white':
      variantStyles =
        'bg-[#FFFFFF] text-[#000000] hover:bg-gray-100 active:bg-gray-200 focus-visible:ring-white';
      break;
    case 'cta-outline':
      variantStyles =
        'bg-transparent border border-[#FFFFFF] text-[#FFFFFF] hover:bg-white/10 active:bg-white/20 focus-visible:ring-white';
      break;
  }

  const customStyle: React.CSSProperties = {};
  if (exactWidth) {
    customStyle.width = typeof exactWidth === 'number' ? `${exactWidth}px` : exactWidth;
  }
  if (exactHeight) {
    customStyle.height = typeof exactHeight === 'number' ? `${exactHeight}px` : exactHeight;
  }

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
    if (onClick) onClick(e);
    if (href) {
      let modal: ModalType = null;
      if (href === '#configure') modal = 'configure';
      else if (href === '#brochure') modal = 'brochure';
      else if (href === '#contact-dealer') modal = 'contact';
      else if (href === '#find-dealer') modal = 'find-dealer';
      else if (href === '#request-quote') modal = 'quote';

      if (modal) {
        e.preventDefault();
        openMackModal(modal);
      }
    }
  };

  if (href) {
    return (
      <a
        href={href}
        onClick={handleClick}
        className={`${baseStyles} ${variantStyles} ${className}`}
        style={customStyle}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      onClick={handleClick}
      className={`${baseStyles} ${variantStyles} ${className}`}
      style={customStyle}
      {...props}
    >
      {children}
    </button>
  );
}
