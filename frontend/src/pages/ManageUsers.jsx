import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Users, Shield, Loader, CheckCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import toast from 'react-hot-toast';
import CustomSelect from '../components/reusable/CustomSelect';

const ManageUsers = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [usersList, setUsersList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [targetLoading, setTargetLoading] = useState(null);

  useEffect(() => {
    // Extra frontend protection just in case
    if (user && user.role !== 'ADMIN') {
      navigate('/dashboard');
    } else if (user) {
      fetchUsers();
    }
  }, [user, navigate]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const res = await API.get('/users');
      setUsersList(res.data.data);
    } catch (error) {
      console.error('Failed to fetch users', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateRole = async (userId, newRole) => {
    try {
      setTargetLoading(userId);
      await API.patch(`/users/${userId}/role`, { role: newRole });
      
      // Update local state instead of re-fetching everything
      setUsersList(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
      toast.success(`Role successfully updated to ${newRole}`);
    } catch (error) {
      console.error('Failed to update role', error);
      toast.error('Error updating role. Are you definitely an Admin?');
    } finally {
      setTargetLoading(null);
    }
  };

  if (!user || user.role !== 'ADMIN') return null;

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-4 sm:p-6 lg:p-8 relative">
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none z-0" />
      
      {isLoading && (
        <div className="fixed top-0 left-0 right-0 h-0.5 z-50 bg-gradient-to-r from-blue-500 to-indigo-500 animate-pulse" />
      )}

      <div className="max-w-5xl mx-auto relative z-10">
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
                <Users className="w-7 h-7 text-blue-500" />
                Manage Access
              </h1>
              <p className="text-zinc-400 text-sm mt-1">Control system permissions and roles.</p>
            </div>
          </div>
        </header>

        <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl overflow-hidden backdrop-blur-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left text-sm text-zinc-400">
              <thead className="bg-zinc-900/80 text-zinc-300 uppercase text-xs">
                <tr>
                  <th className="px-6 py-4 font-medium">User Name</th>
                  <th className="px-6 py-4 font-medium">Email Address</th>
                  <th className="px-6 py-4 font-medium">System Role</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {usersList.map((u) => (
                  <tr key={u.id} className="hover:bg-zinc-800/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-white flex items-center gap-2">
                        {u.name}
                        {u.id === user.id && (
                          <span className="text-[10px] uppercase tracking-wider bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">You</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">{u.email}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        <Shield className={`w-4 h-4 ${u.role === 'ADMIN' ? 'text-red-400' : u.role === 'ANALYST' ? 'text-blue-400' : 'text-zinc-500'}`} />
                        <span className={`font-medium ${u.role === 'ADMIN' ? 'text-red-400' : u.role === 'ANALYST' ? 'text-blue-400' : 'text-zinc-300'}`}>
                          {u.role}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {targetLoading === u.id ? (
                        <div className="flex justify-end pr-4 text-blue-400">
                          <Loader className="w-5 h-5 animate-spin" />
                        </div>
                      ) : u.id === user.id ? (
                        <span className="text-zinc-600 text-xs italic">Cannot change own role</span>
                      ) : (
                        <CustomSelect
                          value={u.role}
                          onChange={(val) => updateRole(u.id, val)}
                          options={[
                            { value: 'VIEWER', label: 'Viewer' },
                            { value: 'ANALYST', label: 'Analyst' },
                            { value: 'ADMIN', label: 'Admin' },
                          ]}
                        />
                      )}
                    </td>
                  </tr>
                ))}
                
                {!isLoading && usersList.length === 0 && (
                  <tr>
                    <td colSpan="4" className="px-6 py-8 text-center text-zinc-500 italic">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;
