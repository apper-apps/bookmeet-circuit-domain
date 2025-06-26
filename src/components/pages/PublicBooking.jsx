import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import ApperIcon from '../ApperIcon';
import Button from '../atoms/Button';
import Card from '../atoms/Card';
import TimeSlotPicker from '../molecules/TimeSlotPicker';
import BookingForm from '../organisms/BookingForm';
import LoadingSpinner from '../atoms/LoadingSpinner';
import ErrorState from '../molecules/ErrorState';
import { meetingTypeService } from '@/services/api/meetingTypeService';

const PublicBooking = () => {
  const { meetingTypeId } = useParams();
  const [meetingType, setMeetingType] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [step, setStep] = useState(1); // 1: time selection, 2: booking form, 3: confirmation
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    loadMeetingType();
  }, [meetingTypeId]);

  const loadMeetingType = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await meetingTypeService.getById(meetingTypeId);
      setMeetingType(data);
    } catch (err) {
      setError(err.message || 'Meeting type not found');
    } finally {
      setLoading(false);
    }
  };

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
    if (slot) {
      setSelectedDate(new Date(slot.date));
    }
  };

  const handleContinue = () => {
    if (selectedSlot) {
      setStep(2);
    }
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
    }
  };

  const handleBookingComplete = (newBooking) => {
    setBooking(newBooking);
    setStep(3);
  };

  const pageAnimation = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="xl" className="text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <ErrorState
          title="Meeting type not found"
          message={error}
          onRetry={loadMeetingType}
        />
      </div>
    );
  }

  return (
    <motion.div
      {...pageAnimation}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-gray-50"
    >
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
              <ApperIcon name="Calendar" className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-heading font-bold text-gray-900">
                BookMeet
              </h1>
              <p className="text-gray-600">
                Schedule your meeting
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {step === 1 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Meeting Type Info */}
            <Card>
              <div className="border-l-4 border-primary pl-4 mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {meetingType.title}
                </h2>
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-1">
                    <ApperIcon name="Clock" className="w-4 h-4" />
                    {meetingType.duration} minutes
                  </div>
                  {meetingType.bufferBefore > 0 && (
                    <div className="flex items-center gap-1">
                      <ApperIcon name="ArrowLeft" className="w-4 h-4" />
                      {meetingType.bufferBefore}m buffer
                    </div>
                  )}
                  {meetingType.bufferAfter > 0 && (
                    <div className="flex items-center gap-1">
                      <ApperIcon name="ArrowRight" className="w-4 h-4" />
                      {meetingType.bufferAfter}m buffer
                    </div>
                  )}
                </div>
                <p className="text-gray-700 leading-relaxed">
                  {meetingType.description}
                </p>
              </div>

              {selectedSlot && (
                <div className="bg-primary/5 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">Selected Time</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <ApperIcon name="Calendar" className="w-4 h-4" />
                    {format(new Date(selectedSlot.dateTime), 'EEEE, MMMM d, yyyy')}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700 mt-1">
                    <ApperIcon name="Clock" className="w-4 h-4" />
                    {format(new Date(selectedSlot.dateTime), 'h:mm a')}
                  </div>
                </div>
              )}
            </Card>

            {/* Time Selection */}
            <div>
              <TimeSlotPicker
                meetingType={meetingType}
                selectedDate={selectedDate}
                selectedSlot={selectedSlot}
                onSlotSelect={handleSlotSelect}
              />

              {selectedSlot && (
                <div className="mt-6">
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={handleContinue}
                    className="w-full"
                  >
                    Continue to Details
                    <ApperIcon name="ArrowRight" className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="max-w-2xl mx-auto">
            <div className="mb-6">
              <Button
                variant="ghost"
                onClick={handleBack}
                className="mb-4"
              >
                <ApperIcon name="ArrowLeft" className="w-4 h-4 mr-2" />
                Back to Time Selection
              </Button>
            </div>

            <BookingForm
              meetingType={meetingType}
              selectedSlot={selectedSlot}
              onBookingComplete={handleBookingComplete}
            />
          </div>
        )}

        {step === 3 && booking && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto text-center"
          >
            <Card className="text-center">
              <div className="mb-6">
                <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ApperIcon name="CheckCircle" className="w-8 h-8 text-success" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Meeting Confirmed!
                </h2>
                <p className="text-gray-600">
                  Your meeting has been successfully scheduled.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h3 className="font-semibold text-gray-900 mb-4">Meeting Details</h3>
                <div className="space-y-3 text-left">
                  <div className="flex items-center gap-3">
                    <ApperIcon name="User" className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-700">{booking.attendeeName}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <ApperIcon name="Mail" className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-700">{booking.attendeeEmail}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <ApperIcon name="Calendar" className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-700">
                      {format(new Date(booking.dateTime), 'EEEE, MMMM d, yyyy')}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <ApperIcon name="Clock" className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-700">
                      {format(new Date(booking.dateTime), 'h:mm a')} ({meetingType.duration} minutes)
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <ApperIcon name="Users" className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-700">{meetingType.title}</span>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-600 mb-4">
                  A confirmation email has been sent to {booking.attendeeEmail}
                </p>
                <Button
                  variant="primary"
                  onClick={() => {
                    const calendarEvent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//BookMeet//BookMeet//EN
BEGIN:VEVENT
UID:${booking.Id}@bookmeet.io
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTSTART:${new Date(booking.dateTime).toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTEND:${new Date(new Date(booking.dateTime).getTime() + meetingType.duration * 60000).toISOString().replace(/[-:]/g, '').split('.')[0]}Z
SUMMARY:${meetingType.title} with ${booking.attendeeName}
DESCRIPTION:${meetingType.description}
END:VEVENT
END:VCALENDAR`;
                    
                    const blob = new Blob([calendarEvent], { type: 'text/calendar' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'meeting.ics';
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                >
                  <ApperIcon name="Download" className="w-4 h-4 mr-2" />
                  Add to Calendar
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default PublicBooking;