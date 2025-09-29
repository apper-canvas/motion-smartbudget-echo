import { toast } from "react-toastify";

export const bankAccountService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "account_name_c"}},
          {"field": {"Name": "account_number_c"}},
          {"field": {"Name": "bank_name_c"}},
          {"field": {"Name": "balance_c"}}
        ],
        orderBy: [{"fieldName": "account_name_c", "sorttype": "ASC"}]
      };

      const response = await apperClient.fetchRecords('bank_accounts_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data?.map(account => ({
        Id: account.Id,
        name: account.Name,
        tags: account.Tags,
        accountName: account.account_name_c,
        accountNumber: account.account_number_c,
        bankName: account.bank_name_c,
        balance: account.balance_c || 0
      })) || [];
    } catch (error) {
      console.error("Error fetching bank accounts:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getById(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "account_name_c"}},
          {"field": {"Name": "account_number_c"}},
          {"field": {"Name": "bank_name_c"}},
          {"field": {"Name": "balance_c"}}
        ]
      };

      const response = await apperClient.getRecordById('bank_accounts_c', parseInt(id), params);

      if (!response?.data) {
        return null;
      }

      const account = response.data;
      return {
        Id: account.Id,
        name: account.Name,
        tags: account.Tags,
        accountName: account.account_name_c,
        accountNumber: account.account_number_c,
        bankName: account.bank_name_c,
        balance: account.balance_c || 0
      };
    } catch (error) {
      console.error(`Error fetching bank account ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  },

  async create(accountData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Name: accountData.name || accountData.accountName,
          Tags: accountData.tags,
          account_name_c: accountData.accountName,
          account_number_c: accountData.accountNumber,
          bank_name_c: accountData.bankName,
          balance_c: accountData.balance || 0
        }]
      };

      const response = await apperClient.createRecord('bank_accounts_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} bank accounts:`, JSON.stringify(failed));
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          const created = successful[0].data;
          return {
            Id: created.Id,
            name: created.Name,
            tags: created.Tags,
            accountName: created.account_name_c,
            accountNumber: created.account_number_c,
            bankName: created.bank_name_c,
            balance: created.balance_c || 0
          };
        }
      }

      return null;
    } catch (error) {
      console.error("Error creating bank account:", error?.response?.data?.message || error);
      return null;
    }
  },

  async update(id, accountData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Id: parseInt(id),
          Name: accountData.name || accountData.accountName,
          Tags: accountData.tags,
          account_name_c: accountData.accountName,
          account_number_c: accountData.accountNumber,
          bank_name_c: accountData.bankName,
          balance_c: accountData.balance || 0
        }]
      };

      const response = await apperClient.updateRecord('bank_accounts_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} bank accounts:`, JSON.stringify(failed));
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          const updated = successful[0].data;
          return {
            Id: updated.Id,
            name: updated.Name,
            tags: updated.Tags,
            accountName: updated.account_name_c,
            accountNumber: updated.account_number_c,
            bankName: updated.bank_name_c,
            balance: updated.balance_c || 0
          };
        }
      }

      return null;
    } catch (error) {
      console.error("Error updating bank account:", error?.response?.data?.message || error);
      return null;
    }
  },

  async delete(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord('bank_accounts_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} bank accounts:`, JSON.stringify(failed));
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        return successful.length > 0;
      }

      return false;
    } catch (error) {
      console.error("Error deleting bank account:", error?.response?.data?.message || error);
      return false;
    }
  },

  async getTotalBalance() {
    try {
      const accounts = await this.getAll();
      return accounts.reduce((total, account) => total + (account.balance || 0), 0);
    } catch (error) {
      console.error("Error calculating total balance:", error);
      return 0;
    }
  }
};