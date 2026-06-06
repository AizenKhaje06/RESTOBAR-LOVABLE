import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, Minus, ShoppingCart, Search, X } from 'lucide-react';
import { toast } from 'sonner';

interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  image?: string;
}

interface CartItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  notes?: string;
}

const mockMenuItems: MenuItem[] = [
  { id: '1', name: 'Burger', category: 'Food', price: 250, description: 'Classic beef burger with crispy fries', image: 'https://via.placeholder.com/300x200?text=Burger' },
  { id: '2', name: 'Pizza Margherita', category: 'Food', price: 380, description: 'Fresh mozzarella and basil', image: 'https://via.placeholder.com/300x200?text=Pizza' },
  { id: '3', name: 'Caesar Salad', category: 'Food', price: 220, description: 'Crisp romaine with parmesan', image: 'https://via.placeholder.com/300x200?text=Salad' },
  { id: '4', name: 'Pasta Carbonara', category: 'Food', price: 320, description: 'Creamy pasta with bacon and eggs', image: 'https://via.placeholder.com/300x200?text=Pasta' },
  { id: '5', name: 'Coca-Cola', category: 'Drinks', price: 80, description: 'Cold soft drink', image: 'https://via.placeholder.com/300x200?text=Coke' },
  { id: '6', name: 'Iced Tea', category: 'Drinks', price: 70, description: 'Fresh iced tea', image: 'https://via.placeholder.com/300x200?text=Tea' },
  { id: '7', name: 'Orange Juice', category: 'Drinks', price: 90, description: 'Fresh squeezed orange juice', image: 'https://via.placeholder.com/300x200?text=Juice' },
  { id: '8', name: 'San Miguel Beer', category: 'Beer', price: 120, description: 'Local premium beer', image: 'https://via.placeholder.com/300x200?text=Beer' },
  { id: '9', name: 'Margarita', category: 'Cocktail', price: 280, description: 'Tequila-based cocktail', image: 'https://via.placeholder.com/300x200?text=Margarita' },
  { id: '10', name: 'Mojito', category: 'Cocktail', price: 250, description: 'Refreshing mint cocktail', image: 'https://via.placeholder.com/300x200?text=Mojito' },
  { id: '11', name: 'Tiramisu', category: 'Dessert', price: 180, description: 'Classic Italian dessert', image: 'https://via.placeholder.com/300x200?text=Tiramisu' },
  { id: '12', name: 'Chocolate Cake', category: 'Dessert', price: 200, description: 'Rich chocolate cake', image: 'https://via.placeholder.com/300x200?text=Cake' },
];

const categories = ['Food', 'Drinks', 'Beer', 'Cocktail', 'Dessert'];

