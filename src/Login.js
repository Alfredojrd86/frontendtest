import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Alert } from 'react-bootstrap';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6 && /[A-Za-z]/.test(password) && /[0-9]/.test(password);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setEmailError('');
    setPasswordError('');
    setLoginError('');

    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address.');
      return;
    }

    if (!validatePassword(password)) {
      setPasswordError('Password must be at least 6 characters long and contain both letters and numbers.');
      return;
    }

    if (email === 'prologin@prologin.com' && password === 'ProLogin123456') {
      localStorage.setItem('isLoggedIn', 'true');
      navigate('/dashboard');
    } else {
      setLoginError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <Form className="login-form" onSubmit={handleSubmit}>
        <h2 className="login-title">Welcome Back</h2>
        <p className="login-subtitle">Please enter your details to sign in</p>
        <Form.Group className="mb-4" controlId="formBasicEmail">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            isInvalid={!!emailError}
            className="custom-input"
          />
          <Form.Control.Feedback type="invalid">{emailError}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-4" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            isInvalid={!!passwordError}
            className="custom-input"
          />
          <Form.Control.Feedback type="invalid">{passwordError}</Form.Control.Feedback>
        </Form.Group>

        {loginError && <Alert variant="danger" className="mb-4">{loginError}</Alert>}

        <Button variant="primary" type="submit" className="btn-login">
          Sign In
        </Button>
      </Form>
    </div>
  );
}

export default Login;
