import { useState } from 'react';
import { FiDownload, FiFileText, FiPlus, FiSend } from 'react-icons/fi';
import AdminLayout from '../components/AdminLayout';
import Badge from '../components/Badge';
import Modal from '../components/Modal';
import Toast from '../components/Toast';
import useAdmin from '../hooks/useAdmin';
import { formatCurrency } from '../utils/formatters';

const PaymentGeneration = () => {
  const admin = useAdmin();
  const [form, setForm] = useState({
    userId: admin.data.users[0]?.id || '',
    amount: 150,
    currency: 'USD',
    description: 'Photography service invoice',
    method: 'Card',
    invoiceNumber: `INV-2026-${String(admin.data.payments.length + 1).padStart(3, '0')}`,
    dueDate: '2026-07-01',
    notes: ''
  });
  const [batchCount, setBatchCount] = useState(3);
  const [receiptOpen, setReceiptOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);

  const tax = Number(form.amount) * 0.05;
  const discount = Number(form.amount) * 0.03;
  const total = Number(form.amount) + tax - discount;
  const selectedUser = admin.data.users.find((user) => user.id === form.userId) || admin.data.users[0];

  const createPayment = () => {
    const payment = {
      id: `pay_${Date.now()}`,
      user: selectedUser?.name || 'Unknown user',
      email: selectedUser?.email || '',
      amount: Number(form.amount),
      currency: form.currency,
      method: form.method,
      status: 'pending',
      description: form.description,
      invoiceNumber: form.invoiceNumber,
      dueDate: form.dueDate,
      createdAt: new Date().toISOString()
    };
    admin.updateData('payments', (payments) => [payment, ...payments]);
    admin.addActivityLog({ userId: selectedUser?.id, actor: 'Admin', action: 'Generated invoice', target: payment.invoiceNumber, severity: 'info' });
    setSelectedPayment(payment);
    setReceiptOpen(true);
    admin.showToast('Invoice generated.');
  };

  const generateBatch = () => {
    const count = Math.max(1, Number(batchCount));
    const payments = Array.from({ length: count }).map((_, index) => ({
      id: `pay_batch_${Date.now()}_${index}`,
      user: selectedUser?.name || 'Batch client',
      email: selectedUser?.email || '',
      amount: Number(form.amount),
      currency: form.currency,
      method: form.method,
      status: 'pending',
      description: `${form.description} - batch ${index + 1}`,
      invoiceNumber: `INV-2026-B${String(index + 1).padStart(3, '0')}`,
      dueDate: form.dueDate,
      createdAt: new Date().toISOString()
    }));
    admin.updateData('payments', (current) => [...payments, ...current]);
    admin.showToast(`${count} invoices generated.`);
  };

  const markPaid = (id) => {
    admin.updateData('payments', (payments) => payments.map((payment) => payment.id === id ? { ...payment, status: 'paid' } : payment));
    admin.showToast('Invoice marked as paid.', 'success');
  };

  return (
    <AdminLayout title="Payment Generation">
      <section className="rounded-2xl border border-white/5 bg-white/[0.03] p-6 md:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Payment Generation</h1>
            <p className="mt-2 text-sm text-gray-400">Create invoices, batch payments, reminders, and receipt previews.</p>
          </div>
          <button onClick={createPayment} className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-500"><FiPlus className="inline mr-2" size={16} />Generate invoice</button>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-5">
            <h2 className="text-lg font-bold text-white">Invoice form</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <label className="space-y-2 text-sm font-semibold text-white">User<select value={form.userId} onChange={(event) => setForm((current) => ({ ...current, userId: event.target.value }))} className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-white focus:border-blue-500/60 focus:outline-none">{admin.data.users.map((user) => <option key={user.id} value={user.id} className="bg-gray-900">{user.name}</option>)}</select></label>
              <label className="space-y-2 text-sm font-semibold text-white">Amount<input value={form.amount} onChange={(event) => setForm((current) => ({ ...current, amount: event.target.value }))} type="number" className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-white focus:border-blue-500/60 focus:outline-none" /></label>
              <label className="space-y-2 text-sm font-semibold text-white">Currency<select value={form.currency} onChange={(event) => setForm((current) => ({ ...current, currency: event.target.value }))} className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-white focus:border-blue-500/60 focus:outline-none"><option value="USD">USD</option><option value="GHS">GHS</option><option value="EUR">EUR</option><option value="GBP">GBP</option></select></label>
              <label className="space-y-2 text-sm font-semibold text-white">Payment method<select value={form.method} onChange={(event) => setForm((current) => ({ ...current, method: event.target.value }))} className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-white focus:border-blue-500/60 focus:outline-none"><option value="Card">Card</option><option value="PayPal">PayPal</option><option value="Bank transfer">Bank transfer</option></select></label>
              <label className="space-y-2 text-sm font-semibold text-white">Invoice number<input value={form.invoiceNumber} onChange={(event) => setForm((current) => ({ ...current, invoiceNumber: event.target.value }))} className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-white focus:border-blue-500/60 focus:outline-none" /></label>
              <label className="space-y-2 text-sm font-semibold text-white">Due date<input value={form.dueDate} onChange={(event) => setForm((current) => ({ ...current, dueDate: event.target.value }))} type="date" className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-white focus:border-blue-500/60 focus:outline-none" /></label>
              <label className="col-span-full space-y-2 text-sm font-semibold text-white">Description<textarea value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} rows={3} className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-white focus:border-blue-500/60 focus:outline-none" /></label>
              <label className="col-span-full space-y-2 text-sm font-semibold text-white">Notes<textarea value={form.notes} onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))} rows={3} className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-white focus:border-blue-500/60 focus:outline-none" /></label>
            </div>
          </div>

          <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-5">
            <h2 className="text-lg font-bold text-white">Batch generation</h2>
            <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-end">
              <label className="flex-1 space-y-2 text-sm font-semibold text-white">Count<input value={batchCount} onChange={(event) => setBatchCount(event.target.value)} type="number" min="1" className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-white focus:border-blue-500/60 focus:outline-none" /></label>
              <button onClick={generateBatch} className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-500"><FiPlus className="inline mr-2" size={16} />Generate batch</button>
              <button onClick={() => admin.showToast('Payment reminders queued.', 'success')} className="rounded-xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-semibold text-white hover:bg-white/[0.06]"><FiSend className="inline mr-2" size={16} />Send reminders</button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">Invoice preview</h2>
              <Badge tone="blue">{form.invoiceNumber}</Badge>
            </div>
            <div className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between text-gray-300"><span>Bill to</span><span className="text-white">{selectedUser?.name}</span></div>
              <div className="flex justify-between text-gray-300"><span>Line item</span><span className="text-white">{form.description}</span></div>
              <div className="flex justify-between text-gray-300"><span>Subtotal</span><span className="text-white">{formatCurrency(form.amount, form.currency)}</span></div>
              <div className="flex justify-between text-gray-300"><span>Tax 5%</span><span className="text-white">{formatCurrency(tax, form.currency)}</span></div>
              <div className="flex justify-between text-gray-300"><span>Discount 3%</span><span className="text-red-300">-{formatCurrency(discount, form.currency)}</span></div>
              <div className="flex justify-between border-t border-white/10 pt-3 text-base font-bold text-white"><span>Total</span><span>{formatCurrency(total, form.currency)}</span></div>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <button onClick={() => { setSelectedPayment({ ...form, id: 'preview', user: selectedUser?.name, email: selectedUser?.email, status: 'preview' }); setReceiptOpen(true); }} className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-500"><FiFileText className="inline mr-2" size={16} />Receipt</button>
              <button onClick={markPaid} className="rounded-xl bg-emerald-500/10 px-4 py-2.5 text-sm font-semibold text-emerald-300 hover:bg-emerald-500/20">Mark paid</button>
              <button className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/[0.06]"><FiDownload className="inline mr-2" size={16} />Mock PDF</button>
            </div>
          </div>

          <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-5">
            <h2 className="text-lg font-bold text-white">Recent generated invoices</h2>
            <div className="mt-4 space-y-3">
              {admin.data.payments.slice(0, 5).map((payment) => (
                <div key={payment.id} className="flex items-center justify-between gap-3 rounded-xl border border-white/5 bg-white/[0.04] p-3">
                  <div>
                    <p className="text-sm font-semibold text-white">{payment.invoiceNumber}</p>
                    <p className="text-xs text-gray-500">{payment.user}</p>
                  </div>
                  <Badge tone={payment.status === 'paid' ? 'green' : payment.status === 'pending' ? 'amber' : 'red'}>{payment.status}</Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={receiptOpen} title="Receipt preview" onClose={() => setReceiptOpen(false)} size="md" footer={
        <button onClick={() => setReceiptOpen(false)} className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-500"><FiDownload className="inline mr-2" size={16} />Download mock PDF</button>
      }>
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-sm text-gray-300">
          <p className="text-lg font-bold text-white">Receipt</p>
          <p className="mt-2">{selectedPayment?.invoiceNumber || form.invoiceNumber}</p>
          <p>{selectedPayment?.user || selectedUser?.name}</p>
          <p className="mt-4 font-semibold text-white">Total: {formatCurrency(selectedPayment?.amount || total, selectedPayment?.currency || form.currency)}</p>
        </div>
      </Modal>
      {admin.toast && <Toast message={admin.toast.message} tone={admin.toast.tone} onClose={admin.clearToast} />}
    </AdminLayout>
  );
};

export default PaymentGeneration;
