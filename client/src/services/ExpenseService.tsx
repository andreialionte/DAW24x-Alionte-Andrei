import axios from 'axios';
import { API_CONFIG } from '../configs/ApiConfig';
import { Expense } from '../Interfaces/Expense';

const getExpensesUrl: string = API_CONFIG.BASE_URL + API_CONFIG.EXPENSE.GET_EXPENSES;
const getExpenseUrl: string = API_CONFIG.BASE_URL + API_CONFIG.EXPENSE.GET_EXPENSE;
const createExpenseUrl: string = API_CONFIG.BASE_URL + API_CONFIG.EXPENSE.CREATE_EXPENSE;
const updateExpenseUrl: string = API_CONFIG.BASE_URL + API_CONFIG.EXPENSE.UPDATE_EXPENSE;
const deleteExpenseUrl: string = API_CONFIG.BASE_URL + API_CONFIG.EXPENSE.DELETE_EXPENSE;
const getExpensesByMonthUrl: string = API_CONFIG.BASE_URL + API_CONFIG.EXPENSE.GET_EXPENSES_BY_MONTH;
const getLastFiveExpensesUrl: string = API_CONFIG.BASE_URL + API_CONFIG.EXPENSE.GET_EXPNESES_FIVE;
const getExpensesByCategoryUrl: string = API_CONFIG.BASE_URL + API_CONFIG.EXPENSE.GET_EXPENSES_BY_CATEGORY;

export const GetExpenses = async (userId: string) => {
    try {
        const response = await axios.get<Expense[]>(`${getExpensesUrl}/${userId}`);
        return response.data;
    } catch (err) {
        console.error("Failed to fetch expenses", err);
        throw err;
    }
}

export const GetExpense = async (id: string) => {
    try {
        const response = await axios.get<Expense>(`${getExpenseUrl}/${id}`);
        return response.data;
    } catch (err) {
        console.error(`Failed to fetch expense with id: ${id}`, err);
        throw err;
    }
}

export const CreateExpense = async (expense: Partial<Expense>, userId: string): Promise<Expense> => {
    try {
        const response = await axios.post<Expense>(`${createExpenseUrl}/${userId}`, expense);
        return response.data;
    } catch (err) {
        console.error("Failed to create expense", err);
        throw err;
    }
}

export const UpdateExpense = async (id: string, expense: Expense) => {
    try {
        const response = await axios.put<Expense>(`${updateExpenseUrl}/${id}`, expense);
        return response.data;
    } catch (err) {
        console.error(`Failed to update expense with id: ${id}`, err);
        throw err;
    }
}

export const DeleteExpense = async (id: string) => {
    try {
        const response = await axios.delete(`${deleteExpenseUrl}/${id}`);
        return response.data;
    } catch (err) {
        console.error(`Failed to delete expense with id: ${id}`, err);
        throw err;
    }
}

export const GetExpensesByMonth = async (month: string) => {
    try {
        const response = await axios.get<Expense[]>(`${getExpensesByMonthUrl}/${month}`);
        return response.data;
    } catch (err) {
        console.error(`Failed to fetch expenses for month: ${month}`, err);
        throw err;
    }
}

export const GetLastFiveExpenses = async (userId: string) => {
    try {
        const response = await axios.get<Expense[]>(`${getLastFiveExpensesUrl}/${userId}`);
        return response.data;
    } catch (err) {
        console.error("Failed to fetch last five expenses", err);
        throw err;
    }
}

export const GetExpensesByCategory = async (userId: string) => {
    try {
        const response = await axios.get<Expense[]>(`${getExpensesByCategoryUrl}/${userId}`);
        return response.data;
    } catch (err) {
        console.error(`Failed to fetch expenses for category: ${userId}`, err);
        throw err;
    }
}
