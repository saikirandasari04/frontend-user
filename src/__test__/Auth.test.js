import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Auth from './Auth';
import { register, login, adminLogin } from '../Api';
import { BrowserRouter } from 'react-router-dom';

jest.mock('../Api', () => ({
  register: jest.fn(),
  login: jest.fn(),
  adminLogin: jest.fn(),
}));

// Mock useNavigate
const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
}));

const renderWithRouter = (ui) => render(<BrowserRouter>{ui}</BrowserRouter>);

describe('Auth Component', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  test('renders register form by default', () => {
    renderWithRouter(<Auth />);
    expect(screen.getByText('Register')).toBeInTheDocument();
    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Register/i })).toBeInTheDocument();
  });

  test('switches to login tab when clicked', () => {
    renderWithRouter(<Auth />);
    fireEvent.click(screen.getByText('Login'));
    expect(screen.getByText('Login As')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
  });

  test('toggles password visibility in register form', () => {
    renderWithRouter(<Auth />);
    const showBtn = screen.getByRole('button', { name: /Show/i });
    const passwordInput = screen.getByLabelText('Password');
    expect(passwordInput.type).toBe('password');
    fireEvent.click(showBtn);
    expect(passwordInput.type).toBe('text');
  });

  test('register form submission calls register API and navigates', async () => {
    const fakeResponse = {
      data: {
        token: 'fake-token',
        newUser: { name: 'Test', email: 'test@example.com' }
      }
    };
    register.mockResolvedValue(fakeResponse);

    renderWithRouter(<Auth />);
    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'Test' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/^Password$/i), { target: { value: '123456' } });

    fireEvent.click(screen.getByRole('button', { name: /Register/i }));

    await waitFor(() => expect(register).toHaveBeenCalledTimes(1));
    expect(mockedNavigate).toHaveBeenCalledWith('/');
  });

  test('login as user calls login API and navigates', async () => {
    const fakeLoginResponse = {
      data: {
        token: 'user-token',
        user: { email: 'user@example.com' }
      }
    };
    login.mockResolvedValue(fakeLoginResponse);

    renderWithRouter(<Auth />);
    fireEvent.click(screen.getByText('Login'));

    fireEvent.change(screen.getByLabelText(/^Email$/i), { target: { value: 'user@example.com' } });
    fireEvent.change(screen.getByLabelText(/^Password$/i), { target: { value: '123456' } });

    fireEvent.click(screen.getByRole('button', { name: /Login/i }));

    await waitFor(() => expect(login).toHaveBeenCalled());
    expect(mockedNavigate).toHaveBeenCalledWith('/');
  });

  test('login as admin calls adminLogin API', async () => {
    const fakeAdminResponse = {
      data: {
        token: 'admin-token',
        user: { email: 'admin@example.com' }
      }
    };
    adminLogin.mockResolvedValue(fakeAdminResponse);

    renderWithRouter(<Auth />);
    fireEvent.click(screen.getByText('Login'));

    // Change role to admin
    fireEvent.click(screen.getByLabelText(/Admin/i));

    fireEvent.change(screen.getByLabelText(/^Email$/i), { target: { value: 'admin@example.com' } });
    fireEvent.change(screen.getByLabelText(/^Password$/i), { target: { value: 'adminpass' } });

    fireEvent.click(screen.getByRole('button', { name: /Login/i }));

    await waitFor(() => expect(adminLogin).toHaveBeenCalled());
    expect(mockedNavigate).toHaveBeenCalledWith('/');
  });
});