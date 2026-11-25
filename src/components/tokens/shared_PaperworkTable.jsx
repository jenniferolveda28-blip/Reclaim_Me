import React from 'react';

export default function SharedPaperworkTable({ columns, rows, monoLast = false }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-slate-700">
      <table className="w-full text-left text-xs md:text-sm">
        <thead className="bg-slate-900/70">
          <tr>
            {columns.map((col) => (
              <th key={col} className="px-3 py-2 font-semibold text-slate-400 uppercase tracking-wide text-[10px] md:text-[11px] whitespace-nowrap">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-t border-slate-700/70 align-top">
              {row.map((cell, j) => (
                <td
                  key={j}
                  className={`px-3 py-2 text-slate-300 ${j === 0 ? 'font-medium text-slate-100 whitespace-nowrap' : ''} ${
                    monoLast && j === row.length - 1 ? 'font-mono text-cyan-300 text-[11px]' : ''
                  }`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}