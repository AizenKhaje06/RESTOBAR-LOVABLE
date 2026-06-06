import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Menu, X, LogOut, BarChart3, ShoppingCart, Users, Utensils } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    {
      label: 'Dashboard',
      href: '/dashboard',
      icon: BarChart3,
      visible: ['admin'],
    },
    {
      label: 'Orders',
      href: '/orders',
      icon: ShoppingCart,
      visible: ['admin'],
    },
    {
      label: 'Tables',
      href: '/tables',
      icon: Utensils,
      visible: ['admin'],
    },
    {
      label: 'Menu Management',
      href: '/menu',
      icon: Utensils,
      visible: ['admin'],
    },
    {
      label: 'Users',
      href: '/users',
      icon: Users,
      visible: ['admin'],
    },
    {
      label: 'POS System',
      href: '/pos',
      icon: ShoppingCart,
      visible: ['pos'],
    },
    {
      label: 'Orders',
      href: '/waiter',
      icon: Utensils,
      visible: ['waiter'],
    },
  ];

  const visibleNavItems = navItems.filter(
    (item) => item.visible.includes(user?.role || '')
  );

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-sidebar text-sidebar-foreground transition-all duration-300 flex flex-col border-r border-sidebar-border`}
      >
        {/* Logo */}
        <div className="p-4 flex items-center gap-3 border-b border-sidebar-border">
          <div className="w-10 h-10 bg-sidebar-primary rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-lg">🍽️</span>
          </div>
          {sidebarOpen && <span className="font-bold text-lg">RestauBar</span>}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {visibleNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(item.href);
                }}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-sidebar-accent text-sidebar-foreground transition-colors"
              >
                <Icon size={20} />
                {sidebarOpen && <span>{item.label}</span>}
              </a>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-sidebar-border space-y-3">
          {sidebarOpen && (
            <div className="text-sm">
              <p className="font-medium">{user?.name}</p>
              <p className="text-xs text-sidebar-foreground/70 capitalize">{user?.role}</p>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-destructive text-sidebar-foreground transition-colors text-sm"
          >
            <LogOut size={18} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-card border-b border-border px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-semibold text-foreground capitalize">{user?.role} Panel</p>
              <p className="text-xs text-muted-foreground">{user?.name}</p>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto bg-background">
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
