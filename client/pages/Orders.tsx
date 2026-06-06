import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Search, Filter, Eye } from 'lucide-react';
import { toast } from 'sonner';

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  tableNumber: number;
  items: OrderItem[];
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'served' | 'completed';
  subtotal: number;
  tax: number;
  serviceCharge: number;
  total: number;
  createdAt: string;
  paymentStatus: 'unpaid' | 'partial' | 'paid';
}

const mockOrders: Order[] = [
  {
    id: 'ORD-1001',
    tableNumber: 1,
    items: [
      { id: '1', name: 'Burger', quantity: 2, price: 250 },
      { id: '2', name: 'Coca-Cola', quantity: 2, price: 80 },
    ],
    status: 'completed',
    subtotal: 660,
    tax: 79.2,
    serviceCharge: 132,
    total: 871.2,
    createdAt: '2024-01-20 14:30',
    paymentStatus: 'paid',
  },
  {
    id: 'ORD-1002',
    tableNumber: 3,
    items: [
      { id: '1', name: 'Pizza Margherita', quantity: 1, price: 380 },
      { id: '2', name: 'Margarita', quantity: 2, price: 280 },
    ],
    status: 'ready',
    subtotal: 940,
    tax: 112.8,
    serviceCharge: 188,
    total: 1240.8,
    createdAt: '2024-01-20 15:15',
    paymentStatus: 'unpaid',
  },
  {
    id: 'ORD-1003',
    tableNumber: 5,
    items: [
      { id: '1', name: 'Caesar Salad', quantity: 1, price: 220 },
      { id: '2', name: 'Iced Tea', quantity: 1, price: 70 },
    ],
    status: 'preparing',
    subtotal: 290,
    tax: 34.8,
    serviceCharge: 58,
    total: 382.8,
    createdAt: '2024-01-20 15:45',
    paymentStatus: 'unpaid',
  },
  {
    id: 'ORD-1004',
    tableNumber: 2,
    items: [
      { id: '1', name: 'San Miguel Beer', quantity: 3, price: 120 },
      { id: '2', name: 'Tiramisu', quantity: 2, price: 180 },
    ],
    status: 'confirmed',
    subtotal: 720,
    tax: 86.4,
    serviceCharge: 144,
    total: 950.4,
    createdAt: '2024-01-20 16:00',
    paymentStatus: 'unpaid',
  },
  {
    id: 'ORD-1005',
    tableNumber: 4,
    items: [
      { id: '1', name: 'Pasta', quantity: 1, price: 320 },
    ],
    status: 'pending',
    subtotal: 320,
    tax: 38.4,
    serviceCharge: 64,
    total: 422.4,
    createdAt: '2024-01-20 16:30',
    paymentStatus: 'unpaid',
  },
];

const statusColors = {
  pending: 'bg-warning/20 text-warning',
  confirmed: 'bg-info/20 text-info',
  preparing: 'bg-warning/20 text-warning',
  ready: 'bg-success/20 text-success',
  served: 'bg-primary/20 text-primary',
  completed: 'bg-success/20 text-success',
};

const statusLabels = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  preparing: 'Preparing',
  ready: 'Ready',
  served: 'Served',
  completed: 'Completed',
};

