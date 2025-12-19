import React from 'react';
import { CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';

const StatusBadge = ({ status, error }) => {
    const styles = {
        'Sent': 'bg-green-100 text-green-700 border-green-200',
        'Not Found': 'bg-red-100 text-red-700 border-red-200',
        'Error': 'bg-amber-100 text-amber-700 border-amber-200',
        'Checking': 'bg-indigo-50 text-indigo-600 border-indigo-200 animate-pulse',
        'Pending': 'bg-slate-100 text-slate-600 border-slate-200',
    };

    const icons = {
        'Sent': <CheckCircle size={14} />,
        'Not Found': <XCircle size={14} />,
        'Error': <AlertCircle size={14} />,
        'Checking': <Clock size={14} className="animate-spin" />,
        'Pending': <Clock size={14} />,
    };

    return (
        <span
            title={error}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${styles[status] || styles['Pending']} ${error ? 'cursor-help' : ''}`}
        >
            {icons[status] || icons['Pending']}
            {status}
        </span>
    );
};

const StatusTable = ({ data }) => {
    if (!data || data.length === 0) return null;

    return (
        <div className="w-full overflow-hidden bg-white shadow-lg rounded-xl border border-slate-200">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                Email Address
                            </th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                                Status
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {data.map((row, index) => (
                            <tr
                                key={index}
                                className="hover:bg-slate-50/60 transition-colors"
                            >
                                <td className="px-6 py-3.5 text-sm font-medium text-slate-700">
                                    {row.email}
                                </td>
                                <td className="px-6 py-3.5 text-right">
                                    <StatusBadge status={row.status} error={row.error} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex justify-between items-center">
                <span>Showing {data.length} emails</span>
                <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span> Sent
                    <span className="w-2 h-2 rounded-full bg-red-500 ml-2"></span> Not Found
                </span>
            </div>
        </div>
    );
};

export default StatusTable;
