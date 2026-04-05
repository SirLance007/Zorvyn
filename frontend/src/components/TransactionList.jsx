import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, ArrowDownRight, Trash2 } from 'lucide-react';
import API from '../api/axios';
import { formatCurrency } from '../utils/currency';
import { useAuth } from '../context/AuthContext';

const TransactionList = ({ transactions, onDelete, currency = 'USD' }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const canViewAll = user?.role === 'ADMIN' || user?.role === 'ANALYST';
  const canDelete = user?.role === 'ADMIN';

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) return;
    try {
      await API.delete(`/transactions/${id}`);
      if (onDelete) onDelete();
    } catch (error) {
      console.error(error);
      alert('Failed to delete transaction. Please try again.');
    }
  };

  if (!transactions || transactions.length === 0) {
    return (
      <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800/50 backdrop-blur-xl shadow-xl flex flex-col h-full items-center justify-center">
        <p className="text-zinc-500 font-medium tracking-wide">No recent transactions found.</p>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800/50 backdrop-blur-xl shadow-xl flex flex-col h-full">
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-lg font-semibold text-white">Recent Transactions</h3>
        {canViewAll && (
          <button
            onClick={() => navigate('/transactions')}
            className="text-sm text-purple-400 hover:text-purple-300 transition-colors font-medium hover:underline underline-offset-2"
          >
            View All →
          </button>
        )}
      </div>
      
      <div className="space-y-3 flex-1 overflow-y-auto pr-1">
        {transactions.map((tx) => (
          <div
            key={tx.id || tx._id}
            className="flex items-center justify-between p-3 rounded-xl bg-zinc-950/50 border border-zinc-800/50 hover:border-zinc-700 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg flex items-center justify-center ${tx.type === 'INCOME' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                {tx.type === 'INCOME' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              </div>
              <div>
                <p className="font-medium text-white text-sm">{tx.notes || tx.description || tx.category}</p>
                <p className="text-xs text-zinc-500">{tx.category} • {new Date(tx.date).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`font-semibold text-sm whitespace-nowrap ${tx.type === 'INCOME' ? 'text-emerald-400' : 'text-white'}`}>
                {tx.type === 'INCOME' ? '+' : '-'}{formatCurrency(tx.amount, currency)}
              </span>
              {canDelete && (
                <button
                  onClick={() => handleDelete(tx.id || tx._id)}
                  className="text-zinc-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 p-1.5 bg-zinc-900 rounded-lg"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionList;
