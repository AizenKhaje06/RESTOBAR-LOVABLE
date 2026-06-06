import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Check, X, DollarSign, Eye, RefreshCw } from 'lucide-react';
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
  status: 'pending' | 'confirmed' | 'approved';
  subtotal: number;
  tax: number;
  serviceCharge: number;
  total: number;
  createdAt: string;
}

interface Payment {
  orderId: string;
  totalDue: number;
  amountReceived: number;
  change: number;
  status: 'unpaid' | 'paid';
  paymentMethod: 'cash' | 'card';
  receiptNumber?: string;
}

const mockPendingOrders: Order[] = [
  {
    id: 'ORD-1005',
    tableNumber: 4,
    items: [
      { id: '1', name: 'Burger', quantity: 2, price: 250 },
      { id: '2', name: 'Coca-Cola', quantity: 2, price: 80 },
    ],
    status: 'pending',
    subtotal: 660,
    tax: 79.2,
    serviceCharge: 132,
    total: 871.2,
    createdAt: '2024-01-20 14:30',
  },
  {
    id: 'ORD-1006',
    tableNumber: 7,
    items: [
      { id: '1', name: 'Pizza Margherita', quantity: 1, price: 380 },
      { id: '2', name: 'Margarita Cocktail', quantity: 2, price: 280 },
    ],
    status: 'pending',
    subtotal: 940,
    tax: 112.8,
    serviceCharge: 188,
    total: 1240.8,
    createdAt: '2024-01-20 15:00',
  },
];

const mockApprovedOrders: Order[] = [
  {
    id: 'ORD-1003',
    tableNumber: 2,
    items: [
      { id: '1', name: 'Caesar Salad', quantity: 1, price: 220 },
      { id: '2', name: 'Iced Tea', quantity: 2, price: 70 },
    ],
    status: 'approved',
    subtotal: 360,
    tax: 43.2,
    serviceCharge: 72,
    total: 475.2,
    createdAt: '2024-01-20 13:00',
  },
  {
    id: 'ORD-1004',
    tableNumber: 6,
    items: [
      { id: '1', name: 'San Miguel Beer', quantity: 3, price: 120 },
      { id: '2', name: 'Tiramisu', quantity: 2, price: 180 },
    ],
    status: 'approved',
    subtotal: 720,
    tax: 86.4,
    serviceCharge: 144,
    total: 950.4,
    createdAt: '2024-01-20 14:00',
  },
];

