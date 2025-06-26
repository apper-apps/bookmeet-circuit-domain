import { useState } from 'react';
import { motion } from 'framer-motion';
import CalendarView from '../organisms/CalendarView';
import ApperIcon from '../ApperIcon';
import Button from '../atoms/Button';

const Calendar = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [view, setView] = useState('month');

  const pageAnimation = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
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
                Calendar
              </h1>
              <p className="text-gray-600 mt-1">
                View and manage your scheduled meetings.
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex bg-gray-100 rounded-lg p-1">
                <Button
                  variant={view === 'month' ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setView('month')}
                  className="px-3 py-1"
                >
                  Month
                </Button>
                <Button
                  variant={view === 'week' ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setView('week')}
                  className="px-3 py-1"
                >
                  Week
                </Button>
              </div>
              
              <Button
                variant="primary"
                onClick={() => window.location.href = '/meeting-types'}
              >
                <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
                New Meeting Type
              </Button>
            </div>
          </div>
        </div>

        {/* Calendar */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <CalendarView
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
            />
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {selectedDate && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {selectedDate.toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </h3>
                <p className="text-gray-500 text-sm">
                  Click on a date to view meetings for that day.
                </p>
              </div>
            )}
            
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => window.location.href = '/meeting-types'}
                >
                  <ApperIcon name="Users" className="w-4 h-4 mr-2" />
                  Manage Meeting Types
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => window.location.href = '/bookings'}
                >
                  <ApperIcon name="Clock" className="w-4 h-4 mr-2" />
                  View All Bookings
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => window.location.href = '/settings'}
                >
                  <ApperIcon name="Settings" className="w-4 h-4 mr-2" />
                  Availability Settings
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Calendar;