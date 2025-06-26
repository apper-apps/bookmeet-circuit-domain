import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../ApperIcon';
import Button from '../atoms/Button';
import Card from '../atoms/Card';
import Input from '../atoms/Input';
import SkeletonLoader from '../molecules/SkeletonLoader';
import { availabilityService } from '@/services/api/availabilityService';

const Settings = () => {
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadAvailability();
  }, []);

  const loadAvailability = async () => {
    setLoading(true);
    try {
      const data = await availabilityService.getAll();
      setAvailability(data);
    } catch (error) {
      console.error('Error loading availability:', error);
      toast.error('Failed to load availability settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAvailability = async () => {
    setSaving(true);
    try {
      await availabilityService.update(availability);
      toast.success('Availability settings saved successfully');
    } catch (error) {
      toast.error('Failed to save availability settings');
    } finally {
      setSaving(false);
    }
  };

  const addAvailabilitySlot = (dayOfWeek) => {
    const newSlot = {
      dayOfWeek,
      startTime: '09:00',
      endTime: '17:00',
      timezone: 'UTC-8'
    };
    setAvailability(prev => [...prev, newSlot]);
  };

  const removeAvailabilitySlot = (index) => {
    setAvailability(prev => prev.filter((_, i) => i !== index));
  };

  const updateAvailabilitySlot = (index, field, value) => {
    setAvailability(prev => prev.map((slot, i) => 
      i === index ? { ...slot, [field]: value } : slot
    ));
  };

  const weekDays = [
    { value: 0, label: 'Sunday' },
    { value: 1, label: 'Monday' },
    { value: 2, label: 'Tuesday' },
    { value: 3, label: 'Wednesday' },
    { value: 4, label: 'Thursday' },
    { value: 5, label: 'Friday' },
    { value: 6, label: 'Saturday' }
  ];

  const pageAnimation = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  };

  if (loading) {
    return (
      <motion.div {...pageAnimation} className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-heading font-bold text-gray-900">Settings</h1>
          </div>
          <SkeletonLoader count={3} />
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
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold text-gray-900">
            Settings
          </h1>
          <p className="text-gray-600 mt-1">
            Configure your availability and booking preferences.
          </p>
        </div>

        {/* Availability Settings */}
        <Card className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Availability
              </h2>
              <p className="text-gray-600 mt-1">
                Set your working hours for each day of the week.
              </p>
            </div>
            <Button
              variant="primary"
              onClick={handleSaveAvailability}
              loading={saving}
            >
              <ApperIcon name="Save" className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>

          <div className="space-y-6">
            {weekDays.map(day => {
              const daySlots = availability.filter(slot => slot.dayOfWeek === day.value);
              
              return (
                <div key={day.value} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      {day.label}
                    </h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addAvailabilitySlot(day.value)}
                    >
                      <ApperIcon name="Plus" className="w-4 h-4 mr-1" />
                      Add Hours
                    </Button>
                  </div>

                  {daySlots.length > 0 ? (
                    <div className="space-y-3">
                      {daySlots.map((slot, slotIndex) => {
                        const globalIndex = availability.findIndex(s => 
                          s.dayOfWeek === slot.dayOfWeek && 
                          s.startTime === slot.startTime && 
                          s.endTime === slot.endTime
                        );
                        
                        return (
                          <div key={slotIndex} className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <Input
                                type="time"
                                value={slot.startTime}
                                onChange={(e) => updateAvailabilitySlot(globalIndex, 'startTime', e.target.value)}
                                className="w-32"
                              />
                              <span className="text-gray-500">to</span>
                              <Input
                                type="time"
                                value={slot.endTime}
                                onChange={(e) => updateAvailabilitySlot(globalIndex, 'endTime', e.target.value)}
                                className="w-32"
                              />
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeAvailabilitySlot(globalIndex)}
                              className="text-error hover:bg-error/10"
                            >
                              <ApperIcon name="Trash2" className="w-4 h-4" />
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">
                      No availability set for {day.label}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </Card>

        {/* General Settings */}
        <Card>
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              General Settings
            </h2>
            <p className="text-gray-600 mt-1">
              Configure your booking and notification preferences.
            </p>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Timezone
                </label>
                <select className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
                  <option value="UTC-8">Pacific Time (UTC-8)</option>
                  <option value="UTC-7">Mountain Time (UTC-7)</option>
                  <option value="UTC-6">Central Time (UTC-6)</option>
                  <option value="UTC-5">Eastern Time (UTC-5)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Default Meeting Duration
                </label>
                <select className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="45">45 minutes</option>
                  <option value="60">60 minutes</option>
                </select>
              </div>
            </div>

            <div>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-primary focus:ring-primary/20"
                  defaultChecked
                />
                <span className="text-sm text-gray-700">
                  Send email notifications for new bookings
                </span>
              </label>
            </div>

            <div>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-primary focus:ring-primary/20"
                  defaultChecked
                />
                <span className="text-sm text-gray-700">
                  Send reminder emails 24 hours before meetings
                </span>
              </label>
            </div>

            <div>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-primary focus:ring-primary/20"
                />
                <span className="text-sm text-gray-700">
                  Allow booking cancellations up to 2 hours before
                </span>
              </label>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <Button
              variant="primary"
              className="w-full md:w-auto"
            >
              Save All Settings
            </Button>
          </div>
        </Card>
      </div>
    </motion.div>
  );
};

export default Settings;