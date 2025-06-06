import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register, login,adminLogin } from '../Api';

const Auth = () => {
    const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('register');
  const [registerData, setRegisterData] = useState({ name: '', email: '', password: '' });
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [role,setRole] = useState('user')

  // State to toggle password visibility for each form
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  const handleRegisterChange = (e) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
  };

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    try {
      const resp = await register(registerData);
      const token = resp?.data?.token;
      const newUser = resp?.data?.newUser;
      if (token) {
        localStorage.setItem('authToken', token);
        localStorage.setItem('user', JSON.stringify(newUser));
        navigate('/');
      }
    } catch (error) {
      console.log(error);
      alert(error?.response?.data?.message || 'Error while registering user');
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
        let resp;
      if(role === 'user') {
      resp = await login(loginData);
      }else {
      resp = await adminLogin(loginData);
      }
      const token = resp?.data?.token;
      const user = resp?.data?.user;
      console.log(resp?.data)
      if (token) {
        localStorage.setItem('authToken', token);
        localStorage.setItem('user', JSON.stringify(user));
        navigate('/');
      }
    } catch (error) {
      console.log(error);
      alert(error?.response?.data?.message || 'Error while logging in');
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('authToken')
    if(token) {
        navigate('/')
    }
  },[navigate])

  return (
    <div className="container mt-5">
      <ul className="nav nav-tabs mb-3">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'register' ? 'active' : ''}`}
            onClick={() => setActiveTab('register')}
          >
            Register
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => setActiveTab('login')}
          >
            Login
          </button>
        </li>
      </ul>

      {activeTab === 'register' && (
        <form onSubmit={handleRegisterSubmit}>
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input
              type="text"
              className="form-control"
              name="name"
              value={registerData.name}
              onChange={handleRegisterChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              name="email"
              value={registerData.email}
              onChange={handleRegisterChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <div className="input-group">
              <input
                type={showRegisterPassword ? 'text' : 'password'}
                className="form-control"
                name="password"
                value={registerData.password}
                onChange={handleRegisterChange}
                required
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                tabIndex={-1}
              >
                {showRegisterPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>
          <button type="submit" className="btn btn-primary">Register</button>
        </form>
      )}

      {activeTab === 'login' && (
        <form onSubmit={handleLoginSubmit}>
            <div className="mb-3">
            <p className="form-label">Login As</p>
            <div className="form-check form-check-inline">
                <input
                className="form-check-input"
                type="checkbox"
                id="adminCheck"
                checked={role === 'admin'}
                onChange={(e) => setRole('admin')}
                />
                <label className="form-check-label" htmlFor="adminCheck">
                Admin
                </label>
            </div>
            <div className="form-check form-check-inline">
                <input
                className="form-check-input"
                type="checkbox"
                id="userCheck"
                checked={role === 'user'}
                onChange={(e) => setRole('user')}
                />
                <label className="form-check-label" htmlFor="userCheck">
                User
                </label>
            </div>
            </div>

          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              name="email"
              value={loginData.email}
              onChange={handleLoginChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <div className="input-group">
              <input
                type={showLoginPassword ? 'text' : 'password'}
                className="form-control"
                name="password"
                value={loginData.password}
                onChange={handleLoginChange}
                required
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowLoginPassword(!showLoginPassword)}
                tabIndex={-1}
              >
                {showLoginPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>
          <button type="submit" className="btn btn-success">Login</button>
        </form>
      )}
    </div>
  );
};

export default Auth;