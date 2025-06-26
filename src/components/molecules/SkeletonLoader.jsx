import { motion } from 'framer-motion';

const SkeletonLoader = ({ count = 1, type = 'card', className = '' }) => {
  const skeletonTypes = {
    card: (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    ),
    list: (
      <div className="flex items-center space-x-4 p-4">
        <div className="animate-pulse flex-shrink-0">
          <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
        </div>
        <div className="animate-pulse flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-3 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    ),
    table: (
      <div className="animate-pulse">
        <div className="h-12 bg-gray-200 rounded mb-2"></div>
      </div>
    )
  };

  const staggerAnimation = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {[...Array(count)].map((_, i) => (
        <motion.div
          key={i}
          {...staggerAnimation}
          transition={{ delay: i * 0.1 }}
        >
          {skeletonTypes[type]}
        </motion.div>
      ))}
    </div>
  );
};

export default SkeletonLoader;