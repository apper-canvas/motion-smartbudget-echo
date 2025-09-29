import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Label from "@/components/atoms/Label";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { bankAccountService } from "@/services/api/bankAccountService";
import { formatCurrency } from "@/utils/formatters";

const BankAccounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [formData, setFormData] = useState({
    accountName: "",
    accountNumber: "",
    bankName: "",
    balance: "",
    tags: ""
  });
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await bankAccountService.getAll();
      setAccounts(data);
    } catch (err) {
      setError("Failed to load bank accounts");
      console.error("Error loading bank accounts:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = () => {
    setEditingAccount(null);
    setFormData({
      accountName: "",
      accountNumber: "",
      bankName: "",
      balance: "",
      tags: ""
    });
    setShowForm(true);
  };

  const handleEdit = (account) => {
    setEditingAccount(account);
    setFormData({
      accountName: account.accountName || "",
      accountNumber: account.accountNumber || "",
      bankName: account.bankName || "",
      balance: account.balance?.toString() || "",
      tags: account.tags || ""
    });
    setShowForm(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.accountName.trim()) {
      toast.error("Account name is required");
      return;
    }

    if (!formData.bankName.trim()) {
      toast.error("Bank name is required");
      return;
    }

    try {
      setFormLoading(true);
      
      const accountData = {
        name: formData.accountName,
        accountName: formData.accountName,
        accountNumber: formData.accountNumber,
        bankName: formData.bankName,
        balance: parseFloat(formData.balance) || 0,
        tags: formData.tags
      };

      let result;
      if (editingAccount) {
        result = await bankAccountService.update(editingAccount.Id, accountData);
        if (result) {
          toast.success("Bank account updated successfully");
          setAccounts(prev => prev.map(acc => acc.Id === editingAccount.Id ? result : acc));
        }
      } else {
        result = await bankAccountService.create(accountData);
        if (result) {
          toast.success("Bank account created successfully");
          setAccounts(prev => [...prev, result]);
        }
      }

      if (result) {
        setShowForm(false);
        setFormData({
          accountName: "",
          accountNumber: "",
          bankName: "",
          balance: "",
          tags: ""
        });
      }
    } catch (err) {
      toast.error("Failed to save bank account");
      console.error("Error saving bank account:", err);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (account) => {
    if (!confirm(`Are you sure you want to delete ${account.accountName}? This action cannot be undone.`)) {
      return;
    }

    try {
      const success = await bankAccountService.delete(account.Id);
      if (success) {
        toast.success("Bank account deleted successfully");
        setAccounts(prev => prev.filter(acc => acc.Id !== account.Id));
      }
    } catch (err) {
      toast.error("Failed to delete bank account");
      console.error("Error deleting bank account:", err);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingAccount(null);
    setFormData({
      accountName: "",
      accountNumber: "",
      bankName: "",
      balance: "",
      tags: ""
    });
  };

  const totalBalance = accounts.reduce((sum, account) => sum + (account.balance || 0), 0);

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadAccounts} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Bank Accounts</h1>
          <p className="text-slate-600">Manage your bank accounts and balances</p>
        </div>
        <Button onClick={handleAddNew} className="flex items-center space-x-2">
          <ApperIcon name="Plus" className="w-4 h-4" />
          <span>Add Account</span>
        </Button>
      </div>

      {/* Total Balance Summary */}
      <Card className="bg-gradient-to-br from-primary-500 to-primary-600 text-white">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-primary-100 text-sm font-medium">Total Balance</p>
              <p className="text-3xl font-bold">{formatCurrency(totalBalance)}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <ApperIcon name="Building2" className="w-6 h-6" />
            </div>
          </div>
        </div>
      </Card>

      {/* Account Form */}
      {showForm && (
        <Card>
          <div className="p-6 border-b border-slate-200">
            <h3 className="text-lg font-semibold text-slate-800">
              {editingAccount ? "Edit Bank Account" : "Add New Bank Account"}
            </h3>
          </div>
          <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="accountName">Account Name *</Label>
                <Input
                  id="accountName"
                  value={formData.accountName}
                  onChange={(e) => setFormData(prev => ({...prev, accountName: e.target.value}))}
                  placeholder="My Checking Account"
                  required
                />
              </div>
              <div>
                <Label htmlFor="bankName">Bank Name *</Label>
                <Input
                  id="bankName"
                  value={formData.bankName}
                  onChange={(e) => setFormData(prev => ({...prev, bankName: e.target.value}))}
                  placeholder="Chase Bank"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="accountNumber">Account Number</Label>
                <Input
                  id="accountNumber"
                  value={formData.accountNumber}
                  onChange={(e) => setFormData(prev => ({...prev, accountNumber: e.target.value}))}
                  placeholder="****1234"
                />
              </div>
              <div>
                <Label htmlFor="balance">Current Balance</Label>
                <Input
                  id="balance"
                  type="number"
                  step="0.01"
                  value={formData.balance}
                  onChange={(e) => setFormData(prev => ({...prev, balance: e.target.value}))}
                  placeholder="0.00"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                value={formData.tags}
                onChange={(e) => setFormData(prev => ({...prev, tags: e.target.value}))}
                placeholder="checking,primary"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button type="button" variant="secondary" onClick={handleCancel}>
                Cancel
              </Button>
              <Button type="submit" disabled={formLoading}>
                {formLoading ? (
                  <>
                    <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                    {editingAccount ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  editingAccount ? "Update Account" : "Create Account"
                )}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Accounts List */}
      {accounts.length === 0 ? (
        <Empty
          title="No bank accounts found"
          description="Add your first bank account to start tracking your finances"
          action={
            <Button onClick={handleAddNew} className="flex items-center space-x-2">
              <ApperIcon name="Plus" className="w-4 h-4" />
              <span>Add Account</span>
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {accounts.map((account) => (
            <Card key={account.Id} className="hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                      <ApperIcon name="Building2" className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800">{account.accountName}</h3>
                      <p className="text-sm text-slate-600">{account.bankName}</p>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEdit(account)}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      <ApperIcon name="Edit2" className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(account)}
                      className="text-slate-400 hover:text-red-600"
                    >
                      <ApperIcon name="Trash2" className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Balance</span>
                    <span className="font-semibold text-lg text-slate-800">
                      {formatCurrency(account.balance || 0)}
                    </span>
                  </div>
                  
                  {account.accountNumber && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Account #</span>
                      <span className="text-sm text-slate-800">{account.accountNumber}</span>
                    </div>
                  )}

                  {account.tags && (
                    <div className="pt-2">
                      <div className="flex flex-wrap gap-1">
                        {account.tags.split(',').map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full"
                          >
                            {tag.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default BankAccounts;