import { toast } from "react-toastify";

export const savingsGoalService = {
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
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "target_amount_c"}},
          {"field": {"Name": "current_amount_c"}},
          {"field": {"Name": "deadline_c"}},
          {"field": {"Name": "created_at_c"}}
        ],
        orderBy: [{"fieldName": "deadline_c", "sorttype": "ASC"}]
      };

      const response = await apperClient.fetchRecords('savings_goal_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data?.map(goal => ({
        Id: goal.Id,
        title: goal.title_c || goal.Name,
        targetAmount: goal.target_amount_c,
        currentAmount: goal.current_amount_c,
        deadline: goal.deadline_c,
        createdAt: goal.created_at_c
      })) || [];
    } catch (error) {
      console.error("Error fetching savings goals:", error?.response?.data?.message || error);
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
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "target_amount_c"}},
          {"field": {"Name": "current_amount_c"}},
          {"field": {"Name": "deadline_c"}},
          {"field": {"Name": "created_at_c"}}
        ]
      };

      const response = await apperClient.getRecordById('savings_goal_c', parseInt(id), params);

      if (!response?.data) {
        return null;
      }

      const goal = response.data;
      return {
        Id: goal.Id,
        title: goal.title_c || goal.Name,
        targetAmount: goal.target_amount_c,
        currentAmount: goal.current_amount_c,
        deadline: goal.deadline_c,
        createdAt: goal.created_at_c
      };
    } catch (error) {
      console.error(`Error fetching savings goal ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  },

  async create(goalData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Name: goalData.title,
          title_c: goalData.title,
          target_amount_c: goalData.targetAmount,
          current_amount_c: goalData.currentAmount || 0,
          deadline_c: goalData.deadline,
          created_at_c: new Date().toISOString()
        }]
      };

      const response = await apperClient.createRecord('savings_goal_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} savings goals:`, JSON.stringify(failed));
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          const created = successful[0].data;
          return {
            Id: created.Id,
            title: created.title_c || created.Name,
            targetAmount: created.target_amount_c,
            currentAmount: created.current_amount_c,
            deadline: created.deadline_c,
            createdAt: created.created_at_c
          };
        }
      }

      return null;
    } catch (error) {
      console.error("Error creating savings goal:", error?.response?.data?.message || error);
      return null;
    }
  },

  async update(id, goalData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Id: parseInt(id),
          Name: goalData.title,
          title_c: goalData.title,
          target_amount_c: goalData.targetAmount,
          current_amount_c: goalData.currentAmount,
          deadline_c: goalData.deadline
        }]
      };

      const response = await apperClient.updateRecord('savings_goal_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} savings goals:`, JSON.stringify(failed));
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          const updated = successful[0].data;
          return {
            Id: updated.Id,
            title: updated.title_c || updated.Name,
            targetAmount: updated.target_amount_c,
            currentAmount: updated.current_amount_c,
            deadline: updated.deadline_c,
            createdAt: updated.created_at_c
          };
        }
      }

      return null;
    } catch (error) {
      console.error("Error updating savings goal:", error?.response?.data?.message || error);
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

      const response = await apperClient.deleteRecord('savings_goal_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} savings goals:`, JSON.stringify(failed));
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        return successful.length > 0;
      }

      return false;
    } catch (error) {
      console.error("Error deleting savings goal:", error?.response?.data?.message || error);
      return false;
    }
  },

  async updateAmount(id, amount) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // First get current goal data
      const getParams = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "current_amount_c"}}
        ]
      };

      const currentResponse = await apperClient.getRecordById('savings_goal_c', parseInt(id), getParams);

      if (!currentResponse?.data) {
        toast.error("Savings goal not found");
        return null;
      }

      const currentAmount = currentResponse.data.current_amount_c || 0;
      const newAmount = Math.max(0, currentAmount + amount);

      const updateParams = {
        records: [{
          Id: parseInt(id),
          current_amount_c: newAmount
        }]
      };

      const response = await apperClient.updateRecord('savings_goal_c', updateParams);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to update amount for ${failed.length} savings goals:`, JSON.stringify(failed));
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          const updated = successful[0].data;
          return {
            Id: updated.Id,
            title: updated.title_c || updated.Name,
            targetAmount: updated.target_amount_c,
            currentAmount: updated.current_amount_c,
            deadline: updated.deadline_c,
            createdAt: updated.created_at_c
          };
        }
      }

      return null;
    } catch (error) {
      console.error("Error updating savings goal amount:", error?.response?.data?.message || error);
      return null;
    }
  }
};