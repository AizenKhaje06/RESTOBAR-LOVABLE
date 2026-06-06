import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Check, X, Clock, ChefHat, Utensils, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  notes?: string;
}

interface Order {
  id: string;
  tableNumber: number;
  items: OrderItem[];
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'served' | 'completed';
  createdAt: string;
  total: number;
}

const mockOrders: Order[] = [
  {
    id: 'ORD-1001',
    tableNumber: 1,
    items: [
      { id: '1', name: 'Burger', quantity: 2, price: 250, notes: 'No onions' },
      { id: '2', name: 'Coca-Cola', quantity: 2, price: 80 },
    ],
    status: 'pending',
    createdAt: '2024-01-20 14:30',
    total: 871.2,
  },
  {
    id: 'ORD-1002',
    tableNumber: 3,
    items: [
      { id: '1', name: 'Pizza Margherita', quantity: 1, price: 380 },
      { id: '2', name: 'Margarita', quantity: 2, price: 280 },
    ],
    status: 'pending',
    createdAt: '2024-01-20 14:45',
    total: 1240.8,
  },
  {
    id: 'ORD-1003',
    tableNumber: 2,
    items: [
      { id: '1', name: 'Caesar Salad', quantity: 1, price: 220 },
      { id: '2', name: 'Iced Tea', quantity: 1, price: 70 },
    ],
    status: 'confirmed',
    createdAt: '2024-01-20 13:00',
    total: 382.8,
  },
  {
    id: 'ORD-1004',
    tableNumber: 5,
    items: [
      { id: '1', name: 'San Miguel Beer', quantity: 3, price: 120 },
      { id: '2', name: 'Tiramisu', quantity: 2, price: 180 },
    ],
    status: 'ready',
    createdAt: '2024-01-20 13:30',
    total: 950.4,
  },
  {
    id: 'ORD-1005',
    tableNumber: 4,
    items: [
      { id: '1', name: 'Pasta Carbonara', quantity: 1, price: 320 },
    ],
    status: 'preparing',
    createdAt: '2024-01-20 14:00',
    total: 422.4,
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

const statusIcons = {
  pending: Clock,
  confirmed: Check,
  preparing: ChefHat,
  ready: Utensils,
  served: Check,
  completed: Check,
};

export default function WaiterDashboard() {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [activeTab, setActiveTab] = useState<'pending' | 'confirmed'>('pending');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const pendingOrders = orders.filter(o => o.status === 'pending');
  const confirmedOrders = orders.filter(o => ['confirmed', 'preparing', 'ready', 'served'].includes(o.status));

  const handleConfirmOrder = (orderId: string) => {
    setOrders(orders.map(order =>
      order.id === orderId ? { ...order, status: 'confirmed' as const } : order
    ));
    toast.success(`Order ${orderId} confirmed!`);
  };

  const handleRejectOrder = (orderId: string) => {
    setOrders(orders.filter(o => o.id !== orderId));
    toast.success(`Order ${orderId} rejected`);
  };

  const handleStatusChange = (orderId: string, newStatus: Order['status']) => {
    setOrders(orders.map(order =>
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
    
    const statusMessages = {
      pending: 'Order marked pending',
      confirmed: 'Order confirmed',
      preparing: 'Order is preparing',
      ready: 'Order is ready to serve!',
      served: 'Order served',
      completed: 'Order completed',
    };
    
    toast.success(statusMessages[newStatus]);
  };

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setShowDetailModal(true);
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
            <h1 className="text-3xl font-bold text-foreground">Waiter Dashboard</h1>
            <p className="text-muted-foreground">Manage orders and customer service</p>
          </div>
          <div className="flex gap-4">
            <div className="bg-card rounded-xl border border-border p-4">
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="text-3xl font-bold text-warning">{pendingOrders.length}</p>
            </div>
            <div className="bg-card rounded-xl border border-border p-4">
              <p className="text-sm text-muted-foreground">Active</p>
              <p className="text-3xl font-bold text-primary">{confirmedOrders.length}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-border">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-6 py-3 font-semibold transition-colors border-b-2 ${
              activeTab === 'pending'
                ? 'text-primary border-primary'
                : 'text-muted-foreground border-transparent hover:text-foreground'
            }`}
          >
            <span className="flex items-center gap-2">
              Pending Orders
              <span className="bg-warning text-warning-foreground px-2 py-1 rounded-full text-xs font-bold">
                {pendingOrders.length}
              </span>
            </span>
          </button>
          <button
            onClick={() => setActiveTab('confirmed')}
            className={`px-6 py-3 font-semibold transition-colors border-b-2 ${
              activeTab === 'confirmed'
                ? 'text-primary border-primary'
                : 'text-muted-foreground border-transparent hover:text-foreground'
            }`}
          >
            <span className="flex items-center gap-2">
              Active Orders
              <span className="bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs font-bold">
                {confirmedOrders.length}
              </span>
            </span>
          </button>
        </div>

        {/* Detail Modal */}
        {showDetailModal && selectedOrder && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-card rounded-xl p-6 max-w-lg w-full border border-border my-4">
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

              {/* Order Items */}
              <div className="mb-6">
                <h3 className="font-semibold text-foreground mb-3">Order Items</h3>
                <div className="space-y-3">
                  {selectedOrder.items.map(item => (
                    <div key={item.id} className="bg-secondary/20 rounded-lg p-3">
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-medium text-foreground">
                          {item.quantity}x {item.name}
                        </span>
                        <span className="text-primary font-semibold">₱{(item.quantity * item.price).toFixed(2)}</span>
                      </div>
                      {item.notes && (
                        <div className="flex items-start gap-2 text-sm text-warning mt-2 bg-warning/10 p-2 rounded">
                          <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
                          <span>{item.notes}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Timeline */}
              <div className="mb-6">
                <h3 className="font-semibold text-foreground mb-3">Order Status</h3>
                <div className="flex flex-wrap gap-2">
                  {['pending', 'confirmed', 'preparing', 'ready', 'served', 'completed'].map(status => (
                    <button
                      key={status}
                      onClick={() => {
                        handleStatusChange(selectedOrder.id, status as Order['status']);
                        const updatedOrder = orders.find(o => o.id === selectedOrder.id);
                        if (updatedOrder) setSelectedOrder(updatedOrder);
                      }}
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

              {/* Quick Actions */}
              {activeTab === 'confirmed' && (
                <div className="flex gap-2">
                  {selectedOrder.status !== 'completed' && (
                    <button
                      onClick={() => {
                        handleStatusChange(selectedOrder.id, getNextStatus(selectedOrder.status));
                        const updatedOrder = orders.find(o => o.id === selectedOrder.id);
                        if (updatedOrder) setSelectedOrder(updatedOrder);
                      }}
                      className="flex-1 bg-success text-success-foreground py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                    >
                      Mark {statusLabels[getNextStatus(selectedOrder.status)]}
                    </button>
                  )}
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="flex-1 bg-muted text-muted-foreground py-2 rounded-lg font-semibold hover:bg-secondary transition-colors"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Orders Grid */}
        <div className="space-y-4">
          {activeTab === 'pending' && (
            <>
              {pendingOrders.length === 0 ? (
                <div className="text-center py-12 bg-card rounded-xl border border-border">
                  <p className="text-muted-foreground mb-4">No pending orders</p>
                  <Clock size={32} className="mx-auto text-muted-foreground opacity-50" />
                </div>
              ) : (
                pendingOrders.map(order => (
                  <div key={order.id} className="bg-card rounded-xl border border-border p-6 hover:border-primary transition-colors">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-foreground">{order.id}</h3>
                        <p className="text-sm text-muted-foreground">Table {order.tableNumber} • {order.createdAt}</p>
                      </div>
                      <span className="px-3 py-1 rounded-full text-sm font-semibold bg-warning/20 text-warning">
                        Waiting Confirmation
                      </span>
                    </div>

                    {/* Items Preview */}
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        {order.items.map(item => (
                          <div key={item.id} className="bg-secondary/20 rounded-lg px-3 py-2">
                            <p className="text-sm font-medium text-foreground">{item.quantity}x {item.name}</p>
                            {item.notes && (
                              <p className="text-xs text-warning mt-1">Note: {item.notes}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleConfirmOrder(order.id)}
                        className="flex-1 flex items-center justify-center gap-2 bg-success text-success-foreground py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                      >
                        <Check size={20} />
                        Confirm Order
                      </button>
                      <button
                        onClick={() => handleRejectOrder(order.id)}
                        className="flex-1 flex items-center justify-center gap-2 bg-destructive text-destructive-foreground py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors"
                      >
                        <X size={20} />
                        Reject
                      </button>
                      <button
                        onClick={() => handleViewDetails(order)}
                        className="px-4 py-2 bg-secondary/20 text-foreground rounded-lg font-semibold hover:bg-secondary transition-colors"
                      >
                        Details
                      </button>
                    </div>
                  </div>
                ))
              )}
            </>
          )}

          {activeTab === 'confirmed' && (
            <>
              {confirmedOrders.length === 0 ? (
                <div className="text-center py-12 bg-card rounded-xl border border-border">
                  <p className="text-muted-foreground mb-4">No active orders</p>
                  <Utensils size={32} className="mx-auto text-muted-foreground opacity-50" />
                </div>
              ) : (
                confirmedOrders.map(order => {
                  const StatusIcon = statusIcons[order.status];
                  return (
                    <div key={order.id} className="bg-card rounded-xl border border-border p-6 hover:border-primary transition-colors">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-foreground">{order.id}</h3>
                          <p className="text-sm text-muted-foreground">Table {order.tableNumber} • {order.createdAt}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <StatusIcon size={20} className={statusColors[order.status].split(' ')[1]} />
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColors[order.status]}`}>
                            {statusLabels[order.status]}
                          </span>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="mb-4 space-y-2">
                        {order.items.map(item => (
                          <div key={item.id} className="flex justify-between text-sm">
                            <span className="text-foreground">{item.quantity}x {item.name}</span>
                            <span className="font-semibold text-foreground">₱{(item.quantity * item.price).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>

                      {/* Status Buttons & Quick Actions */}
                      <div className="flex gap-2 pt-4 border-t border-border">
                        {order.status !== 'completed' && (
                          <button
                            onClick={() => handleStatusChange(order.id, getNextStatus(order.status))}
                            className="flex-1 bg-primary text-primary-foreground py-2 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
                          >
                            Mark {statusLabels[getNextStatus(order.status)]}
                          </button>
                        )}
                        <button
                          onClick={() => handleViewDetails(order)}
                          className={`px-4 py-2 bg-secondary/20 text-foreground rounded-lg font-semibold hover:bg-secondary transition-colors ${
                            order.status === 'completed' ? 'flex-1' : ''
                          }`}
                        >
                          Details
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}