export default function TableOrdering() {
  const { tableId } = useParams<{ tableId: string }>();
  const navigate = useNavigate();

  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showCart, setShowCart] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [noteItem, setNoteItem] = useState<CartItem | null>(null);
  const [itemNote, setItemNote] = useState('');

  const filteredItems = mockMenuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (item: MenuItem) => {
    const existingItem = cart.find(c => c.id === item.id);
    if (existingItem) {
      setCart(cart.map(c =>
        c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c
      ));
    } else {
      setCart([...cart, {
        id: item.id,
        name: item.name,
        quantity: 1,
        price: item.price,
      }]);
    }
    toast.success(`${item.name} added to cart`);
  };

  const removeFromCart = (itemId: string) => {
    setCart(cart.filter(c => c.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
    } else {
      setCart(cart.map(c =>
        c.id === itemId ? { ...c, quantity } : c
      ));
    }
  };

  const addNote = (item: CartItem) => {
    setNoteItem(item);
    setItemNote(item.notes || '');
    setShowNoteModal(true);
  };

  const saveNote = () => {
    if (noteItem) {
      setCart(cart.map(c =>
        c.id === noteItem.id ? { ...c, notes: itemNote } : c
      ));
      setShowNoteModal(false);
      toast.success('Note added');
    }
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.12;
  const serviceCharge = subtotal * 0.10;
  const total = subtotal + tax + serviceCharge;

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error('Cart is empty');
      return;
    }
    navigate(`/table/${tableId}/review`, { state: { cart, subtotal, tax, serviceCharge, total } });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-foreground">🍽️ RestauBar Menu</h1>
            <p className="text-sm text-muted-foreground">Table {tableId}</p>
          </div>
          <button
            onClick={() => setShowCart(!showCart)}
            className="relative p-3 bg-primary text-primary-foreground rounded-lg hover:bg-orange-600 transition-colors"
          >
            <ShoppingCart size={24} />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                {cart.length}
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="flex h-screen">
        {/* Main Content */}
        <div className={`flex-1 overflow-y-auto transition-all ${showCart ? 'md:w-2/3' : 'w-full'}`}>
          <div className="max-w-7xl mx-auto p-4">
            {/* Search & Filter */}
            <div className="sticky top-20 z-30 bg-background py-4 space-y-4">
              <div className="relative">
                <Search size={20} className="absolute left-3 top-3 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search menu..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Categories */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                <button
                  onClick={() => setSelectedCategory('')}
                  className={`px-4 py-2 rounded-full font-semibold whitespace-nowrap transition-colors ${
                    selectedCategory === ''
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary/20 text-foreground hover:bg-secondary/40'
                  }`}
                >
                  All
                </button>
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-full font-semibold whitespace-nowrap transition-colors ${
                      selectedCategory === cat
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary/20 text-foreground hover:bg-secondary/40'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Menu Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-8">
              {filteredItems.map(item => (
                <div key={item.id} className="bg-card rounded-xl border border-border overflow-hidden hover:border-primary transition-colors">
                  {item.image && (
                    <div className="w-full h-40 bg-muted overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                      />
                    </div>
                  )}

                  <div className="p-4">
                    <h3 className="font-semibold text-foreground text-lg mb-1">{item.name}</h3>
                    <p className="text-xs text-muted-foreground mb-2">{item.category}</p>
                    <p className="text-sm text-muted-foreground mb-4">{item.description}</p>

                    <div className="flex justify-between items-center pt-4 border-t border-border">
                      <p className="text-lg font-bold text-primary">₱{item.price.toFixed(2)}</p>
                      <button
                        onClick={() => addToCart(item)}
                        className="p-2 bg-primary text-primary-foreground rounded-lg hover:bg-orange-600 transition-colors"
                      >
                        <Plus size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Cart Sidebar */}
        {showCart && (
          <div className="w-full md:w-1/3 bg-card border-l border-border p-4 overflow-y-auto flex flex-col h-screen">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-foreground">Your Order</h2>
              <button
                onClick={() => setShowCart(false)}
                className="p-2 hover:bg-secondary rounded-lg transition-colors md:hidden"
              >
                <X size={20} />
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-center">
                <p className="text-muted-foreground">Cart is empty</p>
              </div>
            ) : (
              <>
                {/* Cart Items */}
                <div className="flex-1 space-y-3 mb-4">
                  {cart.map(item => (
                    <div key={item.id} className="bg-secondary/20 rounded-lg p-3">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h4 className="font-medium text-foreground">{item.name}</h4>
                          {item.notes && (
                            <p className="text-xs text-warning mt-1">Note: {item.notes}</p>
                          )}
                        </div>
                        <p className="font-semibold text-primary">₱{(item.price * item.quantity).toFixed(2)}</p>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 bg-background rounded-lg p-1">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 hover:bg-secondary rounded"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="w-6 text-center font-semibold">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 hover:bg-secondary rounded"
                          >
                            <Plus size={16} />
                          </button>
                        </div>

                        <div className="flex gap-1">
                          <button
                            onClick={() => addNote(item)}
                            className="px-2 py-1 text-xs bg-info/20 text-info rounded hover:bg-info/30 transition-colors"
                          >
                            Note
                          </button>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="px-2 py-1 text-xs bg-destructive/20 text-destructive rounded hover:bg-destructive/30 transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="space-y-2 bg-secondary/20 rounded-lg p-4 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal:</span>
                    <span className="text-foreground">₱{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax (12%):</span>
                    <span className="text-foreground">₱{tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Service (10%):</span>
                    <span className="text-foreground">₱{serviceCharge.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t border-border pt-2">
                    <span className="text-foreground">Total:</span>
                    <span className="text-primary">₱{total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={handleCheckout}
                  className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors text-lg"
                >
                  Review Order
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Note Modal */}
      {showNoteModal && noteItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-xl p-6 max-w-md w-full border border-border">
            <h2 className="text-xl font-bold text-foreground mb-4">Add Special Request</h2>
            <p className="text-sm text-muted-foreground mb-3">{noteItem.name}</p>

            <textarea
              value={itemNote}
              onChange={(e) => setItemNote(e.target.value)}
              placeholder="E.g., No onions, Extra sauce, Spicy, etc."
              className="w-full px-3 py-2 rounded-lg border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary h-20 resize-none mb-4"
            />

            <div className="flex gap-2">
              <button
                onClick={saveNote}
                className="flex-1 bg-primary text-primary-foreground py-2 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
              >
                Save
              </button>
              <button
                onClick={() => setShowNoteModal(false)}
                className="flex-1 bg-muted text-muted-foreground py-2 rounded-lg font-semibold hover:bg-secondary transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
