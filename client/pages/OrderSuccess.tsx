import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle2, Clock } from 'lucide-react';

interface Order {
  id: string;
  tableNumber: string;
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
    notes?: string;
  }>;
  subtotal: number;
  tax: number;
  serviceCharge: number;
  total: number;
}

export default function OrderSuccess() {
  const { tableId } = useParams<{ tableId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [timeLeft, setTimeLeft] = useState(10);

  const state = location.state as { order: Order } | null;
  const order = state?.order;

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          navigate(`/table/${tableId}`);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate, tableId]);

  if (!order) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">No Order Found</h1>
          <button
            onClick={() => navigate(`/table/${tableId}`)}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
          >
            Back to Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-success/10 to-background flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Success Icon */}
        <div className="text-center mb-8 animate-bounce">
          <CheckCircle2 size={80} className="mx-auto text-success mb-4" />
        </div>

        {/* Main Message */}
        <div className="bg-card rounded-xl border border-border p-8 text-center space-y-6 mb-6">
          <div>
            <h1 className="text-4xl font-bold text-success mb-2">
              Order Successfully Submitted!
            </h1>
            <p className="text-lg text-foreground mb-4">
              {order.id}
            </p>
            <p className="text-muted-foreground">
              Please wait for waiter confirmation.
            </p>
          </div>

          {/* Order Summary */}
          <div className="bg-secondary/20 rounded-lg p-6 text-left space-y-2">
            <p className="text-sm text-muted-foreground">TABLE NUMBER</p>
            <p className="text-3xl font-bold text-foreground">{order.tableNumber}</p>
          </div>

          {/* Items Summary */}
          <div className="bg-secondary/20 rounded-lg p-6 text-left">
            <p className="text-sm text-muted-foreground mb-3">YOUR ORDER</p>
            <div className="space-y-2">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between">
                  <span className="text-foreground">{item.quantity}x {item.name}</span>
                  <span className="font-semibold text-foreground">₱{(item.quantity * item.price).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className="bg-primary/10 rounded-lg p-6 space-y-2">
            <div className="flex justify-between text-foreground mb-2">
              <span>Subtotal:</span>
              <span>₱{order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-foreground mb-2">
              <span>Tax + Service:</span>
              <span>₱{(order.tax + order.serviceCharge).toFixed(2)}</span>
            </div>
            <div className="border-t border-primary/20 pt-2 flex justify-between items-center">
              <span className="font-bold text-foreground">TOTAL DUE:</span>
              <span className="text-2xl font-bold text-primary">₱{order.total.toFixed(2)}</span>
            </div>
          </div>

          {/* Instructions */}
          <div className="space-y-3 pt-4 border-t border-border">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-success/20 text-success">
                  1
                </div>
              </div>
              <div className="text-left">
                <p className="font-semibold text-foreground">Prepare Exact Amount</p>
                <p className="text-sm text-muted-foreground">Please have ₱{order.total.toFixed(2)} ready for payment</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-info/20 text-info">
                  2
                </div>
              </div>
              <div className="text-left">
                <p className="font-semibold text-foreground">Waiter Confirmation</p>
                <p className="text-sm text-muted-foreground">Your order is being reviewed by our staff</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-warning/20 text-warning">
                  3
                </div>
              </div>
              <div className="text-left">
                <p className="font-semibold text-foreground">Food Preparation</p>
                <p className="text-sm text-muted-foreground">Kitchen is preparing your order</p>
              </div>
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <div className="bg-warning/20 border border-warning rounded-xl p-4 text-center mb-6">
          <div className="flex items-center justify-center gap-2 text-warning mb-2">
            <Clock size={20} />
            <span className="font-semibold">Status: PENDING CONFIRMATION</span>
          </div>
          <p className="text-sm text-warning">Your order is waiting for approval</p>
        </div>

        {/* Auto-redirect Message */}
        <div className="text-center text-muted-foreground text-sm">
          <p>Redirecting to menu in {timeLeft} seconds...</p>
          <button
            onClick={() => navigate(`/table/${tableId}`)}
            className="mt-3 text-primary hover:text-orange-600 font-semibold transition-colors"
          >
            Back to Menu Now
          </button>
        </div>
      </div>
    </div>
  );
}
