import React, { useContext } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { AuthContext } from "@/App";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import NavigationItem from "@/components/molecules/NavigationItem";

const Sidebar = ({ isOpen, onClose }) => {
  const { logout } = useContext(AuthContext);
  const location = useLocation();

  const navigationItems = [
    { path: '/', label: 'Dashboard', icon: 'LayoutDashboard' },
    { path: '/transactions', label: 'Transactions', icon: 'ArrowUpDown' },
    { path: '/budget', label: 'Budget', icon: 'PieChart' },
    { path: '/goals', label: 'Goals', icon: 'Target' },
    { path: '/bank-accounts', label: 'Bank Accounts', icon: 'CreditCard' },
    { path: '/reports', label: 'Reports', icon: 'FileBarChart' }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Mobile overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          />
          
          {/* Sidebar */}
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: "spring", damping: 25, stiffness: 120 }}
            className="fixed top-0 left-0 h-full w-72 bg-white/95 backdrop-blur-xl border-r border-slate-200/50 z-50 flex flex-col shadow-xl"
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-200/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                    S
                  </div>
                  <div>
                    <h2 className="font-bold text-slate-900 text-lg">SmartBudget</h2>
                    <p className="text-xs text-slate-500">Financial Management</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="lg:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <ApperIcon name="X" className="w-5 h-5 text-slate-600" />
                </button>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 overflow-y-auto">
              <div className="space-y-1">
                {navigationItems.map((item) => (
                  <NavigationItem
                    key={item.path}
                    {...item}
                    isActive={location.pathname === item.path}
                    onClick={onClose}
                  />
                ))}
              </div>
            </nav>

{/* Footer */}
            <div className="p-4 border-t border-slate-200/50">
              <button
                onClick={logout}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors"
              >
                <ApperIcon name="LogOut" className="w-4 h-4" />
                Logout
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;