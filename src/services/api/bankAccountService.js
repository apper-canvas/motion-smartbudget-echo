import { toast } from 'react-toastify';

// Utility function for delays in development
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class BankAccountService {
  constructor() {
    this.tableName = 'bank_accounts_c';
  }

  async getAll() {
    try {
      await delay(300);
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "account_name_c" } },
          { field: { Name: "account_number_c" } },
          { field: { Name: "bank_name_c" } },
          { field: { Name: "balance_c" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "ModifiedOn" } }
        ],
        orderBy: [{ fieldName: "CreatedOn", sorttype: "DESC" }],
        pagingInfo: { limit: 50, offset: 0 }
      };

      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error('Error fetching bank accounts:', error?.response?.data?.message || error.message);
      toast.error('Failed to fetch bank accounts');
      return [];
    }
  }

  async getById(id) {
    try {
      await delay(200);
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "account_name_c" } },
          { field: { Name: "account_number_c" } },
          { field: { Name: "bank_name_c" } },
          { field: { Name: "balance_c" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "ModifiedOn" } }
        ]
      };

      const response = await apperClient.getRecordById(this.tableName, id, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching bank account ${id}:`, error?.response?.data?.message || error.message);
      toast.error('Failed to fetch bank account details');
      return null;
    }
  }

  async create(bankAccountData) {
    try {
      await delay(400);
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include updateable fields
      const params = {
        records: [
          {
            Name: bankAccountData.Name,
            Tags: bankAccountData.Tags || '',
            account_name_c: bankAccountData.account_name_c,
            account_number_c: bankAccountData.account_number_c,
            bank_name_c: bankAccountData.bank_name_c,
            balance_c: parseFloat(bankAccountData.balance_c) || 0
          }
        ]
      };

      const response = await apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} bank account records:${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.errors) {
              record.errors.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            }
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          toast.success('Bank account created successfully');
          return successful[0].data;
        }
      }
      
      return null;
    } catch (error) {
      console.error('Error creating bank account:', error?.response?.data?.message || error.message);
      toast.error('Failed to create bank account');
      return null;
    }
  }

  async update(id, bankAccountData) {
    try {
      await delay(400);
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include updateable fields
      const params = {
        records: [
          {
            Id: parseInt(id),
            Name: bankAccountData.Name,
            Tags: bankAccountData.Tags || '',
            account_name_c: bankAccountData.account_name_c,
            account_number_c: bankAccountData.account_number_c,
            bank_name_c: bankAccountData.bank_name_c,
            balance_c: parseFloat(bankAccountData.balance_c) || 0
          }
        ]
      };

      const response = await apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} bank account records:${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.errors) {
              record.errors.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            }
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          toast.success('Bank account updated successfully');
          return successful[0].data;
        }
      }
      
      return null;
    } catch (error) {
      console.error('Error updating bank account:', error?.response?.data?.message || error.message);
      toast.error('Failed to update bank account');
      return null;
    }
  }

  async delete(ids) {
    try {
      await delay(300);
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const recordIds = Array.isArray(ids) ? ids : [ids];
      const params = { 
        RecordIds: recordIds.map(id => parseInt(id))
      };

      const response = await apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} bank account records:${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          toast.success(`${successful.length} bank account${successful.length > 1 ? 's' : ''} deleted successfully`);
          return successful.length === recordIds.length;
        }
      }
      
      return false;
    } catch (error) {
      console.error('Error deleting bank accounts:', error?.response?.data?.message || error.message);
      toast.error('Failed to delete bank accounts');
      return false;
    }
  }

  formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  }

  formatAccountNumber(accountNumber) {
    if (!accountNumber) return '';
    // Mask account number, showing only last 4 digits
    return accountNumber.length > 4 ? 
      '****' + accountNumber.slice(-4) : accountNumber;
  }
}

export default new BankAccountService();