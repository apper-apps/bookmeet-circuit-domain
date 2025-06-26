import bookingsData from '../mockData/bookings.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let bookings = [...bookingsData];

export const bookingService = {
  async getAll() {
    await delay(300);
    return [...bookings];
  },

  async getById(id) {
    await delay(200);
    const booking = bookings.find(b => b.Id === parseInt(id, 10));
    if (!booking) {
      throw new Error('Booking not found');
    }
    return { ...booking };
  },

  async getByDateRange(startDate, endDate) {
    await delay(250);
    const filteredBookings = bookings.filter(booking => {
      const bookingDate = new Date(booking.dateTime);
      return bookingDate >= startDate && bookingDate <= endDate;
    });
    return [...filteredBookings];
  },

  async create(booking) {
    await delay(400);
    const newId = Math.max(...bookings.map(b => b.Id), 0) + 1;
    const newBooking = {
      ...booking,
      Id: newId,
      status: 'confirmed'
    };
    bookings.push(newBooking);
    return { ...newBooking };
  },

  async update(id, data) {
    await delay(400);
    const index = bookings.findIndex(b => b.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Booking not found');
    }
    
    const updatedBooking = {
      ...bookings[index],
      ...data,
      Id: bookings[index].Id // Ensure ID doesn't change
    };
    
    bookings[index] = updatedBooking;
    return { ...updatedBooking };
  },

  async delete(id) {
    await delay(300);
    const index = bookings.findIndex(b => b.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Booking not found');
    }
    
    bookings.splice(index, 1);
    return true;
  },

  async cancel(id) {
    await delay(300);
    return this.update(id, { status: 'cancelled' });
  }
};