export default function POSDashboard() {
  const [pendingOrders, setPendingOrders] = useState<Order[]>(mockPendingOrders);
  const [approvedOrders, setApprovedOrders] = useState<Order[]>(mockApprovedOrders);
  const [activeTab, setActiveTab] = useState<'pending' | 'approved'>('pending');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentData, setPaymentData] = useState({
    amountReceived: '',
    paymentMethod: 'cash' as 'cash' | 'card',
  });

  const handleApproveOrder = (orderId: string) => {
    const order = pendingOrders.find(o => o.id === orderId);
    if (order) {
      setPendingOrders(pendingOrders.filter(o => o.id !== orderId));
      setApprovedOrders([...approvedOrders, { ...order, status: 'approved' }]);
      toast.success(`Order ${orderId} approved!`);
    }
  };

  const handleRejectOrder = (orderId: string) => {
    setPendingOrders(pendingOrders.filter(o => o.id !== orderId));
    toast.success(`Order ${orderId} rejected`);
  };

  const handlePaymentClick = (order: Order) => {
    setSelectedOrder(order);
    setPaymentData({ amountReceived: '', paymentMethod: 'cash' });
    setShowPaymentModal(true);
  };

  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedOrder || !paymentData.amountReceived) {
      toast.error('Please enter amount received');
      return;
    }

    const amountReceived = parseFloat(paymentData.amountReceived);
    if (amountReceived < selectedOrder.total && paymentData.paymentMethod === 'cash') {
      toast.error('Insufficient amount received');
      return;
    }

    const change = amountReceived - selectedOrder.total;
    const receiptNumber = `RCP-${Date.now()}`;

    // Remove from approved and show completion
    setApprovedOrders(approvedOrders.filter(o => o.id !== selectedOrder.id));
    
    // Show receipt
    showReceipt(selectedOrder, amountReceived, change, receiptNumber);
    
    toast.success(`Payment processed! Receipt: ${receiptNumber}`);
    setShowPaymentModal(false);
    setSelectedOrder(null);
  };

  const showReceipt = (order: Order, amountReceived: number, change: number, receiptNumber: string) => {
    const receiptText = `
╔══════════════════════════════════════╗
║          RESTAUBAR RECEIPT           ║
╠══════════════════════════════════════╣
║ Receipt #: ${receiptNumber.padEnd(27)}║
║ Table #: ${order.tableNumber.toString().padEnd(30)}║
║ Time: ${new Date().toLocaleString().padEnd(29)}║
╠══════════════════════════════════════╣
║ ITEMS:                               ║
${order.items.map(item => `║ ${item.quantity}x ${item.name.padEnd(23)} ₱${(item.quantity * item.price).toFixed(2).padStart(10)} ║`).join('\n')}
╠══════════════════════════════════════╣
║ Subtotal: ₱${order.subtotal.toFixed(2).padStart(28)}║
║ Tax (12%): ₱${order.tax.toFixed(2).padStart(27)}║
║ Service (10%): ₱${order.serviceCharge.toFixed(2).padStart(21)}║
╠══════════════════════════════════════╣
║ TOTAL: ₱${order.total.toFixed(2).padStart(31)}║
║ Amount Received: ₱${amountReceived.toFixed(2).padStart(20)}║
║ Change: ₱${change.toFixed(2).padStart(31)}║
║ Payment Method: ${(paymentData.paymentMethod === 'cash' ? 'CASH' : 'CARD').padEnd(20)}║
╠══════════════════════════════════════╣
║ Thank you for your purchase!         ║
║ Please come again!                   ║
╚══════════════════════════════════════╝
    `;
    
    // Open print dialog with receipt
    const printWindow = window.open('', '', 'height=400,width=600');
    if (printWindow) {
      printWindow.document.write('<pre>' + receiptText + '</pre>');
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">POS System</h1>
            <p className="text-muted-foreground">Process orders and payments</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-4">
            <p className="text-sm text-muted-foreground">Today's Revenue</p>
            <p className="text-3xl font-bold text-primary">₱5,540.20</p>
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
              Pending Queue
              <span className="bg-warning text-warning-foreground px-2 py-1 rounded-full text-xs font-bold">
                {pendingOrders.length}
              </span>
            </span>
          </button>
          <button
            onClick={() => setActiveTab('approved')}
            className={`px-6 py-3 font-semibold transition-colors border-b-2 ${
              activeTab === 'approved'
                ? 'text-primary border-primary'
                : 'text-muted-foreground border-transparent hover:text-foreground'
            }`}
          >
            <span className="flex items-center gap-2">
              Ready for Payment
              <span className="bg-success text-success-foreground px-2 py-1 rounded-full text-xs font-bold">
                {approvedOrders.length}
              </span>
            </span>
          </button>
        </div>

        {/* Payment Modal */}
        {showPaymentModal && selectedOrder && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-card rounded-xl p-6 max-w-md w-full border border-border">
              <h2 className="text-2xl font-bold text-foreground mb-4">Payment Processing</h2>

              {/* Order Summary */}
              <div className="bg-secondary/20 rounded-lg p-4 mb-6">
                <p className="text-sm text-muted-foreground mb-1">Order ID</p>
                <p className="text-lg font-semibold text-foreground mb-4">{selectedOrder.id}</p>

                <div className="space-y-2 text-sm mb-4">
                  {selectedOrder.items.map(item => (
                    <div key={item.id} className="flex justify-between">
                      <span>{item.quantity}x {item.name}</span>
                      <span>₱{(item.quantity * item.price).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border pt-3 space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>₱{selectedOrder.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (12%):</span>
                    <span>₱{selectedOrder.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Service (10%):</span>
                    <span>₱{selectedOrder.serviceCharge.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-primary border-t border-border pt-2">
                    <span>Total Due:</span>
                    <span>₱{selectedOrder.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <form onSubmit={handleProcessPayment} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Payment Method
                  </label>
                  <select
                    value={paymentData.paymentMethod}
                    onChange={(e) => setPaymentData({ ...paymentData, paymentMethod: e.target.value as 'cash' | 'card' })}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="cash">Cash</option>
                    <option value="card">Card</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Amount Received (₱)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min={selectedOrder.total}
                    value={paymentData.amountReceived}
                    onChange={(e) => setPaymentData({ ...paymentData, amountReceived: e.target.value })}
                    placeholder="0.00"
                    className="w-full px-3 py-2 rounded-lg border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-lg font-bold"
                  />
                </div>

                {paymentData.amountReceived && (
                  <div className="bg-success/20 rounded-lg p-3">
                    <p className="text-sm text-muted-foreground mb-1">Change Due:</p>
                    <p className="text-2xl font-bold text-success">
                      ₱{(parseFloat(paymentData.amountReceived) - selectedOrder.total).toFixed(2)}
                    </p>
                  </div>
                )}

                <div className="flex gap-2 pt-4">
                  <button
                    type="submit"
                    className="flex-1 flex items-center justify-center gap-2 bg-success text-success-foreground py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                  >
                    <DollarSign size={20} />
                    Process Payment
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowPaymentModal(false)}
                    className="flex-1 bg-muted text-muted-foreground py-2 rounded-lg font-semibold hover:bg-secondary transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Orders Queue */}
        <div className="space-y-4">
          {activeTab === 'pending' && (
            <>
              {pendingOrders.length === 0 ? (
                <div className="text-center py-12 bg-card rounded-xl border border-border">
                  <p className="text-muted-foreground mb-4">No pending orders</p>
                  <RefreshCw size={32} className="mx-auto text-muted-foreground opacity-50" />
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

                    {/* Items */}
                    <div className="bg-secondary/20 rounded-lg p-4 mb-4">
                      {order.items.map(item => (
                        <div key={item.id} className="flex justify-between text-sm mb-2 last:mb-0">
                          <span className="text-foreground">{item.quantity}x {item.name}</span>
                          <span className="font-semibold text-foreground">₱{(item.quantity * item.price).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>

                    {/* Totals */}
                    <div className="bg-secondary/20 rounded-lg p-4 mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Subtotal:</span>
                        <span className="text-foreground">₱{order.subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Tax + Service:</span>
                        <span className="text-foreground">₱{(order.tax + order.serviceCharge).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-bold text-lg border-t border-border pt-2">
                        <span className="text-foreground">Total:</span>
                        <span className="text-primary">₱{order.total.toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApproveOrder(order.id)}
                        className="flex-1 flex items-center justify-center gap-2 bg-success text-success-foreground py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                      >
                        <Check size={20} />
                        Approve Order
                      </button>
                      <button
                        onClick={() => handleRejectOrder(order.id)}
                        className="flex-1 flex items-center justify-center gap-2 bg-destructive text-destructive-foreground py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors"
                      >
                        <X size={20} />
                        Reject
                      </button>
                    </div>
                  </div>
                ))
              )}
            </>
          )}

          {activeTab === 'approved' && (
            <>
              {approvedOrders.length === 0 ? (
                <div className="text-center py-12 bg-card rounded-xl border border-border">
                  <p className="text-muted-foreground mb-4">No orders ready for payment</p>
                  <DollarSign size={32} className="mx-auto text-muted-foreground opacity-50" />
                </div>
              ) : (
                approvedOrders.map(order => (
                  <div key={order.id} className="bg-card rounded-xl border border-border p-6 hover:border-primary transition-colors">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-foreground">{order.id}</h3>
                        <p className="text-sm text-muted-foreground">Table {order.tableNumber} • {order.createdAt}</p>
                      </div>
                      <span className="px-3 py-1 rounded-full text-sm font-semibold bg-success/20 text-success">
                        Ready to Pay
                      </span>
                    </div>

                    {/* Items */}
                    <div className="bg-secondary/20 rounded-lg p-4 mb-4">
                      {order.items.map(item => (
                        <div key={item.id} className="flex justify-between text-sm mb-2 last:mb-0">
                          <span className="text-foreground">{item.quantity}x {item.name}</span>
                          <span className="font-semibold text-foreground">₱{(item.quantity * item.price).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>

                    {/* Totals */}
                    <div className="bg-secondary/20 rounded-lg p-4 mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Subtotal:</span>
                        <span className="text-foreground">₱{order.subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Tax + Service:</span>
                        <span className="text-foreground">₱{(order.tax + order.serviceCharge).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-bold text-lg border-t border-border pt-2">
                        <span className="text-foreground">Total:</span>
                        <span className="text-primary">₱{order.total.toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Payment Button */}
                    <button
                      onClick={() => handlePaymentClick(order)}
                      className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors text-lg"
                    >
                      <DollarSign size={24} />
                      Process Payment
                    </button>
                  </div>
                ))
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}
