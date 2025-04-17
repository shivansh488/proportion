import React from 'react';
import { cn } from "@/lib/utils";
import { CheckCircle, XCircle, Clock } from "lucide-react";

interface StatusBadgeProps {
  status: string | undefined;  // Make status possibly undefined
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const getStatusConfig = () => {
    // Check if status is undefined or empty
    if (!status) {
      return {
        icon: <Clock className="w-4 h-4 mr-1.5" />,
        bgColor: 'bg-gray-50',
        textColor: 'text-gray-500',
        borderColor: 'border-gray-200'
      };
    }

    switch (status.toLowerCase()) {
      case 'active':
        return {
          icon: <CheckCircle className="w-4 h-4 mr-1.5" />,
          bgColor: 'bg-green-50',
          textColor: 'text-green-700',
          borderColor: 'border-green-200'
        };
      case 'pending':
        return {
          icon: <Clock className="w-4 h-4 mr-1.5" />,
          bgColor: 'bg-amber-50',
          textColor: 'text-amber-700',
          borderColor: 'border-amber-200'
        };
      case 'completed':
        return {
          icon: <CheckCircle className="w-4 h-4 mr-1.5" />,
          bgColor: 'bg-blue-50',
          textColor: 'text-blue-700',
          borderColor: 'border-blue-200'
        };
      case 'inactive':
      case 'cancelled':
        return {
          icon: <XCircle className="w-4 h-4 mr-1.5" />,
          bgColor: 'bg-gray-50',
          textColor: 'text-gray-500',
          borderColor: 'border-gray-200'
        };
      default:
        return {
          icon: <CheckCircle className="w-4 h-4 mr-1.5" />,
          bgColor: 'bg-blue-50',
          textColor: 'text-blue-700',
          borderColor: 'border-blue-200'
        };
    }
  };

  const { icon, bgColor, textColor, borderColor } = getStatusConfig();

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium transition-all",
        "",
        bgColor,
        textColor,
        borderColor,
        className
      )}
    >
      {icon}
      {status || 'Unknown'}
    </span>
  );
};

export default StatusBadge;