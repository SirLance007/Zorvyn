import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, ArrowDownRight, Trash2, Search, Filter } from 'lucide-react';
import API from '../api/axios';
import { formatCurrency } from '../utils/currency';

const Transactions = ({ currency = 'USD' }) => {
    const navigate = useNavigate();
    const [transactions, setTransactions] = useState([]);
    const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 1 });
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState({ type: '', category: '', from: '', to: '' });
    const [page, setPage] = useState(1);

    const fetchTransactions = async (currentPage = 1) => {
        try {
            setIsLoading(true);
            const params = new URLSearchParams({
                page: currentPage,
                limit: 15,
                ...(filters.type && { type: filters.type }),
                ...(filters.category && { category: filters.category }),
                ...(filters.from && { from: filters.from }),
                ...(filters.to && { to: filters.to }),
            });
            const { data } = await API.get(`/transactions?${params}`);
            setTransactions(data.data.data);
            setPagination(data.data.pagination);
        } catch (err) {
            console.error('Failed to fetch transactions', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions(page);
    }, [page]);

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1);
        fetchTransactions(1);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this transaction?')) return;
        try {
            await API.delete(`/transactions/${id}`);
            fetchTransactions(page);
        } catch (err) {
            alert('Failed to delete transaction');
        }
    };

    return (
        <div className="min-h-screen bg-zinc-950 text-white relative overflow-x-hidden">
            {/* Background Ambience */}
            <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/10 blur-[120px] pointer-events-none z-0" />
            <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-600/10 blur-[120px] pointer-events-none z-0" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="p-2.5 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 rounded-xl transition-all"
                    >
                        <ArrowLeft className="w-5 h-5 text-zinc-400" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                            All Transactions
                        </h1>
                        <p className="text-zinc-500 text-sm mt-0.5">{pagination.total} records total</p>
                    </div>
                </div>

                {/* Filters */}
                <form onSubmit={handleSearch} className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800/50 backdrop-blur-xl mb-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <select
                            value={filters.type}
                            onChange={e => setFilters(f => ({ ...f, type: e.target.value }))}
                            className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-purple-500/50"
                        >
                            <option value="">All Types</option>
                            <option value="INCOME">Income</option>
                            <option value="EXPENSE">Expense</option>
                        </select>
                        <input
                            type="text"
                            placeholder="Category..."
                            value={filters.category}
                            onChange={e => setFilters(f => ({ ...f, category: e.target.value }))}
                            className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-purple-500/50"
                        />
                        <input
                            type="date"
                            value={filters.from}
                            onChange={e => setFilters(f => ({ ...f, from: e.target.value }))}
                            className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-zinc-300 outline-none focus:border-purple-500/50"
                        />
                        <input
                            type="date"
                            value={filters.to}
                            onChange={e => setFilters(f => ({ ...f, to: e.target.value }))}
                            className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-zinc-300 outline-none focus:border-purple-500/50"
                        />
                    </div>
                    <div className="flex gap-2 mt-3">
                        <button type="submit" className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm font-medium rounded-xl hover:from-purple-500 hover:to-indigo-500 transition-all">
                            <Search className="w-4 h-4" /> Apply Filters
                        </button>
                        <button type="button" onClick={() => { setFilters({ type: '', category: '', from: '', to: '' }); setPage(1); fetchTransactions(1); }}
                            className="px-4 py-2 bg-zinc-800 text-zinc-300 text-sm rounded-xl hover:bg-zinc-700 transition-all">
                            Clear
                        </button>
                    </div>
                </form>

                {/* Table */}
                <div className="rounded-2xl bg-zinc-900/50 border border-zinc-800/50 backdrop-blur-xl overflow-hidden">
                    {isLoading ? (
                        <div className="p-8 space-y-4">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="h-14 bg-zinc-800/50 rounded-xl animate-pulse" />
                            ))}
                        </div>
                    ) : transactions.length === 0 ? (
                        <div className="p-12 text-center text-zinc-500">No transactions found.</div>
                    ) : (
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-zinc-800/50">
                                    <th className="text-left text-xs font-medium text-zinc-500 uppercase tracking-wider px-6 py-4">Type</th>
                                    <th className="text-left text-xs font-medium text-zinc-500 uppercase tracking-wider px-6 py-4">Description</th>
                                    <th className="text-left text-xs font-medium text-zinc-500 uppercase tracking-wider px-6 py-4">Category</th>
                                    <th className="text-left text-xs font-medium text-zinc-500 uppercase tracking-wider px-6 py-4">Date</th>
                                    <th className="text-right text-xs font-medium text-zinc-500 uppercase tracking-wider px-6 py-4">Amount</th>
                                    <th className="px-6 py-4"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-800/30">
                                {transactions.map(tx => (
                                    <tr key={tx.id} className="hover:bg-zinc-800/20 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className={`inline-flex p-2 rounded-lg ${tx.type === 'INCOME' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                                                {tx.type === 'INCOME' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-white font-medium">{tx.notes || '—'}</td>
                                        <td className="px-6 py-4">
                                            <span className="text-xs px-2.5 py-1 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">{tx.category}</span>
                                        </td>
                                        <td className="px-6 py-4 text-zinc-400 text-sm">{new Date(tx.date).toLocaleDateString()}</td>
                                        <td className={`px-6 py-4 text-right font-semibold ${tx.type === 'INCOME' ? 'text-emerald-400' : 'text-white'}`}>
                                            {tx.type === 'INCOME' ? '+' : '-'}{formatCurrency(tx.amount, currency)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <button onClick={() => handleDelete(tx.id)} className="opacity-0 group-hover:opacity-100 p-1.5 text-zinc-600 hover:text-red-400 bg-zinc-900 rounded-lg transition-all">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                    <div className="flex items-center justify-between mt-6">
                        <p className="text-zinc-500 text-sm">Page {pagination.page} of {pagination.totalPages}</p>
                        <div className="flex gap-2">
                            <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}
                                className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-zinc-300 disabled:opacity-40 hover:bg-zinc-800 transition-all">
                                Previous
                            </button>
                            <button disabled={page >= pagination.totalPages} onClick={() => setPage(p => p + 1)}
                                className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-zinc-300 disabled:opacity-40 hover:bg-zinc-800 transition-all">
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Transactions;
