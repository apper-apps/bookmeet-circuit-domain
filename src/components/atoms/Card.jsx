import { motion } from 'framer-motion';

const Card = ({ 
  children, 
  className = '', 
  hover = false, 
  onClick,
  padding = 'default',
  ...props 
}) => {
  const paddings = {
    none: '',
    sm: 'p-4',
    default: 'p-6',
    lg: 'p-8'
  };

  const baseClasses = `bg-white rounded-xl border border-gray-200 shadow-sm ${paddings[padding]} ${className}`;
  
  const cardProps = {
    className: baseClasses,
    onClick,
    ...props
  };

  if (hover) {
    return (
      <motion.div
        whileHover={{ scale: 1.02, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
        transition={{ duration: 0.2 }}
        {...cardProps}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div {...cardProps}>
      {children}
    </div>
  );
};

export default Card;