import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Plus, Edit2, Trash2, Eye, EyeOff, Search } from 'lucide-react';
import { toast } from 'sonner';

interface StaffUser {
  id: string;
  name: string;
  email: string;
  role: 'pos' | 'waiter';
  joinDate: string;
  status: 'active' | 'inactive';
}

const mockUsers: StaffUser[] = [
  { id: '1', name: 'Maria Santos', email: 'maria@restaubar.com', role: 'pos', joinDate: '2024-01-15', status: 'active' },
  { id: '2', name: 'Juan Cruz', email: 'juan@restaubar.com', role: 'waiter', joinDate: '2024-02-10', status: 'active' },
  { id: '3', name: 'Rosa Martinez', email: 'rosa@restaubar.com', role: 'waiter', joinDate: '2024-01-20', status: 'active' },
  { id: '4', name: 'Carlos Reyes', email: 'carlos@restaubar.com', role: 'pos', joinDate: '2024-03-05', status: 'inactive' },
];

export default function Users() {
  const [users, setUsers] = useState<StaffUser[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'waiter' as 'pos' | 'waiter',
    status: 'active' as 'active' | 'inactive',
  });

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = !selectedRole || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const handleAddUser = () => {
    setEditingId(null);
    setFormData({ name: '', email: '', password: '', role: 'waiter', status: 'active' });
    setShowForm(true);
  };

  const handleEditUser = (user: StaffUser) => {
    setEditingId(user.id);
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role,
      status: user.status,
    });
    setShowForm(true);
  };

  const handleDeleteUser = (id: string) => {
    setUsers(users.filter(user => user.id !== id));
    toast.success('User deleted');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email) {
      toast.error('Please fill all required fields');
      return;
    }

    if (!editingId && !formData.password) {
      toast.error('Password is required for new users');
      return;
    }

    if (editingId) {
      setUsers(users.map(user =>
        user.id === editingId
          ? {
              ...user,
              name: formData.name,
              email: formData.email,
              role: formData.role,
              status: formData.status,
            }
          : user
      ));
      toast.success('User updated');
    } else {
      const newUser: StaffUser = {
        id: Date.now().toString(),
        name: formData.name,
        email: formData.email,
        role: formData.role,
        joinDate: new Date().toISOString().split('T')[0],
        status: formData.status,
      };
      setUsers([...users, newUser]);
      toast.success('User created');
    }

    setShowForm(false);
    setFormData({ name: '', email: '', password: '', role: 'waiter', status: 'active' });
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">User Management</h1>
            <p className="text-muted-foreground">Manage POS and Waiter accounts</p>
          </div>
          <button
            onClick={handleAddUser}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
          >
            <Plus size={20} />
            Add User
          </button>
        </div>

        {/* Search & Filter */}
        <div className="flex gap-4 flex-col md:flex-row">
          <div className="flex-1 relative">
            <Search size={20} className="absolute left-3 top-3 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="px-4 py-2 rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">All Roles</option>
            <option value="pos">POS</option>
            <option value="waiter">Waiter</option>
          </select>
        </div>

        {/* Add/Edit Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-card rounded-xl p-6 max-w-md w-full border border-border">
              <h2 className="text-xl font-bold text-foreground mb-4">
                {editingId ? 'Edit User' : 'Create New User'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Full Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Email Address *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {!editingId && (
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Password *</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as 'pos' | 'waiter' })}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="waiter">Waiter</option>
                    <option value="pos">POS</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <div className="flex gap-2 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-primary text-primary-foreground py-2 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
                  >
                    {editingId ? 'Update' : 'Create'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 bg-muted text-muted-foreground py-2 rounded-lg font-semibold hover:bg-secondary transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Users Table */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary/20 border-b border-border">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Role</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Join Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredUsers.map(user => (
                  <tr key={user.id} className="hover:bg-secondary/20 transition-colors">
                    <td className="px-6 py-4 text-sm text-foreground font-medium">{user.name}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{user.email}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        user.role === 'pos'
                          ? 'bg-primary/20 text-primary'
                          : 'bg-info/20 text-info'
                      }`}>
                        {user.role.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">{user.joinDate}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        user.status === 'active'
                          ? 'bg-success/20 text-success'
                          : 'bg-muted/20 text-muted-foreground'
                      }`}>
                        {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditUser(user)}
                          className="p-2 hover:bg-secondary rounded-lg transition-colors"
                        >
                          <Edit2 size={18} className="text-primary" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="p-2 hover:bg-secondary rounded-lg transition-colors"
                        >
                          <Trash2 size={18} className="text-destructive" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No users found</p>
            <button
              onClick={handleAddUser}
              className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
            >
              Add First User
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
}
