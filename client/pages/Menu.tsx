import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Plus, Edit2, Trash2, Search, Upload, X } from 'lucide-react';
import { toast } from 'sonner';
import { uploadMenuImage, deleteMenuImage } from '@/lib/supabase';

interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  available: boolean;
  image?: string;
}

const mockMenuItems: MenuItem[] = [
  { id: '1', name: 'Burger', category: 'Food', price: 250, description: 'Classic beef burger', available: true, image: 'https://via.placeholder.com/300x200?text=Burger' },
  { id: '2', name: 'Pizza Margherita', category: 'Food', price: 380, description: 'Fresh mozzarella and basil', available: true, image: 'https://via.placeholder.com/300x200?text=Pizza' },
  { id: '3', name: 'Caesar Salad', category: 'Food', price: 220, description: 'Crisp romaine with parmesan', available: true, image: 'https://via.placeholder.com/300x200?text=Salad' },
  { id: '4', name: 'Coca-Cola', category: 'Drinks', price: 80, description: 'Cold soft drink', available: true, image: 'https://via.placeholder.com/300x200?text=Coke' },
  { id: '5', name: 'Iced Tea', category: 'Drinks', price: 70, description: 'Fresh iced tea', available: true, image: 'https://via.placeholder.com/300x200?text=Tea' },
  { id: '6', name: 'San Miguel Beer', category: 'Beer', price: 120, description: 'Local beer', available: true, image: 'https://via.placeholder.com/300x200?text=Beer' },
  { id: '7', name: 'Margarita', category: 'Cocktail', price: 280, description: 'Tequila-based cocktail', available: true, image: 'https://via.placeholder.com/300x200?text=Margarita' },
  { id: '8', name: 'Tiramisu', category: 'Dessert', price: 180, description: 'Classic Italian dessert', available: true, image: 'https://via.placeholder.com/300x200?text=Tiramisu' },
];

const categories = ['Food', 'Drinks', 'Beer', 'Cocktail', 'Liquor', 'Dessert', 'Add-ons'];

export default function Menu() {
  const [items, setItems] = useState<MenuItem[]>(mockMenuItems);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Food',
    price: '',
    description: '',
    available: true,
    image: '',
  });
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddItem = () => {
    setEditingId(null);
    setFormData({ name: '', category: 'Food', price: '', description: '', available: true, image: '' });
    setPreviewImage(null);
    setShowForm(true);
  };

  const handleEditItem = (item: MenuItem) => {
    setEditingId(item.id);
    setFormData({
      name: item.name,
      category: item.category,
      price: item.price.toString(),
      description: item.description,
      available: item.available,
      image: item.image || '',
    });
    setPreviewImage(item.image || null);
    setShowForm(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    setIsUploading(true);
    try {
      const imageUrl = await uploadMenuImage(file);
      if (imageUrl) {
        setFormData({ ...formData, image: imageUrl });
        setPreviewImage(imageUrl);
        toast.success('Image uploaded successfully');
      } else {
        toast.error('Failed to upload image. Make sure Supabase is configured.');
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = async () => {
    if (formData.image && editingId) {
      try {
        await deleteMenuImage(formData.image);
      } catch (error) {
        console.error('Error deleting image:', error);
      }
    }
    setFormData({ ...formData, image: '' });
    setPreviewImage(null);
  };

  const handleDeleteItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
    toast.success('Menu item deleted');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.price || !formData.description) {
      toast.error('Please fill all fields');
      return;
    }

    if (editingId) {
      setItems(items.map(item =>
        item.id === editingId
          ? {
              ...item,
              name: formData.name,
              category: formData.category,
              price: parseFloat(formData.price),
              description: formData.description,
              available: formData.available,
              image: formData.image,
            }
          : item
      ));
      toast.success('Menu item updated');
    } else {
      const newItem: MenuItem = {
        id: Date.now().toString(),
        name: formData.name,
        category: formData.category,
        price: parseFloat(formData.price),
        description: formData.description,
        available: formData.available,
        image: formData.image,
      };
      setItems([...items, newItem]);
      toast.success('Menu item added');
    }

    setShowForm(false);
    setFormData({ name: '', category: 'Food', price: '', description: '', available: true, image: '' });
    setPreviewImage(null);
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Menu Management</h1>
            <p className="text-muted-foreground">Create and manage menu items</p>
          </div>
          <button
            onClick={handleAddItem}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
          >
            <Plus size={20} />
            Add Item
          </button>
        </div>

        {/* Search & Filter */}
        <div className="flex gap-4 flex-col md:flex-row">
          <div className="flex-1 relative">
            <Search size={20} className="absolute left-3 top-3 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Add/Edit Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-card rounded-xl p-6 max-w-md w-full border border-border my-4">
              <h2 className="text-xl font-bold text-foreground mb-4">
                {editingId ? 'Edit Item' : 'Add New Item'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Item Image</label>
                  {previewImage ? (
                    <div className="relative mb-2">
                      <img
                        src={previewImage}
                        alt="Preview"
                        className="w-full h-40 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute top-2 right-2 p-1 bg-destructive rounded-lg hover:bg-destructive/80 transition-colors"
                      >
                        <X size={18} className="text-white" />
                      </button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-border rounded-lg p-4 text-center mb-2">
                      <p className="text-muted-foreground text-sm">No image yet</p>
                    </div>
                  )}
                  <label className="flex items-center justify-center gap-2 bg-secondary/20 hover:bg-secondary/40 text-foreground py-2 px-3 rounded-lg cursor-pointer transition-colors">
                    <Upload size={18} />
                    <span className="text-sm font-medium">
                      {isUploading ? 'Uploading...' : 'Upload Image'}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={isUploading}
                      className="hidden"
                    />
                  </label>
                  <p className="text-xs text-muted-foreground mt-1">Max 5MB. JPEG, PNG, WebP</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Item Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Price (₱)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary h-20 resize-none"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.available}
                    onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                    className="w-4 h-4 rounded border-border"
                  />
                  <label className="text-sm text-foreground">Available</label>
                </div>

                <div className="flex gap-2 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-primary text-primary-foreground py-2 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
                  >
                    {editingId ? 'Update' : 'Add'}
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

        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map(item => (
            <div key={item.id} className="bg-card rounded-xl border border-border overflow-hidden hover:border-primary transition-colors flex flex-col">
              {/* Image */}
              {item.image && (
                <div className="w-full h-40 bg-muted overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                  />
                </div>
              )}

              <div className="p-6 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-foreground text-lg">{item.name}</h3>
                    <p className="text-xs text-muted-foreground">{item.category}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-semibold whitespace-nowrap ml-2 ${
                    item.available
                      ? 'bg-success/20 text-success'
                      : 'bg-destructive/20 text-destructive'
                  }`}>
                    {item.available ? 'Available' : 'Unavailable'}
                  </span>
                </div>

                <p className="text-sm text-muted-foreground mb-4 flex-1">{item.description}</p>

                <div className="flex justify-between items-center pt-4 border-t border-border">
                  <p className="text-xl font-bold text-primary">₱{item.price.toFixed(2)}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditItem(item)}
                      className="p-2 hover:bg-secondary rounded-lg transition-colors"
                    >
                      <Edit2 size={18} className="text-primary" />
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="p-2 hover:bg-secondary rounded-lg transition-colors"
                    >
                      <Trash2 size={18} className="text-destructive" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No menu items found</p>
            <button
              onClick={handleAddItem}
              className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
            >
              Add First Item
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
}
