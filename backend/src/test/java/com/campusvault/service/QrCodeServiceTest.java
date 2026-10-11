package com.campusvault.service;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class QrCodeServiceTest {

    private final QrCodeService qrCodeService = new QrCodeService();

    @Test
    @DisplayName("Should generate valid PNG QR code bytes for verification URL")
    void testGenerateQrCodeImage() {
        String testUrl = "http://localhost:5173/verify/AU-WEB-2026-00421";
        byte[] qrBytes = qrCodeService.generateQrCodeImage(testUrl, 250, 250);

        assertNotNull(qrBytes);
        assertTrue(qrBytes.length > 100);

        // Verify PNG magic numbers: 0x89 'P' 'N' 'G'
        assertEquals((byte) 0x89, qrBytes[0]);
        assertEquals((byte) 'P', qrBytes[1]);
        assertEquals((byte) 'N', qrBytes[2]);
        assertEquals((byte) 'G', qrBytes[3]);
    }
}
