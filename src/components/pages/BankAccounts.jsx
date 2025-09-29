import React, { useState, useEffect } from 'react';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Label from '@/components/atoms/Label';
import ApperIcon from '@/components/ApperIcon';
import Loading from '@/components/ui/Loading';
import Empty from '@/components/ui/Empty';
import Error from '@/components/ui/Error';
import { toast } from 'react-toastify';
import bankAccountService from '@/services/api/bankAccountService';

const BankAccounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(null);

  const [formData, setFormData] = useState({
    Name: '',
    Tags: '',
    account_name_c: '',
    account_number_c: '',
    bank_name_c: '',
    balance_c: ''
  });

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await bankAccountService.getAll();
      setAccounts(data);
    } catch (err) {
      setError('Failed to load bank accounts');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      Name: '',
      Tags: '',
      account_name_c: '',
      account_number_c: '',
      bank_name_c: '',
      balance_c: ''
    });
    setEditingAccount(null);
    setShowForm(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.Name.trim()) {
      toast.error('Account name is required');
      return false;
    }
    if (!formData.account_name_c.trim()) {
      toast.error('Account display name is required');
      return false;
    }
    if (!formData.account_number_c.trim()) {
      toast.error('Account number is required');
      return false;
    }
    if (!formData.bank_name_c.trim()) {
      toast.error('Bank name is required');
      return false;
    }
    if (!formData.balance_c || parseFloat(formData.balance_c) < 0) {
      toast.error('Please enter a valid balance amount');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setFormLoading(true);
    try {
      let result;
      if (editingAccount) {
        result = await bankAccountService.update(editingAccount.Id, formData);
      } else {
        result = await bankAccountService.create(formData);
      }

      if (result) {
        resetForm();
        loadAccounts();
      }
    } catch (error) {
      console.error('Error saving bank account:', error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (account) => {
    setEditingAccount(account);
    setFormData({
      Name: account.Name || '',
      Tags: account.Tags || '',
      account_name_c: account.account_name_c || '',
      account_number_c: account.account_number_c || '',
      bank_name_c: account.bank_name_c || '',
      balance_c: account.balance_c?.toString() || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (account) => {
    if (!confirm(`Are you sure you want to delete "${account.Name}"? This action cannot be undone.`)) {
      return;
    }

    setDeleteLoading(account.Id);
    try {
      const success = await bankAccountService.delete(account.Id);
      if (success) {
        loadAccounts();
      }
    } catch (error) {
      console.error('Error deleting bank account:', error);
    } finally {
      setDeleteLoading(null);
    }
  };

  const getTotalBalance = () => {
    return accounts.reduce((sum, account) => sum + (account.balance_c || 0), 0);
  };

  if (loading) return <Loading message="Loading bank accounts..." />;
  if (error) return <Error message={error} onRetry={loadAccounts} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Bank Accounts</h1>
          <p className="text-slate-600 mt-1">Manage your connected bank accounts</p>
        </div>
        <div className="flex items-center gap-3">
          {accounts.length > 0 && (
            <div className="text-sm text-slate-600 bg-slate-100 px-3 py-2 rounded-lg">
              Total Balance: {bankAccountService.formatCurrency(getTotalBalance())}
            </div>
          )}
          <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
            <ApperIcon name="Plus" className="w-4 h-4" />
            Add Account
          </Button>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-slate-900">
                  {editingAccount ? 'Edit Bank Account' : 'Add New Bank Account'}
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetForm}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <ApperIcon name="X" className="w-5 h-5" />
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="Name">Account Name *</Label>
                  <Input
                    id="Name"
                    name="Name"
                    value={formData.Name}
                    onChange={handleInputChange}
                    placeholder="My Checking Account"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="account_name_c">Display Name *</Label>
                  <Input
                    id="account_name_c"
                    name="account_name_c"
                    value={formData.account_name_c}
                    onChange={handleInputChange}
                    placeholder="Primary Checking"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="bank_name_c">Bank Name *</Label>
                  <Input
                    id="bank_name_c"
                    name="bank_name_c"
                    value={formData.bank_name_c}
                    onChange={handleInputChange}
                    placeholder="Chase Bank"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="account_number_c">Account Number *</Label>
                  <Input
                    id="account_number_c"
                    name="account_number_c"
                    value={formData.account_number_c}
                    onChange={handleInputChange}
                    placeholder="****1234"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="balance_c">Current Balance *</Label>
                  <Input
                    id="balance_c"
                    name="balance_c"
                    type="number"
                    step="0.01"
                    value={formData.balance_c}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="Tags">Tags</Label>
                  <Input
                    id="Tags"
                    name="Tags"
                    value={formData.Tags}
                    onChange={handleInputChange}
                    placeholder="checking,primary,main"
                  />
                  <p className="text-xs text-slate-500 mt-1">Separate multiple tags with commas</p>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button 
                    type="submit" 
                    disabled={formLoading}
                    className="flex-1"
                  >
                    {formLoading ? (
                      <>
                        <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                        {editingAccount ? 'Updating...' : 'Adding...'}
                      </>
                    ) : (
                      editingAccount ? 'Update Account' : 'Add Account'
                    )}
                  </Button>
                  <Button 
                    type="button" 
                    variant="secondary" 
                    onClick={resetForm}
                    disabled={formLoading}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </Card>
        </div>
      )}

      {/* Accounts List */}
      {accounts.length === 0 ? (
        <Empty 
          message="No bank accounts found"
          description="Add your first bank account to start tracking your finances"
          actionLabel="Add Bank Account"
          onAction={() => setShowForm(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {accounts.map((account) => (
            <Card key={account.Id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary-100 rounded-lg">
                    <ApperIcon name="CreditCard" className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 text-lg">
                      {account.account_name_c || account.Name}
                    </h3>
                    <p className="text-sm text-slate-500">{account.bank_name_c}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Account Number:</span>
                  <span className="text-sm font-mono text-slate-900">
                    {bankAccountService.formatAccountNumber(account.account_number_c)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Balance:</span>
                  <span className="text-lg font-semibold text-slate-900">
                    {bankAccountService.formatCurrency(account.balance_c)}
                  </span>
                </div>

                {account.Tags && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {account.Tags.split(',').map((tag, index) => (
                      <span 
                        key={index}
                        className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded-full"
                      >
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleEdit(account)}
                  className="flex-1 flex items-center justify-center gap-2"
                >
                  <ApperIcon name="Edit2" className="w-4 h-4" />
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(account)}
                  disabled={deleteLoading === account.Id}
                  className="flex items-center justify-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  {deleteLoading === account.Id ? (
                    <ApperIcon name="Loader2" className="w-4 h-4 animate-spin" />
                  ) : (
                    <ApperIcon name="Trash2" className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default BankAccounts;