import { motion } from 'framer-motion';
import { useState } from 'react';
import { toast } from 'react-toastify';
import ApperIcon from '../ApperIcon';
import Button from '../atoms/Button';
import Badge from '../atoms/Badge';
import Card from '../atoms/Card';
import { meetingTypeService } from '@/services/api/meetingTypeService';

const MeetingTypeCard = ({ meetingType, onEdit, onDelete, onShare }) => {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this meeting type?')) {
      return;
    }

    setDeleting(true);
    try {
      await meetingTypeService.delete(meetingType.Id);
      toast.success('Meeting type deleted successfully');
      onDelete(meetingType.Id);
    } catch (error) {
      toast.error('Failed to delete meeting type');
    } finally {
      setDeleting(false);
    }
  };

  const handleShare = () => {
    const bookingUrl = `${window.location.origin}/book/${meetingType.Id}`;
    navigator.clipboard.writeText(bookingUrl);
    toast.success('Booking link copied to clipboard');
    onShare?.(bookingUrl);
  };

  const cardHover = {
    whileHover: { y: -4, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }
  };

  return (
    <motion.div {...cardHover}>
      <Card className="relative">
        {/* Color indicator */}
        <div 
          className="absolute top-0 left-0 w-full h-1 rounded-t-xl"
          style={{ backgroundColor: meetingType.color }}
        />
        
        <div className="pt-2">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {meetingType.title}
              </h3>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <ApperIcon name="Clock" className="w-4 h-4" />
                {meetingType.duration} minutes
              </div>
            </div>
            
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShare}
                className="p-2"
              >
                <ApperIcon name="Share2" className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(meetingType)}
                className="p-2"
              >
                <ApperIcon name="Edit2" className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                loading={deleting}
                className="p-2 text-error hover:bg-error/10"
              >
                <ApperIcon name="Trash2" className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <p className="text-gray-600 mb-4 text-sm leading-relaxed">
            {meetingType.description}
          </p>
          
          <div className="flex items-center gap-2 mb-4">
            {meetingType.bufferBefore > 0 && (
              <Badge variant="default" size="sm">
                {meetingType.bufferBefore}m buffer before
              </Badge>
            )}
            {meetingType.bufferAfter > 0 && (
              <Badge variant="default" size="sm">
                {meetingType.bufferAfter}m buffer after
              </Badge>
            )}
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="primary"
              size="sm"
              onClick={handleShare}
              className="flex-1"
            >
              <ApperIcon name="Link" className="w-4 h-4 mr-2" />
              Copy Link
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(meetingType)}
            >
              <ApperIcon name="Settings" className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default MeetingTypeCard;