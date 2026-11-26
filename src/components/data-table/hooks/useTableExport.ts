import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { ColumnConfig, ExportFormat } from '../types';
import { getColumnValue } from '../utils/sorting';

function flattenRows<T>(rows: T[], columns: ColumnConfig<T>[]): (string | number)[][] {
  return rows.map((row) =>
    columns.map((col) => {
      const val = getColumnValue(row, col);
      if (val == null) return '';
      if (val instanceof Date) return val.toISOString();
      if (typeof val === 'number') return val;
      return String(val);
    }),
  );
}

function headersOf<T>(columns: ColumnConfig<T>[]): string[] {
  return columns.map((col) => (typeof col.header === 'string' ? col.header : col.id));
}

function triggerDownload(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportData<T>(
  rows: T[],
  columns: ColumnConfig<T>[],
  format: ExportFormat,
  fileName = 'data',
) {
  const headers = headersOf(columns);
  const data = flattenRows(rows, columns);

  if (format === 'csv') {
    const csv = Papa.unparse({ fields: headers, data });
    triggerDownload(new Blob([csv], { type: 'text/csv;charset=utf-8;' }), `${fileName}.csv`);
    return;
  }

  if (format === 'xlsx') {
    const ws = XLSX.utils.aoa_to_sheet([headers, ...data]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, `${fileName}.xlsx`);
    return;
  }

  const doc = new jsPDF({ orientation: 'landscape' });
  autoTable(doc, {
    head: [headers],
    body: data.map((r) => r.map((v) => String(v))),
    styles: { fontSize: 8, cellPadding: 2 },
    theme: 'grid',
  });
  doc.save(`${fileName}.pdf`);
}

export function useTableExport<T>(fileName: string) {
  return (rows: T[], columns: ColumnConfig<T>[], format: ExportFormat) => {
    exportData(rows, columns, format, fileName);
  };
}
