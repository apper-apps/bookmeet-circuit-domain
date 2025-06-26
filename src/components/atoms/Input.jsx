import { useState } from 'react';
import ApperIcon from '../ApperIcon';

const Input = ({ 
  label, 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  error,
  required = false,
  disabled = false,
  icon,
  className = '',
  ...props 
}) => {
  const [focused, setFocused] = useState(false);

  const hasValue = value && value.length > 0;

  return (
    <div className={`relative ${className}`}>
      {/* Floating Label */}
      {label && (
        <label 
          className={`absolute left-3 transition-all duration-200 pointer-events-none ${
            focused || hasValue 
              ? 'top-2 text-xs text-primary' 
              : 'top-3 text-sm text-gray-500'
          }`}
        >
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}
      
      {/* Input Container */}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <ApperIcon name={icon} className="w-4 h-4 text-gray-400" />
          </div>
        )}
        
        <input
          type={type}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          disabled={disabled}
          className={`w-full rounded-lg border transition-all duration-200 ${
            label ? 'pt-6 pb-2 px-3' : 'py-3 px-3'
          } ${
            icon ? 'pl-10' : ''
          } ${
            error 
              ? 'border-error focus:border-error focus:ring-error/20' 
              : focused
              ? 'border-primary focus:border-primary focus:ring-primary/20'
              : 'border-gray-300 focus:border-primary focus:ring-primary/20'
          } ${
            disabled ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : 'bg-white'
          } focus:outline-none focus:ring-2`}
          placeholder={label ? '' : placeholder}
          {...props}
        />
      </div>
      
      {/* Error Message */}
      {error && (
        <p className="mt-1 text-sm text-error flex items-center gap-1">
          <ApperIcon name="AlertCircle" className="w-3 h-3" />
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;