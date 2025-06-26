import Dashboard from '@/components/pages/Dashboard';
import Calendar from '@/components/pages/Calendar';
import MeetingTypes from '@/components/pages/MeetingTypes';
import Bookings from '@/components/pages/Bookings';
import Settings from '@/components/pages/Settings';
import PublicBooking from '@/components/pages/PublicBooking';

export const routes = {
  dashboard: {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/',
    icon: 'LayoutDashboard',
    component: Dashboard
  },
  calendar: {
    id: 'calendar',
    label: 'Calendar',
    path: '/calendar',
    icon: 'Calendar',
    component: Calendar
  },
  meetingTypes: {
    id: 'meetingTypes',
    label: 'Meeting Types',
    path: '/meeting-types',
    icon: 'Users',
    component: MeetingTypes
  },
  bookings: {
    id: 'bookings',
    label: 'Bookings',
    path: '/bookings',
    icon: 'Clock',
    component: Bookings
  },
  settings: {
    id: 'settings',
    label: 'Settings',
    path: '/settings',
    icon: 'Settings',
    component: Settings
  },
  publicBooking: {
    id: 'publicBooking',
    label: 'Book Meeting',
    path: '/book/:meetingTypeId',
    icon: 'Calendar',
    component: PublicBooking,
    isPublic: true
  }
};

export const routeArray = Object.values(routes);
export default routes;