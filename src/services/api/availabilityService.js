import availabilityData from '../mockData/availability.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let availability = [...availabilityData];

export const availabilityService = {
  async getAll() {
    await delay(200);
    return [...availability];
  },

  async getByDay(dayOfWeek) {
    await delay(150);
    const dayAvailability = availability.filter(avail => avail.dayOfWeek === dayOfWeek);
    return [...dayAvailability];
  },

  async update(newAvailability) {
    await delay(400);
    availability = [...newAvailability];
    return [...availability];
  },

  async generateTimeSlots(date, meetingTypeId, duration = 30) {
    await delay(300);
    
    const dayOfWeek = date.getDay();
    const dayAvailability = availability.filter(avail => avail.dayOfWeek === dayOfWeek);
    
    if (dayAvailability.length === 0) {
      return [];
    }
    
    const slots = [];
    
    for (const avail of dayAvailability) {
      const startTime = new Date(`${date.toDateString()} ${avail.startTime}`);
      const endTime = new Date(`${date.toDateString()} ${avail.endTime}`);
      
      let currentTime = new Date(startTime);
      
      while (currentTime < endTime) {
        const slotEndTime = new Date(currentTime.getTime() + duration * 60000);
        
        if (slotEndTime <= endTime) {
          slots.push({
            date: date.toISOString().split('T')[0],
            time: currentTime.toTimeString().substring(0, 5),
            dateTime: currentTime.toISOString(),
            available: true,
            duration: duration
          });
        }
        
        currentTime = new Date(currentTime.getTime() + duration * 60000);
      }
    }
    
    return slots;
  }
};