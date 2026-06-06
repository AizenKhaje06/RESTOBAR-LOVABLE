import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { 
  DollarSign, 
  ShoppingCart, 
  Clock, 
  CheckCircle2, 
  TrendingUp,
  Users,
  Utensils
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// Mock data
const mockSalesData = [
  { name: 'Mon', sales: 4000, orders: 24 },
  { name: 'Tue', sales: 3000, orders: 18 },
  { name: 'Wed', sales: 2000, orders: 15 },
  { name: 'Thu', sales: 2780, orders: 20 },
  { name: 'Fri', sales: 1890, orders: 12 },
  { name: 'Sat', sales: 2390, orders: 25 },
  { name: 'Sun', sales: 3490, orders: 30 },
];

const mockPopularItems = [
  { name: 'Burger', value: 45 },
  { name: 'Pizza', value: 38 },
  { name: 'Pasta', value: 32 },
  { name: 'Cocktail', value: 28 },
];

const COLORS = ['#ff7f50', '#ffc658', '#52c41a', '#1890ff'];

const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  bgColor = 'bg-primary/10',
  textColor = 'text-primary'
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  bgColor?: string;
  textColor?: string;
}) => (
  <div className="bg-card rounded-xl p-6 border border-border">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-muted-foreground text-sm mb-2">{title}</p>
        <p className="text-3xl font-bold text-foreground">{value}</p>
      </div>
      <div className={`${bgColor} p-3 rounded-lg`}>
        <Icon className={`${textColor} w-6 h-6`} />
      </div>
    </div>
  </div>
);

export default function Dashboard() {
  const [timeRange, setTimeRange] = useState('week');

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back! Here's what's happening today.</p>
          </div>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 rounded-lg bg-card border border-border text-foreground"
          >
            <option value="day">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Sales Today"
            value="₱18,540"
            icon={DollarSign}
            bgColor="bg-success/10"
            textColor="text-success"
          />
          <StatCard
            title="Total Orders"
            value="156"
            icon={ShoppingCart}
            bgColor="bg-info/10"
            textColor="text-info"
          />
          <StatCard
            title="Pending Orders"
            value="12"
            icon={Clock}
            bgColor="bg-warning/10"
            textColor="text-warning"
          />
          <StatCard
            title="Completed Orders"
            value="144"
            icon={CheckCircle2}
            bgColor="bg-primary/10"
            textColor="text-primary"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sales Trend */}
          <div className="lg:col-span-2 bg-card rounded-xl p-6 border border-border">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <TrendingUp size={20} className="text-primary" />
              Sales Trend
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mockSalesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Popular Items */}
          <div className="bg-card rounded-xl p-6 border border-border">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Utensils size={20} className="text-primary" />
              Popular Items
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={mockPopularItems}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name} ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {mockPopularItems.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Orders & Revenue */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Orders Per Day */}
          <div className="bg-card rounded-xl p-6 border border-border">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <ShoppingCart size={20} className="text-primary" />
              Orders Per Day
            </h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={mockSalesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip />
                <Bar dataKey="orders" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Table Status */}
          <div className="bg-card rounded-xl p-6 border border-border">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Users size={20} className="text-primary" />
              Table Status
            </h2>
            <div className="space-y-4">
              {[
                { status: 'Available', count: 18, color: 'bg-success' },
                { status: 'Occupied', count: 8, color: 'bg-primary' },
                { status: 'Preparing', count: 3, color: 'bg-warning' },
                { status: 'Paid', count: 1, color: 'bg-info' },
              ].map((item) => (
                <div key={item.status} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${item.color}`} />
                    <span className="text-foreground">{item.status}</span>
                  </div>
                  <span className="font-semibold text-foreground">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Orders Table */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="p-6 border-b border-border">
            <h2 className="text-lg font-semibold text-foreground">Recent Orders</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary/20">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Order ID</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Table</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Items</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Amount</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[1, 2, 3, 4, 5].map((order) => (
                  <tr key={order} className="hover:bg-secondary/20 transition-colors">
                    <td className="px-6 py-4 text-sm text-foreground">ORD-{1001 + order}</td>
                    <td className="px-6 py-4 text-sm text-foreground">Table {order}</td>
                    <td className="px-6 py-4 text-sm text-foreground">3 items</td>
                    <td className="px-6 py-4 text-sm font-semibold text-foreground">₱{(500 + order * 100).toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-success/20 text-success">
                        Completed
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}
