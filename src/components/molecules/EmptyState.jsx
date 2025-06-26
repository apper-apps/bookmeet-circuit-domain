import { motion } from 'framer-motion';
import ApperIcon from '../ApperIcon';
import Button from '../atoms/Button';

const EmptyState = ({ 
  title,
  description,
  actionLabel,
  onAction,
  icon = 'Inbox',
  className = ''
}) => {
  const emptyAnimation = {
    initial: { scale: 0.9, opacity: 0 },
    animate: { scale: 1, opacity: 1 }
  };

  const iconFloat = {
    animate: { y: [0, -10, 0] },
    transition: { repeat: Infinity, duration: 3 }
  };

  return (
    <motion.div
      {...emptyAnimation}
      className={`text-center py-12 ${className}`}
    >
      <motion.div {...iconFloat}>
        <ApperIcon name={icon} className="w-16 h-16 text-gray-300 mx-auto mb-4" />
      </motion.div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 mb-6 max-w-md mx-auto">{description}</p>
      {onAction && actionLabel && (
        <Button onClick={onAction} variant="primary">
          {actionLabel}
        </Button>
      )}
    </motion.div>
  );
};

export default EmptyState;