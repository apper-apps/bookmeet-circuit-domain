import { motion } from 'framer-motion';
import ApperIcon from '../ApperIcon';
import Button from '../atoms/Button';

const ErrorState = ({ 
  title = 'Something went wrong',
  message = 'We encountered an error while loading your data.',
  onRetry,
  className = ''
}) => {
  const errorAnimation = {
    initial: { scale: 0.9, opacity: 0 },
    animate: { scale: 1, opacity: 1 }
  };

  const iconBounce = {
    animate: { y: [0, -10, 0] },
    transition: { repeat: Infinity, duration: 3 }
  };

  return (
    <motion.div
      {...errorAnimation}
      className={`text-center py-12 ${className}`}
    >
      <motion.div {...iconBounce}>
        <ApperIcon name="AlertTriangle" className="w-16 h-16 text-error mx-auto mb-4" />
      </motion.div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 mb-6 max-w-md mx-auto">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="primary">
          <ApperIcon name="RefreshCw" className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      )}
    </motion.div>
  );
};

export default ErrorState;