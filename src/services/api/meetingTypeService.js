import meetingTypesData from '../mockData/meetingTypes.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let meetingTypes = [...meetingTypesData];

export const meetingTypeService = {
  async getAll() {
    await delay(300);
    return [...meetingTypes];
  },

  async getById(id) {
    await delay(200);
    const meetingType = meetingTypes.find(mt => mt.Id === parseInt(id, 10));
    if (!meetingType) {
      throw new Error('Meeting type not found');
    }
    return { ...meetingType };
  },

  async create(meetingType) {
    await delay(400);
    const newId = Math.max(...meetingTypes.map(mt => mt.Id), 0) + 1;
    const newMeetingType = {
      ...meetingType,
      Id: newId
    };
    meetingTypes.push(newMeetingType);
    return { ...newMeetingType };
  },

  async update(id, data) {
    await delay(400);
    const index = meetingTypes.findIndex(mt => mt.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Meeting type not found');
    }
    
    const updatedMeetingType = {
      ...meetingTypes[index],
      ...data,
      Id: meetingTypes[index].Id // Ensure ID doesn't change
    };
    
    meetingTypes[index] = updatedMeetingType;
    return { ...updatedMeetingType };
  },

  async delete(id) {
    await delay(300);
    const index = meetingTypes.findIndex(mt => mt.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Meeting type not found');
    }
    
    meetingTypes.splice(index, 1);
    return true;
  }
};