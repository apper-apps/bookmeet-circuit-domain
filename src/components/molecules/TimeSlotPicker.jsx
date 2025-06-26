import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format, addDays, isSameDay } from 'date-fns';
import { availabilityService } from '@/services/api/availabilityService';
import { bookingService } from '@/services/api/bookingService';
import ApperIcon from '../ApperIcon';
import LoadingSpinner from '../atoms/LoadingSpinner';

const TimeSlotPicker = ({ meetingType, selectedDate, onSlotSelect, selectedSlot }) => {
  const [timeSlots, setTimeSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [availableDates, setAvailableDates] = useState([]);

  useEffect(() => {
    generateAvailableDates();
  }, []);

  useEffect(() => {
    if (selectedDate && meetingType) {
      loadTimeSlots();
    }
  }, [selectedDate, meetingType]);

  const generateAvailableDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 0; i < 14; i++) {
      const date = addDays(today, i);
      const dayOfWeek = date.getDay();
      
      // Skip weekends for now (can be configured)
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        dates.push(date);
      }
    }
    
    setAvailableDates(dates);
  };

  const loadTimeSlots = async () => {
    setLoading(true);
    try {
      const slots = await availabilityService.generateTimeSlots(
        selectedDate, 
        meetingType.Id, 
        meetingType.duration
      );
      
      // Filter out booked slots
      const bookings = await bookingService.getByDateRange(
        selectedDate, 
        new Date(selectedDate.getTime() + 24 * 60 * 60 * 1000)
      );
      
      const availableSlots = slots.filter(slot => {
        return !bookings.some(booking => 
          new Date(booking.dateTime).getTime() === new Date(slot.dateTime).getTime()
        );
      });
      
      setTimeSlots(availableSlots);
    } catch (error) {
      console.error('Error loading time slots:', error);
      setTimeSlots([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDateSelect = (date) => {
    onSlotSelect(null); // Reset selected slot when date changes
  };

  const staggerAnimation = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-6">
      {/* Date Selection */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Select a date</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {availableDates.map((date, index) => (
            <motion.button
              key={date.toISOString()}
              {...staggerAnimation}
              transition={{ delay: index * 0.05 }}
              onClick={() => handleDateSelect(date)}
              className={`p-3 rounded-lg border text-center transition-all duration-200 ${
                selectedDate && isSameDay(date, selectedDate)
                  ? 'border-primary bg-primary text-white'
                  : 'border-gray-200 hover:border-primary hover:bg-primary/5'
              }`}
            >
              <div className="text-sm font-medium">
                {format(date, 'EEE')}
              </div>
              <div className="text-lg font-bold">
                {format(date, 'd')}
              </div>
              <div className="text-xs opacity-75">
                {format(date, 'MMM')}
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Time Slot Selection */}
      {selectedDate && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Available times for {format(selectedDate, 'EEEE, MMMM d')}
          </h3>
          
          {loading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner size="lg" className="text-primary" />
            </div>
          ) : timeSlots.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {timeSlots.map((slot, index) => (
                <motion.button
                  key={slot.dateTime}
                  {...staggerAnimation}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => onSlotSelect(slot)}
                  className={`p-3 rounded-lg border text-center transition-all duration-200 ${
                    selectedSlot && selectedSlot.dateTime === slot.dateTime
                      ? 'border-primary bg-primary text-white'
                      : 'border-gray-200 hover:border-primary hover:bg-primary/5'
                  }`}
                >
                  <div className="font-medium">
                    {format(new Date(slot.dateTime), 'h:mm a')}
                  </div>
                </motion.button>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <ApperIcon name="Calendar" className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No available time slots for this date</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TimeSlotPicker;