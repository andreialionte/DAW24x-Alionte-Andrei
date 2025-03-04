export const API_CONFIG = {
  BASE_URL: "http://localhost:5000/api/",
  AUTH: {
    LOGIN: "Auth/Login",
    REGISTER: "Auth/Register",
  },
  EXPENSE: {
    GET_EXPENSES: "Expense/GetExpenses",
    GET_EXPENSE: "Expense/GetExpense",
    CREATE_EXPENSE: "Expense/CreateExpense",
    UPDATE_EXPENSE: "Expense/UpdateExpense",
    DELETE_EXPENSE: "Expense/DeleteExpense",
    // imp
    GET_EXPENSES_BY_MONTH: "Expense/GetExpensesFromMonths", //   /id
    GET_EXPNESES_FIVE: "Expense/GetLastFiveExpenses",
    GET_EXPENSES_BY_CATEGORY: "Expense/GetExpensesByCategory"
  },
  BUDGET: {
    GET_BUDGET: "Budget/GetBudget",
    // GET_BUDGET_By_User: "Budget/GetBudgetByUser",
    CREATE_BUDGET: "Budget/CreateBudget",
    UPDATE_BUDGET: "Budget/UpdateBudget",
    DELETE_BUDGET: "Budget/DeleteBudget",
    GetBudgets_ByUser: "Budget/GetBudgets"
  },
  CATEGORY: {
    GET_CATEGORIES: "Category/GetCategories",
    GET_CATEGORY: "Category/GetCategory",
    CREATE_CATEGORY: "Category/CreateCategory",
    UPDATE_CATEGORY: "Category/UpdateCategory",
    DELETE_CATEGORY: "Category/DeleteCategory",
  },
  USER: {
    // GET_USERS: "User/GetUser",
    GET_USER: "User/GetUser",
    // CREATE_USER: "User",
    // UPDATE_USER: "User/{id}",
    // DELETE_USER: "User/{id}",
  },
};
