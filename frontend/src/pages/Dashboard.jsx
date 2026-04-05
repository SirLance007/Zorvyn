import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, Plus, Wallet, TrendingUp, TrendingDown, DollarSign, IndianRupee } from 'lucide-react';
import StatCard from '../components/reusable/StatCard';
import TransactionChart from '../components/TransactionChart';
import TransactionList from '../components/TransactionList';
import AddTransactionModal from '../components/AddTransactionModal';
import API from '../api/axios';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currency, setCurrency] = useState('USD'); // 'USD' or 'INR'

  const [stats, setStats] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const [summaryRes, recentRes] = await Promise.all([
        API.get('/dashboard/summary'),
        API.get('/dashboard/recent?n=10')
      ]);
      setStats(summaryRes.data.data);
      setTransactions(recentRes.data.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-white relative overflow-x-hidden">
      {/* Background Ambience */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/10 blur-[120px] pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-600/10 blur-[120px] pointer-events-none z-0" />

      {/* Subtle top loading bar */}
      {isLoading && (
        <div className="fixed top-0 left-0 right-0 h-0.5 z-50 bg-gradient-to-r from-purple-600 via-indigo-500 to-emerald-500 animate-pulse" />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
              Overview
            </h1>
            <p className="text-zinc-400 mt-1">Welcome back, {user?.name || 'User'}!</p>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* Currency Toggle */}
            <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-xl p-1 gap-1">
              <button
                onClick={() => setCurrency('USD')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${currency === 'USD' ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20' : 'text-zinc-400 hover:text-white'}`}
              >
                <DollarSign className="w-3.5 h-3.5" /> USD
              </button>
              <button
                onClick={() => setCurrency('INR')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${currency === 'INR' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' : 'text-zinc-400 hover:text-white'}`}
              >
                <IndianRupee className="w-3.5 h-3.5" /> INR
              </button>
            </div>

            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium rounded-xl transition-all shadow-lg shadow-purple-600/20 active:scale-95"
            >
              <Plus className="w-5 h-5" />
              Add Transaction
            </button>
            <button 
              onClick={logout}
              className="p-2.5 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white rounded-xl transition-all group flex items-center justify-center"
              title="Logout"
            >
              <LogOut className="w-5 h-5 group-hover:text-red-400 transition-colors" />
            </button>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard 
            title="Total Balance" 
            value={stats?.netBalance || 0}
            icon={<Wallet className="w-6 h-6 text-purple-400" />} 
            trend={12.5} 
            trendUp={true} 
            colorClass="bg-purple-600"
            isLoading={isLoading}
            currency={currency}
          />
          <StatCard 
            title="Total Income" 
            value={stats?.totalIncome || 0}
            icon={<TrendingUp className="w-6 h-6 text-emerald-400" />} 
            trend={8.2} 
            trendUp={true} 
            colorClass="bg-emerald-600"
            isLoading={isLoading}
            currency={currency}
          />
          <StatCard 
            title="Total Expenses" 
            value={stats?.totalExpenses || 0}
            icon={<TrendingDown className="w-6 h-6 text-red-400" />} 
            trend={-4.1} 
            trendUp={false} 
            colorClass="bg-red-600"
            isLoading={isLoading}
            currency={currency}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-col gap-6 h-[400px]">
            <TransactionChart transactions={transactions} currency={currency} />
          </div>
          <div className="h-[400px]">
            <TransactionList transactions={transactions} onDelete={fetchDashboardData} currency={currency} />
          </div>
        </div>
      </div>

      <AddTransactionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={fetchDashboardData} />
    </div>
  );
};

export default Dashboard;
