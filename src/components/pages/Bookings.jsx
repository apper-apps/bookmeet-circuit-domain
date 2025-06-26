import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import ApperIcon from '../ApperIcon';
import Button from '../atoms/Button';
import Badge from '../atoms/Badge';
import Card from '../atoms/Card';
import SkeletonLoader from '../molecules/SkeletonLoader';
import ErrorState from '../molecules/ErrorState';
import EmptyState from '../molecules/EmptyState';
import { bookingService } from '@/services/api/bookingService';
import { meetingTypeService } from '@/services/api/meetingTypeService';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [meetingTypes, setMeetingTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [actionLoading, setActionLoading] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [bookingsData, meetingTypesData] = await Promise.all([
        bookingService.getAll(),
        meetingTypeService.getAll()
      ]);
      setBookings(bookingsData);
      setMeetingTypes(meetingTypesData);
    } catch (err) {
      setError(err.message || 'Failed to load bookings');
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    setActionLoading(prev => ({ ...prev, [bookingId]: true }));
    try {
      await bookingService.cancel(bookingId);
      setBookings(prev => 
        prev.map(booking => 
          booking.Id === bookingId 
            ? { ...booking, status: 'cancelled' }
            : booking
        )
      );
      toast.success('Booking cancelled successfully');
    } catch (error) {
      toast.error('Failed to cancel booking');
    } finally {
      setActionLoading(prev => ({ ...prev, [bookingId]: false }));
    }
  };

  const getMeetingType = (meetingTypeId) => {
    return meetingTypes.find(mt => mt.Id === meetingTypeId);
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'confirmed': return 'success';
      case 'pending': return 'warning';
      case 'cancelled': return 'error';
      case 'completed': return 'info';
      default: return 'default';
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true;
    return booking.status === filter;
  }).sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime));

  const filterOptions = [
    { value: 'all', label: 'All Bookings' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'pending', label: 'Pending' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'completed', label: 'Completed' }
  ];

  const pageAnimation = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  };

  const staggerAnimation = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 }
  };

  if (loading) {
    return (
      <motion.div {...pageAnimation} className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-heading font-bold text-gray-900">Bookings</h1>
          </div>
          <SkeletonLoader count={5} type="list" />
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div {...pageAnimation} className="p-6">
        <div className="max-w-7xl mx-auto">
          <ErrorState
            message={error}
            onRetry={loadData}
          />
        </div>
      </motion.div>
    );
  }

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
                Bookings
              </h1>
              <p className="text-gray-600 mt-1">
                Manage all your scheduled meetings and bookings.
              </p>
            </div>
            
            <Button
              variant="primary"
              onClick={() => window.location.href = '/meeting-types'}
            >
              <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
              Create Meeting Type
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {filterOptions.map(option => (
              <Button
                key={option.value}
                variant={filter === option.value ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setFilter(option.value)}
                className="whitespace-nowrap"
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Bookings List */}
        {filteredBookings.length > 0 ? (
          <div className="space-y-4">
            {filteredBookings.map((booking, index) => {
              const meetingType = getMeetingType(booking.meetingTypeId);
              
              return (
                <motion.div
                  key={booking.Id}
                  {...staggerAnimation}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="overflow-hidden">
                    <div className="flex items-start gap-4">
                      {/* Color indicator */}
                      <div 
                        className="w-1 h-16 rounded-full flex-shrink-0"
                        style={{ backgroundColor: meetingType?.color || '#5B21B6' }}
                      />
                      
                      {/* Booking Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900 truncate">
                                {booking.attendeeName}
                              </h3>
                              <Badge variant={getStatusVariant(booking.status)}>
                                {booking.status}
                              </Badge>
                            </div>
                            
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <ApperIcon name="Calendar" className="w-4 h-4" />
                                {format(new Date(booking.dateTime), 'EEEE, MMMM d, yyyy')}
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <ApperIcon name="Clock" className="w-4 h-4" />
                                {format(new Date(booking.dateTime), 'h:mm a')} 
                                ({meetingType?.duration || 30} minutes)
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <ApperIcon name="Users" className="w-4 h-4" />
                                {meetingType?.title || 'Unknown Meeting Type'}
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <ApperIcon name="Mail" className="w-4 h-4" />
                                {booking.attendeeEmail}
                              </div>
                            </div>

                            {booking.message && (
                              <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-700">
                                  <span className="font-medium">Message:</span> {booking.message}
                                </p>
                              </div>
                            )}
                          </div>
                          
                          {/* Actions */}
                          <div className="flex items-center gap-2 ml-4">
                            {booking.status === 'confirmed' && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleCancelBooking(booking.Id)}
                                loading={actionLoading[booking.Id]}
                                className="text-error border-error hover:bg-error/10"
                              >
                                <ApperIcon name="X" className="w-4 h-4 mr-1" />
                                Cancel
                              </Button>
                            )}
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const mailto = `mailto:${booking.attendeeEmail}?subject=Re: ${meetingType?.title || 'Meeting'} on ${format(new Date(booking.dateTime), 'MMM d')}`;
                                window.open(mailto);
                              }}
                            >
                              <ApperIcon name="Mail" className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <EmptyState
            title={filter === 'all' ? 'No bookings yet' : `No ${filter} bookings`}
            description={
              filter === 'all' 
                ? 'When people book meetings with you, they will appear here.'
                : `No bookings with ${filter} status found.`
            }
            actionLabel={filter === 'all' ? 'Create Meeting Type' : 'View All Bookings'}
            onAction={() => {
              if (filter === 'all') {
                window.location.href = '/meeting-types';
              } else {
                setFilter('all');
              }
            }}
            icon="Calendar"
          />
        )}
      </div>
    </motion.div>
  );
};

export default Bookings;