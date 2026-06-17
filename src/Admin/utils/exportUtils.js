const toRows = (rows) => {
  if (!Array.isArray(rows)) return [];

  return rows.map((row) => {
    if (typeof row !== 'object' || row === null || Array.isArray(row)) return { value: row };

    const normalized = {};

    Object.entries(row).forEach(([key, value]) => {
      normalized[key] = typeof value === 'object' ? JSON.stringify(value) : value ?? '';
    });

    return normalized;
  });
};

const buildCsv = (rows) => {
  const normalizedRows = toRows(rows);
  const keys = Array.from(new Set(normalizedRows.flatMap((row) => Object.keys(row))));

  if (!keys.length) return 'value\n""';

  const escapeCell = (value) => {
    const stringValue = String(value ?? '');
    const needsQuotes = /[",\n\r]/.test(stringValue);
    return needsQuotes ? `"${stringValue.replace(/"/g, '""')}"` : stringValue;
  };

  const header = keys.map(escapeCell).join(',');
  const body = normalizedRows.map((row) => keys.map((key) => escapeCell(row[key])).join(',')).join('\n');

  return `${header}\n${body}`;
};

export const exportToCSV = (rows, filename = 'admin-export.csv') => {
  const csv = buildCsv(rows);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const exportToJSON = (data, filename = 'admin-export.json') => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
