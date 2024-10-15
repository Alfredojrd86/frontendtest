import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from './Login';

const MockLogin = () => {
  return (
    <BrowserRouter>
      <Login />
    </BrowserRouter>
  );
};

test('renders login form', () => {
  render(<MockLogin />);
  expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
});

test('displays error for invalid email', () => {
  render(<MockLogin />);
  const emailInput = screen.getByLabelText(/email address/i);
  const submitButton = screen.getByRole('button', { name: /login/i });

  fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
  fireEvent.click(submitButton);

  expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument();
});

test('displays error for invalid password', () => {
  render(<MockLogin />);
  const emailInput = screen.getByLabelText(/email address/i);
  const passwordInput = screen.getByLabelText(/password/i);
  const submitButton = screen.getByRole('button', { name: /login/i });

  fireEvent.change(emailInput, { target: { value: 'valid@email.com' } });
  fireEvent.change(passwordInput, { target: { value: 'short' } });
  fireEvent.click(submitButton);

  expect(screen.getByText(/password must be at least 6 characters long and contain both letters and numbers/i)).toBeInTheDocument();
});
