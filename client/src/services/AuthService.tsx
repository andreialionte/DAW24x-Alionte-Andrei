import React from 'react'
import axios from 'axios';
import { API_CONFIG } from '../configs/ApiConfig';
import { Login } from '../Interfaces/Dtos/Login';
import { Register } from '../Interfaces/Dtos/Register';
import { Auth } from '../Interfaces/Auth';

const loginUrl: string = API_CONFIG.BASE_URL + API_CONFIG.AUTH.LOGIN;
const registerUrl: string = API_CONFIG.BASE_URL + API_CONFIG.AUTH.REGISTER;

export const LoginAPI = async (login: Login) => {
    try{
        const response = await axios.post<string>(loginUrl, login);
        return response.data;
    }catch(err){
        console.error("Login Failed", err);
        throw err;
    }
}

export const RegisterAPI = async (register: Register) => {
    try{
        const response = await axios.post<Auth>(registerUrl, register);
        return response.data;
    }catch(err){
        console.error("Register Failed", err);
        throw err;
    }
}
