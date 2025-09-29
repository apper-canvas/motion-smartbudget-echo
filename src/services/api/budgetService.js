import { toast } from "react-toastify";

export const budgetService = {
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
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "monthly_limit_c"}},
          {"field": {"Name": "month_c"}},
          {"field": {"Name": "year_c"}}
        ]
      };

      const response = await apperClient.fetchRecords('budget_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data?.map(budget => ({
        Id: budget.Id,
        category: budget.category_c,
        monthlyLimit: budget.monthly_limit_c,
        month: budget.month_c,
        year: budget.year_c
      })) || [];
    } catch (error) {
      console.error("Error fetching budgets:", error?.response?.data?.message || error);
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
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "monthly_limit_c"}},
          {"field": {"Name": "month_c"}},
          {"field": {"Name": "year_c"}}
        ]
      };

      const response = await apperClient.getRecordById('budget_c', parseInt(id), params);

      if (!response?.data) {
        return null;
      }

      const budget = response.data;
      return {
        Id: budget.Id,
        category: budget.category_c,
        monthlyLimit: budget.monthly_limit_c,
        month: budget.month_c,
        year: budget.year_c
      };
    } catch (error) {
      console.error(`Error fetching budget ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  },

  async create(budgetData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Name: `${budgetData.category} Budget`,
          category_c: budgetData.category,
          monthly_limit_c: budgetData.monthlyLimit,
          month_c: budgetData.month,
          year_c: budgetData.year
        }]
      };

      const response = await apperClient.createRecord('budget_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} budgets:`, JSON.stringify(failed));
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          const created = successful[0].data;
          return {
            Id: created.Id,
            category: created.category_c,
            monthlyLimit: created.monthly_limit_c,
            month: created.month_c,
            year: created.year_c
          };
        }
      }

      return null;
    } catch (error) {
      console.error("Error creating budget:", error?.response?.data?.message || error);
      return null;
    }
  },

  async update(id, budgetData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Id: parseInt(id),
          Name: `${budgetData.category} Budget`,
          category_c: budgetData.category,
          monthly_limit_c: budgetData.monthlyLimit,
          month_c: budgetData.month,
          year_c: budgetData.year
        }]
      };

      const response = await apperClient.updateRecord('budget_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} budgets:`, JSON.stringify(failed));
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          const updated = successful[0].data;
          return {
            Id: updated.Id,
            category: updated.category_c,
            monthlyLimit: updated.monthly_limit_c,
            month: updated.month_c,
            year: updated.year_c
          };
        }
      }

      return null;
    } catch (error) {
      console.error("Error updating budget:", error?.response?.data?.message || error);
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

      const response = await apperClient.deleteRecord('budget_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} budgets:`, JSON.stringify(failed));
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        return successful.length > 0;
      }

      return false;
    } catch (error) {
      console.error("Error deleting budget:", error?.response?.data?.message || error);
      return false;
    }
  },

  async getByMonth(monthYear) {
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
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "monthly_limit_c"}},
          {"field": {"Name": "month_c"}},
          {"field": {"Name": "year_c"}}
        ],
        where: [
          {"FieldName": "month_c", "Operator": "EqualTo", "Values": [monthYear]}
        ]
      };

      const response = await apperClient.fetchRecords('budget_c', params);

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data?.map(budget => ({
        Id: budget.Id,
        category: budget.category_c,
        monthlyLimit: budget.monthly_limit_c,
        month: budget.month_c,
        year: budget.year_c
      })) || [];
    } catch (error) {
      console.error("Error fetching budgets by month:", error?.response?.data?.message || error);
      return [];
    }
  },

  async upsertBudget(category, monthlyLimit, month, year) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // First, try to find existing budget
      const searchParams = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "monthly_limit_c"}},
          {"field": {"Name": "month_c"}},
          {"field": {"Name": "year_c"}}
        ],
        where: [
          {"FieldName": "category_c", "Operator": "EqualTo", "Values": [category]},
          {"FieldName": "month_c", "Operator": "EqualTo", "Values": [month]},
          {"FieldName": "year_c", "Operator": "EqualTo", "Values": [year]}
        ]
      };

      const existingResponse = await apperClient.fetchRecords('budget_c', searchParams);

      if (existingResponse.success && existingResponse.data?.length > 0) {
        // Update existing budget
        const existingBudget = existingResponse.data[0];
        const updateParams = {
          records: [{
            Id: existingBudget.Id,
            Name: `${category} Budget`,
            category_c: category,
            monthly_limit_c: monthlyLimit,
            month_c: month,
            year_c: year
          }]
        };

        const updateResponse = await apperClient.updateRecord('budget_c', updateParams);

        if (!updateResponse.success) {
          console.error(updateResponse.message);
          toast.error(updateResponse.message);
          return null;
        }

        if (updateResponse.results?.length > 0 && updateResponse.results[0].success) {
          const updated = updateResponse.results[0].data;
          return {
            Id: updated.Id,
            category: updated.category_c,
            monthlyLimit: updated.monthly_limit_c,
            month: updated.month_c,
            year: updated.year_c
          };
        }
      } else {
        // Create new budget
        const createParams = {
          records: [{
            Name: `${category} Budget`,
            category_c: category,
            monthly_limit_c: monthlyLimit,
            month_c: month,
            year_c: year
          }]
        };

        const createResponse = await apperClient.createRecord('budget_c', createParams);

        if (!createResponse.success) {
          console.error(createResponse.message);
          toast.error(createResponse.message);
          return null;
        }

        if (createResponse.results?.length > 0 && createResponse.results[0].success) {
          const created = createResponse.results[0].data;
          return {
            Id: created.Id,
            category: created.category_c,
            monthlyLimit: created.monthly_limit_c,
            month: created.month_c,
            year: created.year_c
          };
        }
      }

      return null;
    } catch (error) {
      console.error("Error upserting budget:", error?.response?.data?.message || error);
      return null;
    }
  }
};