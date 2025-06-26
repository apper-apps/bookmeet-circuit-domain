import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format, isToday, isTomorrow, isThisWeek } from 'date-fns';
import ApperIcon from '../ApperIcon';
import Card from '../atoms/Card';
import Badge from '../atoms/Badge';
import LoadingSpinner from '../atoms/LoadingSpinner';
import { bookingService } from '@/services/api/bookingService';
import { meetingTypeService } from '@/services/api/meetingTypeService';

const DashboardStats = () => {
  const [stats, setStats] = useState({
    totalBookings: 0,
    todayBookings: 0,
    weeklyBookings: 0,
    totalMeetingTypes: 0
  });
  const [todayMeetings, setTodayMeetings] = useState([]);
  const [upcomingMeetings, setUpcomingMeetings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [bookings, meetingTypes] = await Promise.all([
        bookingService.getAll(),
        meetingTypeService.getAll()
      ]);

      // Calculate stats
      const today = new Date();
      const todayBookingsData = bookings.filter(booking => 
        isToday(new Date(booking.dateTime)) && booking.status === 'confirmed'
      );
      const weeklyBookingsData = bookings.filter(booking => 
        isThisWeek(new Date(booking.dateTime)) && booking.status === 'confirmed'
      );

      setStats({
        totalBookings: bookings.filter(b => b.status === 'confirmed').length,
        todayBookings: todayBookingsData.length,
        weeklyBookings: weeklyBookingsData.length,
        totalMeetingTypes: meetingTypes.length
      });

      // Today's meetings
      const todayMeetingsWithTypes = todayBookingsData.map(booking => ({
        ...booking,
        meetingType: meetingTypes.find(mt => mt.Id === booking.meetingTypeId)
      }));
      setTodayMeetings(todayMeetingsWithTypes);

      // Upcoming meetings (next 3 days, excluding today)
      const upcomingBookings = bookings
        .filter(booking => {
          const bookingDate = new Date(booking.dateTime);
          return bookingDate > today && booking.status === 'confirmed';
        })
        .sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime))
        .slice(0, 5)
        .map(booking => ({
          ...booking,
          meetingType: meetingTypes.find(mt => mt.Id === booking.meetingTypeId)
        }));
      
      setUpcomingMeetings(upcomingBookings);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Bookings',
      value: stats.totalBookings,
      icon: 'Calendar',
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      title: 'Today',
      value: stats.todayBookings,
      icon: 'Clock',
      color: 'text-success',
      bgColor: 'bg-success/10'
    },
    {
      title: 'This Week',
      value: stats.weeklyBookings,
      icon: 'TrendingUp',
      color: 'text-info',
      bgColor: 'bg-info/10'
    },
    {
      title: 'Meeting Types',
      value: stats.totalMeetingTypes,
      icon: 'Users',
      color: 'text-warning',
      bgColor: 'bg-warning/10'
    }
  ];

  const cardAnimation = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-20 bg-gray-200 rounded"></div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            {...cardAnimation}
            transition={{ delay: index * 0.1 }}
          >
            <Card hover className="cursor-default">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.bgColor}`}>
                  <ApperIcon name={stat.icon} className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Meetings */}
        <motion.div
          {...cardAnimation}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Today's Meetings</h3>
              <Badge variant="primary">{todayMeetings.length}</Badge>
            </div>
            
            {todayMeetings.length > 0 ? (
              <div className="space-y-3">
                {todayMeetings.map(meeting => (
                  <div key={meeting.Id} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                    <div className="flex-shrink-0">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: meeting.meetingType?.color || '#5B21B6' }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {meeting.attendeeName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {format(new Date(meeting.dateTime), 'h:mm a')} - {meeting.meetingType?.title}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <ApperIcon name="Calendar" className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500">No meetings scheduled for today</p>
              </div>
            )}
          </Card>
        </motion.div>

        {/* Upcoming Meetings */}
        <motion.div
          {...cardAnimation}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Upcoming Meetings</h3>
              <Badge variant="info">{upcomingMeetings.length}</Badge>
            </div>
            
            {upcomingMeetings.length > 0 ? (
              <div className="space-y-3">
                {upcomingMeetings.map(meeting => (
                  <div key={meeting.Id} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                    <div className="flex-shrink-0">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: meeting.meetingType?.color || '#5B21B6' }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {meeting.attendeeName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {isTomorrow(new Date(meeting.dateTime)) 
                          ? 'Tomorrow' 
                          : format(new Date(meeting.dateTime), 'MMM d')
                        } at {format(new Date(meeting.dateTime), 'h:mm a')}
                      </p>
                      <p className="text-xs text-gray-400">
                        {meeting.meetingType?.title}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <ApperIcon name="CalendarDays" className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500">No upcoming meetings</p>
              </div>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardStats;