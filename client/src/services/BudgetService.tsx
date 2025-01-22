import React from 'react'
import axios from 'axios';
import { API_CONFIG } from '../configs/ApiConfig';
import { Login } from '../Interfaces/Dtos/Login';
import { Register } from '../Interfaces/Dtos/Register';
import { Auth } from '../Interfaces/Auth';
import { Expense } from '../Interfaces/Expense';
import { Budget } from '../Interfaces/Budget';

const getBudgetsUrl: string = API_CONFIG.BASE_URL + API_CONFIG.BUDGET.GET_BUDGET;
const getBudgetByUser: string = API_CONFIG.BASE_URL + API_CONFIG.BUDGET.GetBudgets_ByUser;
const createBudgetUrl: string = API_CONFIG.BASE_URL + API_CONFIG.BUDGET.CREATE_BUDGET;
const updateExpenseUrl: string = API_CONFIG.BASE_URL + API_CONFIG.EXPENSE.UPDATE_EXPENSE;
const deleteExpenseUrl: string = API_CONFIG.BASE_URL + API_CONFIG.EXPENSE.DELETE_EXPENSE;



export const GetBudgetsAPI = async (userId: string) => {
    try {
        const response = await axios.get<Budget[]>(`${getBudgetByUser}/${userId}`);
        return response.data;
    } catch (err) {
        console.error("Failed to fetch expenses", err);
        throw err;
    }
}

export const GetBudgetAPI = async (id: string) => {
    try {
        const response = await axios.get<Budget>(`${getBudgetsUrl}/${id}`);
        return response.data;
    } catch (err) {
        console.error(`Failed to fetch expense with id: ${id}`, err);
        throw err;
    }
}

export const CreateExpenseAPI = async (budgetData: Partial<Budget>): Promise<Budget> => {
    try {
        const response = await axios.post<Budget>(createBudgetUrl, budgetData);
        return response.data;
    } catch (err) {
        console.error("Failed to create budget", err);
        throw err;
    }
}

export const UpdateExpenseAPI = async (id: string, expense: Expense) => {
    try {
        const response = await axios.put<Expense>(`${updateExpenseUrl}/${id}`, expense);
        return response.data;
    } catch (err) {
        console.error(`Failed to update expense with id: ${id}`, err);
        throw err;
    }
}

export const DeleteExpenseAPI = async (id: string) => {
    try {
        const response = await axios.delete(`${deleteExpenseUrl}/${id}`);
        return response.data;
    } catch (err) {
        console.error(`Failed to delete expense with id: ${id}`, err);
        throw err;
    }
}