const paymentStatusColors = {
  unpaid: 'bg-destructive/20 text-destructive',
  partial: 'bg-warning/20 text-warning',
  paid: 'bg-success/20 text-success',
};

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.tableNumber.toString().includes(searchTerm);
    const matchesStatus = !selectedStatus || order.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setShowDetailModal(true);
  };

  const handleStatusChange = (orderId: string, newStatus: Order['status']) => {
    setOrders(orders.map(order =>
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
    toast.success(`Order status updated to ${statusLabels[newStatus]}`);
  };

  const handlePaymentStatusChange = (orderId: string, newStatus: Order['paymentStatus']) => {
    setOrders(orders.map(order =>
      order.id === orderId ? { ...order, paymentStatus: newStatus } : order
    ));
    toast.success(`Payment status updated`);
  };

  const getNextStatus = (currentStatus: Order['status']): Order['status'] => {
    const statuses: Order['status'][] = ['pending', 'confirmed', 'preparing', 'ready', 'served', 'completed'];
    const currentIndex = statuses.indexOf(currentStatus);
    return currentIndex < statuses.length - 1 ? statuses[currentIndex + 1] : currentStatus;
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Order Management</h1>
            <p className="text-muted-foreground">View and manage all orders</p>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="flex gap-4 flex-col md:flex-row">
          <div className="flex-1 relative">
            <Search size={20} className="absolute left-3 top-3 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by Order ID or Table..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="flex gap-2">
            <Filter size={20} className="text-muted-foreground" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="preparing">Preparing</option>
              <option value="ready">Ready</option>
              <option value="served">Served</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        {/* Detail Modal */}
        {showDetailModal && selectedOrder && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-card rounded-xl p-6 max-w-2xl w-full border border-border max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">{selectedOrder.id}</h2>
                  <p className="text-sm text-muted-foreground">Table {selectedOrder.tableNumber}</p>
                </div>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-xl text-muted-foreground hover:text-foreground"
                >
                  ✕
                </button>
              </div>

              {/* Items */}
              <div className="mb-6">
                <h3 className="font-semibold text-foreground mb-3">Order Items</h3>
                <div className="space-y-2 bg-secondary/20 rounded-lg p-4">
                  {selectedOrder.items.map(item => (
                    <div key={item.id} className="flex justify-between items-center">
                      <div>
                        <p className="text-foreground">{item.quantity}x {item.name}</p>
                      </div>
                      <p className="font-semibold text-foreground">₱{(item.quantity * item.price).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals */}
              <div className="mb-6 space-y-2 bg-secondary/20 rounded-lg p-4">
                <div className="flex justify-between text-foreground">
                  <span>Subtotal:</span>
                  <span>₱{selectedOrder.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-foreground">
                  <span>Tax (12%):</span>
                  <span>₱{selectedOrder.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-foreground">
                  <span>Service Charge (10%):</span>
                  <span>₱{selectedOrder.serviceCharge.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-primary border-t border-border pt-2">
                  <span>Total:</span>
                  <span>₱{selectedOrder.total.toFixed(2)}</span>
                </div>
              </div>

              {/* Status Control */}
              <div className="mb-6 space-y-3">
                <h3 className="font-semibold text-foreground">Order Status</h3>
                <div className="flex gap-2 flex-wrap">
                  {['pending', 'confirmed', 'preparing', 'ready', 'served', 'completed'].map(status => (
                    <button
                      key={status}
                      onClick={() => handleStatusChange(selectedOrder.id, status as Order['status'])}
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                        selectedOrder.status === status
                          ? statusColors[status as keyof typeof statusColors]
                          : 'bg-muted/20 text-muted-foreground hover:bg-muted/40'
                      }`}
                    >
                      {statusLabels[status as keyof typeof statusLabels]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment Status */}
              <div className="mb-6 space-y-3">
                <h3 className="font-semibold text-foreground">Payment Status</h3>
                <div className="flex gap-2">
                  {['unpaid', 'partial', 'paid'].map(status => (
                    <button
                      key={status}
                      onClick={() => handlePaymentStatusChange(selectedOrder.id, status as Order['paymentStatus'])}
                      className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                        selectedOrder.paymentStatus === status
                          ? paymentStatusColors[status as keyof typeof paymentStatusColors]
                          : 'bg-muted/20 text-muted-foreground hover:bg-muted/40'
                      }`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setShowDetailModal(false)}
                className="w-full bg-primary text-primary-foreground py-2 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Orders Table */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary/20 border-b border-border">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Order ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Table</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Items</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Total</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Payment</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Time</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredOrders.map(order => (
                  <tr key={order.id} className="hover:bg-secondary/20 transition-colors">
                    <td className="px-6 py-4 text-sm font-semibold text-foreground">{order.id}</td>
                    <td className="px-6 py-4 text-sm text-foreground">Table {order.tableNumber}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{order.items.length} items</td>
                    <td className="px-6 py-4 text-sm font-semibold text-foreground">₱{order.total.toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[order.status]}`}>
                        {statusLabels[order.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${paymentStatusColors[order.paymentStatus]}`}>
                        {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{order.createdAt}</td>
                    <td className="px-6 py-4 text-sm">
                      <button
                        onClick={() => handleViewDetails(order)}
                        className="p-2 hover:bg-secondary rounded-lg transition-colors"
                      >
                        <Eye size={18} className="text-primary" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No orders found</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
