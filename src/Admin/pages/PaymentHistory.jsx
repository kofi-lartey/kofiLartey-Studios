import { useMemo, useState } from 'react';
import { FiDownload } from 'react-icons/fi';
import AdminLayout from '../components/AdminLayout';
import Badge from '../components/Badge';
import DataTable from '../components/DataTable';
import ExportPanel from '../components/ExportPanel';
import FilterDropdown from '../components/FilterDropdown';
import SearchBar from '../components/SearchBar';
import Toast from '../components/Toast';
import useAdmin from '../hooks/useAdmin';
import useExport from '../hooks/useExport';
import { formatCurrency, formatDate } from '../utils/formatters';

const statusTone = { paid: 'green', pending: 'amber', failed: 'red' };

const PaymentHistory = () => {
  const admin = useAdmin();
  const { exportCSV, exportJSON } = useExport('payment-history');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');

  const filteredPayments = useMemo(() => {
    return admin.data.payments.filter((payment) => {
      const matchesSearch = [payment.user, payment.email, payment.description, payment.invoiceNumber].join(' ').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
      const matchesMethod = methodFilter === 'all' || payment.method === methodFilter;
      return matchesSearch && matchesStatus && matchesMethod;
    });
  }, [admin.data.payments, searchTerm, statusFilter, methodFilter]);

  const columns = [
    { key: 'invoice', header: 'Invoice', render: (payment) => <span className="font-semibold text-white">{payment.invoiceNumber}</span> },
    { key: 'user', header: 'User', render: (payment) => <span className="text-sm text-gray-300">{payment.user}</span> },
    { key: 'amount', header: 'Amount', render: (payment) => <span className="text-sm text-white">{formatCurrency(payment.amount, payment.currency)}</span> },
    { key: 'method', header: 'Method', render: (payment) => <span className="text-sm text-gray-300">{payment.method}</span> },
    { key: 'status', header: 'Status', render: (payment) => <Badge tone={statusTone[payment.status] || 'gray'}>{payment.status}</Badge> },
    { key: 'due', header: 'Due date', render: (payment) => <span className="text-sm text-gray-500">{formatDate(payment.dueDate)}</span> }
  ];

  return (
    <AdminLayout title="Payment History">
      <section className="rounded-2xl border border-white/5 bg-white/[0.03] p-6 md:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Payment History</h1>
            <p className="mt-2 text-sm text-gray-400">Search, filter, and export every invoice transaction.</p>
          </div>
          <ExportPanel onCSV={() => exportCSV(filteredPayments)} onJSON={() => exportJSON({ payments: filteredPayments })} />
        </div>
        <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_auto_auto]">
          <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Search user, invoice, or description..." />
          <FilterDropdown label="Status" value={statusFilter} onChange={setStatusFilter} options={[{ value: 'all', label: 'All statuses' }, { value: 'paid', label: 'Paid' }, { value: 'pending', label: 'Pending' }, { value: 'failed', label: 'Failed' }]} />
          <FilterDropdown label="Method" value={methodFilter} onChange={setMethodFilter} options={[{ value: 'all', label: 'All methods' }, ...Array.from(new Set(admin.data.payments.map((payment) => payment.method))).map((method) => ({ value: method, label: method }))]} />
        </div>
      </section>

      <DataTable columns={columns} rows={filteredPayments} emptyText="No transactions found" />
      <button onClick={() => exportCSV(filteredPayments)} className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/[0.06]"><FiDownload className="inline mr-2" size={16} />Export CSV</button>
      {admin.toast && <Toast message={admin.toast.message} tone={admin.toast.tone} onClose={admin.clearToast} />}
    </AdminLayout>
  );
};

export default PaymentHistory;
