import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Plus, Edit2, Trash2, Download, QrCode } from 'lucide-react';
import { toast } from 'sonner';

interface Table {
  id: string;
  tableNumber: number;
  capacity: number;
  status: 'available' | 'occupied' | 'ordering' | 'preparing' | 'ready' | 'served' | 'paid';
  qrCode: string;
}

const mockTables: Table[] = [
  { id: '1', tableNumber: 1, capacity: 2, status: 'available', qrCode: 'table_1_qr' },
  { id: '2', tableNumber: 2, capacity: 2, status: 'occupied', qrCode: 'table_2_qr' },
  { id: '3', tableNumber: 3, capacity: 4, status: 'available', qrCode: 'table_3_qr' },
  { id: '4', tableNumber: 4, capacity: 4, status: 'ordering', qrCode: 'table_4_qr' },
  { id: '5', tableNumber: 5, capacity: 6, status: 'preparing', qrCode: 'table_5_qr' },
  { id: '6', tableNumber: 6, capacity: 6, status: 'available', qrCode: 'table_6_qr' },
];

const statusColors = {
  available: 'bg-success/20 text-success',
  occupied: 'bg-primary/20 text-primary',
  ordering: 'bg-warning/20 text-warning',
  preparing: 'bg-warning/20 text-warning',
  ready: 'bg-info/20 text-info',
  served: 'bg-purple-500/20 text-purple-500',
  paid: 'bg-muted/20 text-muted-foreground',
};

const statusLabels = {
  available: 'Available',
  occupied: 'Occupied',
  ordering: 'Ordering',
  preparing: 'Preparing',
  ready: 'Ready',
  served: 'Served',
  paid: 'Paid',
};

// Simple SVG QR Code generator (mock)
const generateQRSvg = (text: string) => {
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect fill='white' width='200' height='200'/%3E%3Ctext x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-size='14' fill='black'%3E${encodeURIComponent(text)}%3C/text%3E%3C/svg%3E`;
};

export default function Tables() {
  const [tables, setTables] = useState<Table[]>(mockTables);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [showQRModal, setShowQRModal] = useState(false);
  const [formData, setFormData] = useState({
    tableNumber: '',
    capacity: '2',
  });

  const handleAddTable = () => {
    setEditingId(null);
    setFormData({ tableNumber: '', capacity: '2' });
    setShowForm(true);
  };

  const handleEditTable = (table: Table) => {
    setEditingId(table.id);
    setFormData({
      tableNumber: table.tableNumber.toString(),
      capacity: table.capacity.toString(),
    });
    setShowForm(true);
  };

  const handleDeleteTable = (id: string) => {
    setTables(tables.filter(table => table.id !== id));
    toast.success('Table deleted');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.tableNumber || !formData.capacity) {
      toast.error('Please fill all fields');
      return;
    }

    const tableNumber = parseInt(formData.tableNumber);
    
    if (editingId) {
      setTables(tables.map(table =>
        table.id === editingId
          ? { ...table, tableNumber, capacity: parseInt(formData.capacity) }
          : table
      ));
      toast.success('Table updated');
    } else {
      // Check if table number already exists
      if (tables.some(t => t.tableNumber === tableNumber)) {
        toast.error('Table number already exists');
        return;
      }

      const newTable: Table = {
        id: Date.now().toString(),
        tableNumber,
        capacity: parseInt(formData.capacity),
        status: 'available',
        qrCode: `table_${tableNumber}_qr`,
      };
      setTables([...tables, newTable]);
      toast.success('Table created');
    }

    setShowForm(false);
    setFormData({ tableNumber: '', capacity: '2' });
  };

  const handleViewQR = (table: Table) => {
    setSelectedTable(table);
    setShowQRModal(true);
  };

  const handleDownloadQR = (table: Table) => {
    const qrUrl = generateQRSvg(`table_${table.tableNumber}`);
    const link = document.createElement('a');
    link.href = qrUrl;
    link.download = `table-${table.tableNumber}-qr.svg`;
    link.click();
    toast.success('QR code downloaded');
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Table Management</h1>
            <p className="text-muted-foreground">Manage tables and QR codes</p>
          </div>
          <button
            onClick={handleAddTable}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
          >
            <Plus size={20} />
            Add Table
          </button>
        </div>

        {/* Add/Edit Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-card rounded-xl p-6 max-w-md w-full border border-border">
              <h2 className="text-xl font-bold text-foreground mb-4">
                {editingId ? 'Edit Table' : 'Add New Table'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Table Number</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.tableNumber}
                    onChange={(e) => setFormData({ ...formData, tableNumber: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Capacity (Persons)</label>
                  <select
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="2">2 Persons</option>
                    <option value="4">4 Persons</option>
                    <option value="6">6 Persons</option>
                    <option value="8">8 Persons</option>
                  </select>
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

        {/* QR Code Modal */}
        {showQRModal && selectedTable && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-card rounded-xl p-8 max-w-sm w-full border border-border text-center">
              <h2 className="text-xl font-bold text-foreground mb-6">Table {selectedTable.tableNumber} QR Code</h2>
              <div className="bg-white p-4 rounded-lg mb-6">
                <img
                  src={generateQRSvg(`table_${selectedTable.tableNumber}`)}
                  alt={`Table ${selectedTable.tableNumber} QR Code`}
                  className="w-full"
                />
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Scan this code to access the menu for Table {selectedTable.tableNumber}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleDownloadQR(selectedTable)}
                  className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground py-2 rounded-lg hover:bg-orange-600 transition-colors"
                >
                  <Download size={18} />
                  Download
                </button>
                <button
                  onClick={() => setShowQRModal(false)}
                  className="flex-1 bg-muted text-muted-foreground py-2 rounded-lg hover:bg-secondary transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tables Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tables.map(table => (
            <div key={table.id} className="bg-card rounded-xl border border-border p-6 hover:border-primary transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-foreground">Table {table.tableNumber}</h3>
                  <p className="text-sm text-muted-foreground">{table.capacity} Persons</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[table.status]}`}>
                  {statusLabels[table.status]}
                </span>
              </div>

              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => handleViewQR(table)}
                  className="flex-1 flex items-center justify-center gap-2 bg-info/20 text-info px-3 py-2 rounded-lg hover:bg-info/30 transition-colors text-sm font-semibold"
                >
                  <QrCode size={16} />
                  QR Code
                </button>
              </div>

              <div className="flex gap-2 pt-4 border-t border-border">
                <button
                  onClick={() => handleEditTable(table)}
                  className="flex-1 p-2 hover:bg-secondary rounded-lg transition-colors flex items-center justify-center"
                >
                  <Edit2 size={18} className="text-primary" />
                </button>
                <button
                  onClick={() => handleDeleteTable(table.id)}
                  className="flex-1 p-2 hover:bg-secondary rounded-lg transition-colors flex items-center justify-center"
                >
                  <Trash2 size={18} className="text-destructive" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {tables.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No tables yet</p>
            <button
              onClick={handleAddTable}
              className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
            >
              Add First Table
            </button>
          </div>
        )}

        {/* Table Status Legend */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="font-semibold text-foreground mb-4">Table Status Guide</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(statusLabels).map(([status, label]) => (
              <div key={status} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${statusColors[status as keyof typeof statusColors].split(' ')[0]}`} />
                <span className="text-sm text-foreground">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
