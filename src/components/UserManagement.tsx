import React, { useState, useEffect } from 'react';
import { UserPlus } from 'lucide-react';
import { UserList } from './users/UserList';
import { UserForm } from './users/UserForm';
import { getUsers } from '../services/api';
import type { User } from '../services/api';

export function UserManagement() {
  const [showForm, setShowForm] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getUsers();
      setUsers(data);
      setError(null);
    } catch (err) {
      setError('ユーザーデータの取得に失敗しました');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = (userData: Omit<User, 'id' | 'lastLogin' | 'status'>) => {
    const newUser: User = {
      ...userData,
      id: users.length + 1,
      lastLogin: new Date().toISOString().split('T')[0],
      status: 'active'
    };
    setUsers([...users, newUser]);
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">ユーザ管理</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <UserPlus className="w-5 h-5" />
          新規ユーザを追加
        </button>
      </div>

      {showForm ? (
        <UserForm onClose={() => setShowForm(false)} onSubmit={handleAddUser} />
      ) : (
        <UserList users={users} />
      )}
    </div>
  );
}