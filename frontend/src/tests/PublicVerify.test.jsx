import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { PublicVerifyPage } from '../pages/PublicVerifyPage';
import { certificateApi } from '../api/certificateApi';

vi.mock('../api/certificateApi', () => ({
  certificateApi: {
    verifyCertificate: vi.fn(),
    getDownloadUrl: vi.fn((id) => `/api/certificates/${id}/download`),
    getQrUrl: vi.fn((id) => `/api/certificates/${id}/qr`),
  },
}));

describe('PublicVerifyPage Component', () => {
  it('renders certificate search input and verification buttons', () => {
    render(
      <BrowserRouter>
        <PublicVerifyPage />
      </BrowserRouter>
    );

    expect(screen.getByPlaceholderText(/Enter Certificate ID/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Verify ID/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Scan QR/i })).toBeInTheDocument();
  });

  it('displays VERIFIED banner when valid certificate response is returned', async () => {
    certificateApi.verifyCertificate.mockResolvedValueOnce({
      success: true,
      data: {
        status: 'VERIFIED',
        valid: true,
        certificateId: 'AU-WEB-2026-00421',
        studentName: 'A Rithika Reddy',
        studentDepartment: 'Computer Science and Engineering',
        institutionName: 'Apex University',
        eventName: 'React Workshop',
        eventCategory: 'WORKSHOP',
        certificateTitle: 'Certificate of Excellence',
        issueDate: '2026-09-21',
        verifiedAt: new Date().toISOString(),
        message: 'Authentic certificate verified.',
      },
    });

    render(
      <BrowserRouter>
        <PublicVerifyPage />
      </BrowserRouter>
    );

    const input = screen.getByPlaceholderText(/Enter Certificate ID/i);
    fireEvent.change(input, { target: { value: 'AU-WEB-2026-00421' } });

    const submitBtn = screen.getByRole('button', { name: /Verify ID/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/OFFICIALLY VERIFIED/i)).toBeInTheDocument();
      expect(screen.getByText(/A Rithika Reddy/i)).toBeInTheDocument();
      expect(screen.getByText(/React Workshop/i)).toBeInTheDocument();
    });
  });

  it('displays REVOKED banner when revoked certificate is returned', async () => {
    certificateApi.verifyCertificate.mockResolvedValueOnce({
      success: true,
      data: {
        status: 'REVOKED',
        valid: false,
        certificateId: 'AU-WEB-2026-00421',
        studentName: 'A Rithika Reddy',
        institutionName: 'Apex University',
        revocationReason: 'Academic violation detected',
        revokedAt: new Date().toISOString(),
        message: 'Certificate revoked.',
      },
    });

    render(
      <BrowserRouter>
        <PublicVerifyPage />
      </BrowserRouter>
    );

    const input = screen.getByPlaceholderText(/Enter Certificate ID/i);
    fireEvent.change(input, { target: { value: 'AU-WEB-2026-00421' } });

    const submitBtn = screen.getByRole('button', { name: /Verify ID/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/CERTIFICATE HAS BEEN REVOKED/i)).toBeInTheDocument();
      expect(screen.getByText(/Academic violation detected/i)).toBeInTheDocument();
    });
  });
});
