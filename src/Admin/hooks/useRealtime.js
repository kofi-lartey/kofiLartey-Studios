import { useCallback, useEffect, useState } from 'react';

const eventTemplates = [
  ['usr_001', 'Amara Osei', 'Viewed gallery', 'Wedding Highlights', 'info'],
  ['usr_002', 'Daniel Mensah', 'Uploaded images', 'Brand Session', 'success'],
  ['usr_004', 'Kwame Boateng', 'Download request', 'Portfolio Gallery', 'warning'],
  ['usr_005', 'Nia Darko', 'Shared album', 'Birthday Collection', 'info'],
  ['usr_003', 'Grace Agyeman', 'Failed login attempt', 'Account access', 'critical']
];

const useRealtime = (initialEvents = [], interval = 4500) => {
  const [events, setEvents] = useState(initialEvents);
  const [connected, setConnected] = useState(true);

  useEffect(() => {
    const timer = window.setInterval(() => {
      const template = eventTemplates[Math.floor(Math.random() * eventTemplates.length)];
      const nextEvent = {
        id: `live_${Date.now()}`,
        userId: template[0],
        actor: template[1],
        action: template[2],
        target: template[3],
        timestamp: 'Just now',
        severity: template[4]
      };

      setEvents((current) => [nextEvent, ...current].slice(0, 60));
    }, interval);

    return () => window.clearInterval(timer);
  }, [initialEvents, interval]);

  const addEvent = useCallback((event) => {
    setEvents((current) => [{ ...event, id: event.id || `live_${Date.now()}`, timestamp: event.timestamp || 'Just now' }, ...current].slice(0, 60));
  }, []);

  return { events, connected, setConnected, addEvent };
};

export default useRealtime;
