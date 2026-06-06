import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Check } from 'lucide-react';
import { toast } from 'sonner';

interface CartItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  notes?: string;
}

export default function OrderReview() {
  const { tableId } = useParams<{ tableId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const state = location.state as {
    cart: CartItem[];
    subtotal: number;
    tax: number;
    serviceCharge: number;
    total: number;
  } | null;

  if (!state || !state.cart || state.cart.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">No Order to Review</h1>
          <button
            onClick={() => navigate(`/table/${tableId}`)}
            className="flex items-center gap-2 mx-auto bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Menu
          </button>
        </div>
      </div>
    );
  }

  const { cart, subtotal, tax, serviceCharge, total } = state;

  const handleSubmitOrder = async () => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const orderData = {
        tableNumber: tableId,
        items: cart,
        subtotal,
        tax,
        serviceCharge,
        total,
      };

      navigate(`/table/${tableId}/success`, { 
        state: { 
          order: {
            id: `ORD-${Date.now()}`,
            ...orderData
          }
        } 
      });

      toast.success('Order submitted!');
    } catch (error) {
      toast.error('Failed to submit order');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate(`/table/${tableId}`)}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            <ArrowLeft size={24} className="text-foreground" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Review Your Order</h1>
            <p className="text-sm text-muted-foreground">Table {tableId}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Order Items */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h2 className="text-xl font-bold text-foreground mb-4">Order Items</h2>
            <div className="space-y-4">
              {cart.map((item, index) => (
                <div key={index} className="border-b border-border pb-4 last:border-b-0 last:pb-0">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">{item.quantity}x {item.name}</h3>
                      {item.notes && (
                        <p className="text-sm text-warning mt-1">📝 {item.notes}</p>
                      )}
                    </div>
                    <p className="text-lg font-bold text-primary">₱{(item.quantity * item.price).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className="bg-secondary/20 rounded-xl border border-border p-6 space-y-3">
            <div className="flex justify-between text-foreground">
              <span>Subtotal:</span>
              <span>₱{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-foreground">
              <span>Tax (12%):</span>
              <span>₱{tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-foreground">
              <span>Service Charge (10%):</span>
              <span>₱{serviceCharge.toFixed(2)}</span>
            </div>
            <div className="border-t border-border pt-3 flex justify-between items-center">
              <span className="text-lg font-bold text-foreground">Grand Total:</span>
              <span className="text-2xl font-bold text-primary">₱{total.toFixed(2)}</span>
            </div>
          </div>

          {/* Info Message */}
          <div className="bg-info/20 rounded-xl border border-info p-4">
            <p className="text-sm text-info">
              ℹ️ Please prepare the exact amount for payment. Your order will be reviewed and served to your table.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => navigate(`/table/${tableId}`)}
              className="flex-1 bg-secondary/20 text-foreground py-3 rounded-lg font-semibold hover:bg-secondary/40 transition-colors"
            >
              ← Back to Menu
            </button>
            <button
              onClick={handleSubmitOrder}
              disabled={isSubmitting}
              className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50"
            >
              <Check size={20} />
              {isSubmitting ? 'Submitting...' : 'Confirm Order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
