import React from 'react';

interface TableProps {
  headers: string[];
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export default function Table({ headers, children, className = '', id }: TableProps) {
  return (
    <div id={id} className={`w-full overflow-x-auto rounded-xl border border-slate-150 bg-white shadow-3xs ${className}`}>
      <table className="w-full text-left border-collapse font-sans">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-150 text-[10px] font-bold font-mono uppercase tracking-wider text-slate-500">
            {headers.map((header, index) => (
              <th key={index} className="px-5 py-3.5 select-none font-semibold">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
          {children}
        </tbody>
      </table>
    </div>
  );
}

export function TableRow({ children, className = '', ...props }: React.HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr className={`hover:bg-slate-50/50 transition-colors ${className}`} {...props}>
      {children}
    </tr>
  );
}

export function TableCell({ children, className = '', ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td className={`px-5 py-4 ${className}`} {...props}>
      {children}
    </td>
  );
}
