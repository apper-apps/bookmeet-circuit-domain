import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import MeetingTypeCard from '../organisms/MeetingTypeCard';
import Button from '../atoms/Button';
import Input from '../atoms/Input';
import Card from '../atoms/Card';
import ApperIcon from '../ApperIcon';
import SkeletonLoader from '../molecules/SkeletonLoader';
import ErrorState from '../molecules/ErrorState';
import EmptyState from '../molecules/EmptyState';
import { meetingTypeService } from '@/services/api/meetingTypeService';

const MeetingTypes = () => {
  const [meetingTypes, setMeetingTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingMeetingType, setEditingMeetingType] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    duration: 30,
    description: '',
    bufferBefore: 0,
    bufferAfter: 0,
    color: '#5B21B6'
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadMeetingTypes();
  }, []);

  const loadMeetingTypes = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await meetingTypeService.getAll();
      setMeetingTypes(data);
    } catch (err) {
      setError(err.message || 'Failed to load meeting types');
      toast.error('Failed to load meeting types');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setFormData({
      title: '',
      duration: 30,
      description: '',
      bufferBefore: 0,
      bufferAfter: 0,
      color: '#5B21B6'
    });
    setFormErrors({});
    setEditingMeetingType(null);
    setShowCreateForm(true);
  };

  const handleEdit = (meetingType) => {
    setFormData({
      title: meetingType.title,
      duration: meetingType.duration,
      description: meetingType.description,
      bufferBefore: meetingType.bufferBefore,
      bufferAfter: meetingType.bufferAfter,
      color: meetingType.color
    });
    setFormErrors({});
    setEditingMeetingType(meetingType);
    setShowCreateForm(true);
  };

  const handleDelete = (meetingTypeId) => {
    setMeetingTypes(prev => prev.filter(mt => mt.Id !== meetingTypeId));
  };

  const handleFormChange = (field) => (e) => {
    const value = field === 'duration' || field === 'bufferBefore' || field === 'bufferAfter' 
      ? parseInt(e.target.value, 10) || 0 
      : e.target.value;
    
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Meeting type title is required';
    }
    
    if (formData.duration < 5) {
      newErrors.duration = 'Duration must be at least 5 minutes';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    try {
      if (editingMeetingType) {
        const updated = await meetingTypeService.update(editingMeetingType.Id, formData);
        setMeetingTypes(prev => prev.map(mt => mt.Id === editingMeetingType.Id ? updated : mt));
        toast.success('Meeting type updated successfully');
      } else {
        const created = await meetingTypeService.create(formData);
        setMeetingTypes(prev => [...prev, created]);
        toast.success('Meeting type created successfully');
      }
      setShowCreateForm(false);
    } catch (error) {
      toast.error('Failed to save meeting type');
    } finally {
      setSubmitting(false);
    }
  };

  const colorOptions = [
    '#5B21B6', '#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16'
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
            <h1 className="text-3xl font-heading font-bold text-gray-900">Meeting Types</h1>
          </div>
          <SkeletonLoader count={3} />
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
            onRetry={loadMeetingTypes}
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
                Meeting Types
              </h1>
              <p className="text-gray-600 mt-1">
                Create and manage different types of meetings you offer.
              </p>
            </div>
            
            <Button
              variant="primary"
              onClick={handleCreate}
            >
              <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
              Create Meeting Type
            </Button>
          </div>
        </div>

        {/* Create/Edit Form */}
        {showCreateForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-8"
          >
            <Card>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {editingMeetingType ? 'Edit Meeting Type' : 'Create New Meeting Type'}
                  </h2>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setShowCreateForm(false)}
                  >
                    <ApperIcon name="X" className="w-4 h-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Meeting Title"
                    value={formData.title}
                    onChange={handleFormChange('title')}
                    error={formErrors.title}
                    placeholder="e.g., Strategy Session"
                    required
                  />

                  <Input
                    label="Duration (minutes)"
                    type="number"
                    value={formData.duration}
                    onChange={handleFormChange('duration')}
                    error={formErrors.duration}
                    min="5"
                    max="480"
                    required
                  />

                  <Input
                    label="Buffer Before (minutes)"
                    type="number"
                    value={formData.bufferBefore}
                    onChange={handleFormChange('bufferBefore')}
                    min="0"
                    max="60"
                  />

                  <Input
                    label="Buffer After (minutes)"
                    type="number"
                    value={formData.bufferAfter}
                    onChange={handleFormChange('bufferAfter')}
                    min="0"
                    max="60"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={handleFormChange('description')}
                    rows={3}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                    placeholder="Describe what this meeting is about..."
                  />
                  {formErrors.description && (
                    <p className="mt-1 text-sm text-error">{formErrors.description}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Color
                  </label>
                  <div className="flex items-center gap-3">
                    {colorOptions.map(color => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, color }))}
                        className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                          formData.color === color
                            ? 'border-gray-900 scale-110'
                            : 'border-gray-300 hover:scale-105'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowCreateForm(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    loading={submitting}
                  >
                    {editingMeetingType ? 'Update' : 'Create'} Meeting Type
                  </Button>
                </div>
              </form>
            </Card>
          </motion.div>
        )}

        {/* Meeting Types Grid */}
        {meetingTypes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {meetingTypes.map((meetingType, index) => (
              <motion.div
                key={meetingType.Id}
                {...staggerAnimation}
                transition={{ delay: index * 0.1 }}
              >
                <MeetingTypeCard
                  meetingType={meetingType}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              </motion.div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No meeting types yet"
            description="Create your first meeting type to start accepting bookings from clients and colleagues."
            actionLabel="Create Meeting Type"
            onAction={handleCreate}
            icon="Users"
          />
        )}
      </div>
    </motion.div>
  );
};

export default MeetingTypes;