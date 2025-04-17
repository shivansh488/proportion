import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  children: React.ReactNode;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const CustomButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    children, 
    className, 
    variant = 'primary', 
    size = 'default', 
    icon, 
    iconPosition = 'left',
    ...props 
  }, ref) => {
    const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
    
    const variants = {
      primary: "bg-primary text-primary-foreground shadow-button hover:opacity-90 active:scale-[0.98]",
      secondary: "bg-secondary text-secondary-foreground shadow-subtle hover:bg-secondary/80 active:scale-[0.98]",
      outline: "border border-input bg-background hover:bg-secondary hover:text-secondary-foreground active:scale-[0.98]",
      ghost: "hover:bg-accent hover:text-accent-foreground active:scale-[0.98]"
    };
    
    const sizes = {
      default: "h-10 py-2 px-4 rounded-md",
      sm: "h-9 px-3 rounded-md text-sm",
      lg: "h-12 px-6 rounded-md text-lg",
      icon: "h-10 w-10 rounded-md"
    };

    return (
      <button
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          className
        )}
        ref={ref}
        {...props}
      >
        {icon && iconPosition === 'left' && <span className="mr-2">{icon}</span>}
        {children}
        {icon && iconPosition === 'right' && <span className="ml-2">{icon}</span>}
      </button>
    );
  }
);

CustomButton.displayName = 'CustomButton';

export default CustomButton;