import { useState } from 'react';
import { FiHeadphones, FiMessageCircle, FiPlus } from 'react-icons/fi';
import AdminLayout from '../components/AdminLayout';
import Badge from '../components/Badge';
import Toast from '../components/Toast';
import useAdmin from '../hooks/useAdmin';
import { formatDate } from '../utils/formatters';

const statusTone = { open: 'red', reviewing: 'amber', resolved: 'green' };
const priorityTone = { low: 'gray', medium: 'amber', high: 'red' };

const FeedbackSupport = () => {
  const admin = useAdmin();
  const [ticketForm, setTicketForm] = useState({ title: '', priority: 'medium', assignee: 'Admin' });
  const [faqForm, setFaqForm] = useState({ question: '', answer: '' });

  const createTicket = () => {
    if (!ticketForm.title) return;
    admin.updateData('tickets', (tickets) => [{ id: `ticket_${Date.now()}`, ...ticketForm, status: 'open', createdAt: new Date().toISOString() }, ...tickets]);
    setTicketForm({ title: '', priority: 'medium', assignee: 'Admin' });
    admin.showToast('Support ticket created.');
  };

  const createFaq = () => {
    if (!faqForm.question || !faqForm.answer) return;
    admin.updateData('faqs', (faqs) => [{ id: `faq_${Date.now()}`, ...faqForm }, ...faqs]);
    setFaqForm({ question: '', answer: '' });
    admin.showToast('FAQ created.');
  };

  return (
    <AdminLayout title="Feedback & Support">
      <section className="rounded-2xl border border-white/5 bg-white/[0.03] p-6 md:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Feedback & Support</h1>
            <p className="mt-2 text-sm text-gray-400">Manage tickets, live chat placeholder, and FAQ content.</p>
          </div>
          <Badge tone="blue">{admin.data.tickets.length} tickets</Badge>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
        <div className="space-y-6">
          <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-5">
            <div className="flex items-center gap-2 text-white"><FiHeadphones /> <h2 className="text-lg font-bold">Create ticket</h2></div>
            <div className="mt-5 space-y-4">
              <input value={ticketForm.title} onChange={(event) => setTicketForm((current) => ({ ...current, title: event.target.value }))} placeholder="Ticket title" className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-white placeholder:text-gray-500 focus:border-blue-500/60 focus:outline-none" />
              <select value={ticketForm.priority} onChange={(event) => setTicketForm((current) => ({ ...current, priority: event.target.value }))} className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-white focus:border-blue-500/60 focus:outline-none"><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select>
              <input value={ticketForm.assignee} onChange={(event) => setTicketForm((current) => ({ ...current, assignee: event.target.value }))} placeholder="Assignee" className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-white focus:border-blue-500/60 focus:outline-none" />
              <button onClick={createTicket} className="w-full rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-500"><FiPlus className="inline mr-2" size={16} />Create ticket</button>
            </div>
          </div>

          <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-5">
            <h2 className="text-lg font-bold text-white">Support tickets</h2>
            <div className="mt-4 space-y-3">
              {admin.data.tickets.map((ticket) => (
                <div key={ticket.id} className="rounded-xl border border-white/5 bg-white/[0.04] p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-semibold text-white">{ticket.title}</p>
                    <div className="flex gap-2"><Badge tone={statusTone[ticket.status] || 'gray'}>{ticket.status}</Badge><Badge tone={priorityTone[ticket.priority] || 'gray'}>{ticket.priority}</Badge></div>
                  </div>
                  <p className="mt-2 text-xs text-gray-500">Assignee: {ticket.assignee} · {formatDate(ticket.createdAt)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-5">
            <div className="flex items-center gap-2 text-white"><FiMessageCircle /> <h2 className="text-lg font-bold">Live chat placeholder</h2></div>
            <div className="mt-4 rounded-2xl border border-dashed border-white/10 bg-white/[0.03] p-6 text-center">
              <p className="font-semibold text-white">Connect a chat provider to enable live support.</p>
              <p className="mt-1 text-sm text-gray-500">This mock UI reserves space for real-time messaging.</p>
            </div>
          </div>

          <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-5">
            <h2 className="text-lg font-bold text-white">FAQ list</h2>
            <div className="mt-4 space-y-3">
              <input value={faqForm.question} onChange={(event) => setFaqForm((current) => ({ ...current, question: event.target.value }))} placeholder="FAQ question" className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-white placeholder:text-gray-500 focus:border-blue-500/60 focus:outline-none" />
              <textarea value={faqForm.answer} onChange={(event) => setFaqForm((current) => ({ ...current, answer: event.target.value }))} rows={4} placeholder="FAQ answer" className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-white placeholder:text-gray-500 focus:border-blue-500/60 focus:outline-none" />
              <button onClick={createFaq} className="w-full rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-500"><FiPlus className="inline mr-2" size={16} />Add FAQ</button>
            </div>
            <div className="mt-5 space-y-3">
              {admin.data.faqs.map((faq) => (
                <div key={faq.id} className="rounded-xl border border-white/5 bg-white/[0.04] p-3">
                  <p className="font-semibold text-white">{faq.question}</p>
                  <p className="mt-1 text-sm text-gray-500">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {admin.toast && <Toast message={admin.toast.message} tone={admin.toast.tone} onClose={admin.clearToast} />}
    </AdminLayout>
  );
};

export default FeedbackSupport;
