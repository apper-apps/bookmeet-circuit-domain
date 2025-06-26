import { useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import Input from '../atoms/Input';
import Button from '../atoms/Button';
import Card from '../atoms/Card';
import { bookingService } from '@/services/api/bookingService';

const BookingForm = ({ meetingType, selectedSlot, onBookingComplete }) => {
  const [formData, setFormData] = useState({
    attendeeName: '',
    attendeeEmail: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (field) => (e) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.attendeeName.trim()) {
      newErrors.attendeeName = 'Name is required';
    }
    
    if (!formData.attendeeEmail.trim()) {
      newErrors.attendeeEmail = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.attendeeEmail)) {
      newErrors.attendeeEmail = 'Please enter a valid email address';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    try {
      const booking = await bookingService.create({
        meetingTypeId: meetingType.Id,
        dateTime: selectedSlot.dateTime,
        attendeeName: formData.attendeeName.trim(),
        attendeeEmail: formData.attendeeEmail.trim(),
        message: formData.message.trim()
      });
      
      toast.success('Meeting booked successfully!');
      onBookingComplete(booking);
    } catch (error) {
      toast.error('Failed to book meeting. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const formAnimation = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 }
  };

  return (
    <motion.div {...formAnimation}>
      <Card>
        <div className="border-l-4 border-primary pl-4 mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            {meetingType.title}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {format(new Date(selectedSlot.dateTime), 'EEEE, MMMM d, yyyy')} at{' '}
            {format(new Date(selectedSlot.dateTime), 'h:mm a')}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Duration: {meetingType.duration} minutes
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            value={formData.attendeeName}
            onChange={handleChange('attendeeName')}
            error={errors.attendeeName}
            required
            disabled={submitting}
          />

          <Input
            label="Email Address"
            type="email"
            value={formData.attendeeEmail}
            onChange={handleChange('attendeeEmail')}
            error={errors.attendeeEmail}
            required
            disabled={submitting}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Message (Optional)
            </label>
            <textarea
              value={formData.message}
              onChange={handleChange('message')}
              disabled={submitting}
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
              placeholder="Please share anything that will help prepare for our meeting..."
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={submitting}
            className="w-full"
          >
            Confirm Booking
          </Button>
        </form>
      </Card>
    </motion.div>
  );
};

export default BookingForm;