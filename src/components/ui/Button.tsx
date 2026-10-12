import React from 'react';

export type ButtonVariant = 'primary-black' | 'secondary-outline' | 'primary-white' | 'cta-outline';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  href?: string;
  exactWidth?: string | number;
  exactHeight?: string | number;
  children: React.ReactNode;
  className?: string;
}

export function Button({
  variant = 'primary-black',
  href,
  exactWidth,
  exactHeight,
  children,
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles =
    'inline-flex items-center justify-center font-montserrat rounded-[8px] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 select-none cursor-pointer';

  let variantStyles = '';
  switch (variant) {
    case 'primary-black':
      variantStyles =
        'bg-[#000000] text-[#FFFFFF] hover:bg-[#1F2937] active:bg-[#111827] focus-visible:ring-black';
      break;
    case 'secondary-outline':
      variantStyles =
        'bg-transparent border border-[#D1D5DB] text-[#111827] hover:bg-black/5 active:bg-black/10 focus-visible:ring-gray-400';
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

  if (href) {
    return (
      <a
        href={href}
        className={`${baseStyles} ${variantStyles} ${className}`}
        style={customStyle}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      className={`${baseStyles} ${variantStyles} ${className}`}
      style={customStyle}
      {...props}
    >
      {children}
    </button>
  );
}
