import { formatDate } from '../utils/formatters';

const CalendarWidget = ({ events = [] }) => (
  <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-5">
    <h3 className="text-base font-bold text-white">Calendar</h3>
    <div className="mt-4 space-y-3">
      {events.length ? events.map((event) => (
        <div key={event.id} className="rounded-xl border border-white/5 bg-white/[0.04] p-3">
          <p className="text-sm font-semibold text-white">{event.title}</p>
          <p className="mt-1 text-xs text-gray-500">{formatDate(event.date)} · {event.label}</p>
        </div>
      )) : <p className="text-sm text-gray-500">No data available</p>}
    </div>
  </div>
);

export default CalendarWidget;
