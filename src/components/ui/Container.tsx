import React from 'react';

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export function Container({ children, className = '', ...props }: ContainerProps) {
  return (
    <div
      className={`w-full max-w-[1216px] mx-auto px-4 sm:px-6 lg:px-0 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
