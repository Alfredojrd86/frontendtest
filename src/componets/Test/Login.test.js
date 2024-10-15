import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
// import '@testing-library/jest-dom/extend-expect';
import Login from '../Login/Login';

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('Login Component', () => {
  beforeEach(() => {
    renderWithRouter(<Login />);
  });

  test('renders login form correctly', () => {
    expect(screen.getByText('ProLogin')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument();
  });

  test('shows error for invalid email format', async () => {
    fireEvent.change(screen.getByPlaceholderText('Enter your email'), {
      target: { value: 'invalid-email' },
    });
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), {
      target: { value: 'ValidPass123' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));

    await waitFor(() => {
      expect(screen.getByText('Please enter a valid email address.')).toBeInTheDocument();
    });
  });

  test('shows error for invalid password format', async () => {
    fireEvent.change(screen.getByPlaceholderText('Enter your email'), {
      target: { value: 'test@test.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), {
      target: { value: '123' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));

    await waitFor(() => {
      expect(screen.getByText('Password must be at least 6 characters long and contain both letters and numbers.')).toBeInTheDocument();
    });
  });

  test('shows error for invalid credentials', async () => {
    fireEvent.change(screen.getByPlaceholderText('Enter your email'), {
      target: { value: 'wrong@email.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), {
      target: { value: 'WrongPassword123' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials. Please try again.')).toBeInTheDocument();
    });
  });

  test('successful login redirects to dashboard', async () => {
    fireEvent.change(screen.getByPlaceholderText('Enter your email'), {
      target: { value: 'prologin@prologin.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), {
      target: { value: 'ProLogin123456' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));

    await waitFor(() => {
      expect(localStorage.getItem('isLoggedIn')).toBe('true');
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });
});
