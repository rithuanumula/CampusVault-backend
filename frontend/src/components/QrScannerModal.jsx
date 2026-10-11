import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Camera, X, AlertCircle, RefreshCw } from 'lucide-react';

export const QrScannerModal = ({ isOpen, onClose, onScanSuccess }) => {
  const [errorMsg, setErrorMsg] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const scannerRef = useRef(null);

  useEffect(() => {
    let html5QrCode = null;

    if (isOpen) {
      setErrorMsg('');
      setIsScanning(true);

      const qrRegionId = 'campusvault-qr-region';

      // Slight timeout to ensure DOM container is mounted
      const timer = setTimeout(async () => {
        try {
          html5QrCode = new Html5Qrcode(qrRegionId);
          scannerRef.current = html5QrCode;

          const config = {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1.0,
          };

          await html5QrCode.start(
            { facingMode: 'environment' },
            config,
            (decodedText) => {
              // Extract Certificate ID if URL is embedded
              let certId = decodedText;
              if (decodedText.includes('/verify/')) {
                const parts = decodedText.split('/verify/');
                certId = parts[parts.length - 1].split('?')[0].trim();
              }

              // Stop scanner and return certificate ID
              html5QrCode.stop().then(() => {
                setIsScanning(false);
                onScanSuccess(certId);
                onClose();
              }).catch(() => {
                onScanSuccess(certId);
                onClose();
              });
            },
            () => {
              // Frame scan failure (ignore to keep continuous scanning)
            }
          );
        } catch (err) {
          console.error('Camera QR start error:', err);
          setErrorMsg(
            err?.message?.includes('NotAllowedError') || err?.message?.includes('Permission')
              ? 'Camera permission denied. Please allow camera access in browser settings or enter the Certificate ID manually.'
              : 'Unable to start camera scanner: ' + (err?.message || 'Device camera not found or unsupported.')
          );
          setIsScanning(false);
        }
      }, 300);

      return () => {
        clearTimeout(timer);
        if (html5QrCode && html5QrCode.isScanning) {
          html5QrCode.stop().catch(() => {});
        }
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    if (scannerRef.current && scannerRef.current.isScanning) {
      scannerRef.current.stop().catch(() => {});
    }
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.65)',
      backdropFilter: 'blur(8px)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: 20,
        maxWidth: 480,
        width: '100%',
        overflow: 'hidden',
        boxShadow: '0 25px 50px -12px rgba(14, 165, 233, 0.25)',
        border: '1.5px solid #bae6fd'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #0284c7 0%, #0ea5e9 100%)',
          padding: '18px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          color: '#ffffff'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Camera size={22} color="#ffffff" />
            <h3 style={{ color: '#ffffff', fontSize: '1.1rem', margin: 0, fontWeight: 700 }}>Scan Certificate QR</h3>
          </div>
          <button
            onClick={handleClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#ffffff',
              cursor: 'pointer',
              opacity: 0.9
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Scanner Body */}
        <div style={{ padding: 24, textAlign: 'center' }}>
          <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: 16 }}>
            Point your device camera at the scannable QR code on the certificate PDF or paper copy.
          </p>

          {/* Scanner preview container */}
          <div
            id="campusvault-qr-region"
            style={{
              width: '100%',
              minHeight: 280,
              backgroundColor: '#0f172a',
              borderRadius: 12,
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid #e0f2fe'
            }}
          />

          {errorMsg && (
            <div style={{
              marginTop: 16,
              padding: 12,
              backgroundColor: '#fee2e2',
              borderRadius: 8,
              border: '1px solid #fca5a5',
              display: 'flex',
              alignItems: 'flex-start',
              gap: 8,
              color: '#991b1b',
              fontSize: '0.85rem',
              textAlign: 'left'
            }}>
              <AlertCircle size={18} style={{ flexShrink: 0, marginTop: 2 }} />
              <div>{errorMsg}</div>
            </div>
          )}

          <div style={{ marginTop: 20, display: 'flex', justifyContent: 'center' }}>
            <button
              onClick={handleClose}
              className="btn btn-secondary"
              style={{ width: '100%' }}
            >
              Cancel & Use Manual ID
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
