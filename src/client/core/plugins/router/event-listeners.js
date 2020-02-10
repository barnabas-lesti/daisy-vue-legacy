import eventService from '../../services/event-service';

export default (router) => {
  eventService.$on('core/userSignedIn', () => router.push({ name: 'home' }));
  eventService.$on('core/userSignedOut', () => router.push({ name: 'signIn' }));
};
