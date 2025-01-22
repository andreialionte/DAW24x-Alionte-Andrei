import axios from 'axios';
import { API_CONFIG } from '../configs/ApiConfig';
import { Category } from '../Interfaces/Category';

const getCategoriesUrl: string = API_CONFIG.BASE_URL + API_CONFIG.CATEGORY.GET_CATEGORIES;
const getCategoryUrl: string = API_CONFIG.BASE_URL + API_CONFIG.CATEGORY.GET_CATEGORY;
const createCategoryUrl: string = API_CONFIG.BASE_URL + API_CONFIG.CATEGORY.CREATE_CATEGORY;
const updateCategoryUrl: string = API_CONFIG.BASE_URL + API_CONFIG.CATEGORY.UPDATE_CATEGORY;
const deleteCategoryUrl: string = API_CONFIG.BASE_URL + API_CONFIG.CATEGORY.DELETE_CATEGORY;

export const GetCategoryById = async (categoryId: string): Promise<Category> => {
    const response = await fetch(`${getCategoryUrl}/${categoryId}`);
    if (!response.ok) throw new Error('Failed to fetch category');
    return response.json();
  };

export const GetCategories = async (userId: string) => {
    try {
        const response = await axios.get<Category[]>(`${getCategoriesUrl}/${userId}`);
        return response.data;
    } catch (err) {
        console.error("Failed to fetch categories", err);
        throw err;
    }
}

export const GetCategory= async (id: string) => {
    try {
        const response = await axios.get<Category>(`${getCategoryUrl}/${id}`);
        return response.data;
    } catch (err) {
        console.error(`Failed to fetch category with id: ${id}`, err);
        throw err;
    }
}

export const CreateCategory = async (category: Partial<Category>, userId: string): Promise<Category> => {
    try {
        const response = await axios.post<Category>(`${createCategoryUrl}/${userId}`, category);
        return response.data;
    } catch (err) {
        console.error("Failed to create category", err);
        throw err;
    }
}


export const UpdateCategory = async (id: string, category: Category) => {
    try {
        const response = await axios.put<Category>(`${updateCategoryUrl}/${id}`, category);
        return response.data;
    } catch (err) {
        console.error(`Failed to update category with id: ${id}`, err);
        throw err;
    }
}

export const DeleteCategory = async (id: string) => {
    try {
        const response = await axios.delete(`${deleteCategoryUrl}/${id}`);
        return response.data;
    } catch (err) {
        console.error(`Failed to delete category with id: ${id}`, err);
        throw err;
    }
}
