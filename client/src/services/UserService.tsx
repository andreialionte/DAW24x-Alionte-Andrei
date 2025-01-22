import axios from 'axios';
import { API_CONFIG } from '../configs/ApiConfig';
import { User } from '../Interfaces/User';
                           //https://localhost:5000/api/User/GetUser
const getUserUrl: string = API_CONFIG.BASE_URL + API_CONFIG.USER.GET_USER;

export const GetUserAPI = async (id: string): Promise<User> => {
    try {
        const response = await axios.get<User>(`${getUserUrl}/${id}`);
        return response.data;  
    } catch (err) {
        console.error(`Failed to fetch user with id: ${id}`, err);
        throw err;
    }
};
