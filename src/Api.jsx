import axios from 'axios';

const API_URI = 'http://localhost:7000';
// const API_URI = 'https://admin-backend-hi21.vercel.app/api';

export const register = (data) => {
    return axios.post(`${API_URI}/auth/register`, data);
};

export const login = (data) => {
    return axios.post(`${API_URI}/auth/login`, data);
};

export const adminLogin = (data) => {
    return axios.post(`${API_URI}/admin/login`, data);
};


export const applyLoan = (data) => {
    const token = localStorage.getItem('authToken')
    return axios.post(`${API_URI}/loan/apply`,data,{
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    })
}

export const getUserLoans = () => {
    const token = localStorage.getItem('authToken')
    return axios.get(`${API_URI}/loan/status`,{
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    })
}

export const getAllLoans = () => {
    const token = localStorage.getItem('authToken')
    return axios.get(`${API_URI}/admin/loans`,{
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    })
}

export const updateLoanStatus = (id,status) => {
    const token = localStorage.getItem('authToken')
    return axios.patch(`${API_URI}/admin/loan/${id}`,{status},{
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    })
}