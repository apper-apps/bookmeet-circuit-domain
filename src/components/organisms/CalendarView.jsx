import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  subMonths,
  isToday
} from 'date-fns';
import ApperIcon from '../ApperIcon';
import Button from '../atoms/Button';
import { bookingService } from '@/services/api/bookingService';
import { meetingTypeService } from '@/services/api/meetingTypeService';

const CalendarView = ({ onDateSelect, selectedDate }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [bookings, setBookings] = useState([]);
  const [meetingTypes, setMeetingTypes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, [currentMonth]);

  const loadData = async () => {
    setLoading(true);
    try {
      const monthStart = startOfMonth(currentMonth);
      const monthEnd = endOfMonth(currentMonth);
      
      const [bookingsData, meetingTypesData] = await Promise.all([
        bookingService.getByDateRange(monthStart, monthEnd),
        meetingTypeService.getAll()
      ]);
      
      setBookings(bookingsData);
      setMeetingTypes(meetingTypesData);
    } catch (error) {
      console.error('Error loading calendar data:', error);
    } finally {
      setLoading(false);
    }
  };

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  
  const calendarDays = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd
  });

  const getBookingsForDate = (date) => {
    return bookings.filter(booking => 
      isSameDay(new Date(booking.dateTime), date)
    );
  };

  const getMeetingTypeColor = (meetingTypeId) => {
    const meetingType = meetingTypes.find(mt => mt.Id === meetingTypeId);
    return meetingType?.color || '#5B21B6';
  };

  const handlePrevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const handleDateClick = (date) => {
    onDateSelect?.(date);
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Calendar Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            {format(currentMonth, 'MMMM yyyy')}
          </h2>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePrevMonth}
              className="p-2"
            >
              <ApperIcon name="ChevronLeft" className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleNextMonth}
              className="p-2"
            >
              <ApperIcon name="ChevronRight" className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-4">
        {/* Week Day Headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map(day => (
            <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((date, index) => {
            const dayBookings = getBookingsForDate(date);
            const isCurrentMonth = isSameMonth(date, currentMonth);
            const isSelected = selectedDate && isSameDay(date, selectedDate);
            const isTodayDate = isToday(date);

            return (
              <motion.button
                key={date.toISOString()}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.01 }}
                onClick={() => handleDateClick(date)}
                className={`relative p-2 h-20 text-left rounded-lg border transition-all duration-200 ${
                  isSelected
                    ? 'border-primary bg-primary/10'
                    : isTodayDate
                    ? 'border-primary bg-primary/5'
                    : isCurrentMonth
                    ? 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                    : 'border-transparent text-gray-300'
                }`}
              >
                <div className={`text-sm font-medium ${
                  isTodayDate 
                    ? 'text-primary' 
                    : isCurrentMonth 
                    ? 'text-gray-900' 
                    : 'text-gray-400'
                }`}>
                  {format(date, 'd')}
                </div>
                
                {/* Booking indicators */}
                <div className="mt-1 space-y-1">
                  {dayBookings.slice(0, 2).map((booking, i) => (
                    <div
                      key={booking.Id}
                      className="h-1 rounded-full"
                      style={{ 
                        backgroundColor: getMeetingTypeColor(booking.meetingTypeId),
                        opacity: 0.7
                      }}
                    />
                  ))}
                  {dayBookings.length > 2 && (
                    <div className="text-xs text-gray-500">
                      +{dayBookings.length - 2} more
                    </div>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CalendarView;