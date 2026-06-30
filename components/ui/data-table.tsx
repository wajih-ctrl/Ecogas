'use client';

import { ReactNode } from 'react';

export interface DataTableColumn {
  key: string;
  label: string;
  width?: string;
  render?: (value: any, row: any) => ReactNode;
  align?: 'left' | 'center' | 'right';
}

interface DataTableProps {
  columns: DataTableColumn[];
  data: any[];
  onRowClick?: (row: any) => void;
  emptyState?: string;
  className?: string;
  striped?: boolean;
  hoverable?: boolean;
}

export function DataTable({
  columns,
  data,
  onRowClick,
  emptyState = 'No data available',
  className = '',
  striped = true,
  hoverable = true,
}: DataTableProps) {
  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  return (
    <div className={`overflow-x-auto rounded-lg border border-slate-200 bg-white ${className}`}>
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50">
            {columns.map((col) => (
              <th
                key={col.key}
                style={{ width: col.width }}
                className={`px-6 py-4 text-sm font-semibold text-slate-700 ${alignClasses[col.align || 'left']}`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-8 text-center text-sm text-slate-500">
                {emptyState}
              </td>
            </tr>
          ) : (
            data.map((row, idx) => (
              <tr
                key={`${row.id}-${idx}`}
                className={`border-b border-slate-100 transition-colors ${
                  striped && idx % 2 === 1 ? 'bg-slate-50' : 'bg-white'
                } ${hoverable && onRowClick ? 'cursor-pointer hover:bg-slate-100' : ''}`}
                onClick={() => onRowClick?.(row)}
              >
                {columns.map((col) => (
                  <td
                    key={`${row.id}-${col.key}`}
                    className={`px-6 py-4 text-sm text-slate-700 ${alignClasses[col.align || 'left']}`}
                  >
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
