import { motion } from 'framer-motion';
import DashboardStats from '../organisms/DashboardStats';
import ApperIcon from '../ApperIcon';
import Button from '../atoms/Button';

const Dashboard = () => {
  const pageAnimation = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  };

  const handleCreateMeetingType = () => {
    // Navigate to meeting types with create action
    window.location.href = '/meeting-types?action=create';
  };

  return (
    <motion.div
      {...pageAnimation}
      transition={{ duration: 0.3 }}
      className="p-6"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-heading font-bold text-gray-900">
                Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                Welcome back! Here's an overview of your scheduling activity.
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => window.location.href = '/calendar'}
              >
                <ApperIcon name="Calendar" className="w-4 h-4 mr-2" />
                View Calendar
              </Button>
              <Button
                variant="primary"
                onClick={handleCreateMeetingType}
              >
                <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
                New Meeting Type
              </Button>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <DashboardStats />
      </div>
    </motion.div>
  );
};

export default Dashboard;