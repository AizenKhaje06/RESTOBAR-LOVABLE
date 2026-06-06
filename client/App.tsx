import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Orders";
import Tables from "./pages/Tables";
import Menu from "./pages/Menu";
import Users from "./pages/Users";
import POSDashboard from "./pages/POSDashboard";
import WaiterDashboard from "./pages/WaiterDashboard";
import TableOrdering from "./pages/TableOrdering";
import OrderReview from "./pages/OrderReview";
import OrderSuccess from "./pages/OrderSuccess";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ProtectedRoute = ({ element }: { element: React.ReactNode }) => {
  const token = localStorage.getItem('token');
  return token ? element : <Navigate to="/login" replace />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
            <Route path="/orders" element={<ProtectedRoute element={<Orders />} />} />
            <Route path="/tables" element={<ProtectedRoute element={<Tables />} />} />
            <Route path="/menu" element={<ProtectedRoute element={<Menu />} />} />
            <Route path="/users" element={<ProtectedRoute element={<Users />} />} />
            <Route path="/pos" element={<ProtectedRoute element={<POSDashboard />} />} />
            <Route path="/waiter" element={<ProtectedRoute element={<WaiterDashboard />} />} />

            {/* Customer Table Ordering Routes (No Auth Required) */}
            <Route path="/table/:tableId" element={<TableOrdering />} />
            <Route path="/table/:tableId/review" element={<OrderReview />} />
            <Route path="/table/:tableId/success" element={<OrderSuccess />} />

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
