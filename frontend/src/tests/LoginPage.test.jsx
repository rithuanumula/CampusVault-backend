import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { LoginPage } from '../pages/LoginPage';
import { AuthProvider } from '../context/AuthContext';
import { ToastProvider } from '../context/ToastContext';

describe('LoginPage Component', () => {
  it('renders login form with email and password inputs', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <ToastProvider>
            <LoginPage />
          </ToastProvider>
        </AuthProvider>
      </BrowserRouter>
    );

    expect(screen.getByPlaceholderText(/name@campusvault\.edu/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/••••••••••••/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign In to Account/i })).toBeInTheDocument();
  });

  it('populates demo credentials when clicking Dean / Admin demo button', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <ToastProvider>
            <LoginPage />
          </ToastProvider>
        </AuthProvider>
      </BrowserRouter>
    );

    const adminBtn = screen.getByRole('button', { name: /Dean \/ Admin/i });
    fireEvent.click(adminBtn);

    const emailInput = screen.getByPlaceholderText(/name@campusvault\.edu/i);
    const passInput = screen.getByPlaceholderText(/••••••••••••/i);

    expect(emailInput.value).toBe('admin@campusvault.edu');
    expect(passInput.value).toBe('Admin@123');
  });
});
