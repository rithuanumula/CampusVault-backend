package com.campusvault.service;

import com.campusvault.entity.Certificate;
import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfContentByte;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import org.springframework.stereotype.Service;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;

@Service
public class PdfCertificateService {

    private static final Color PRIMARY_BLUE = new Color(2, 132, 199);       // Light Ocean Blue (#0284c7)
    private static final Color ACCENT_LIGHT_BLUE = new Color(56, 189, 248);  // Vibrant Light Sky Blue (#38bdf8)
    private static final Color LIGHT_BG = new Color(248, 250, 252);          // Pure white / soft ice tint (#f8fafc)
    private static final Color TEXT_DARK = new Color(15, 23, 42);            // Slate 900 (#0f172a)
    private static final Color TEXT_MUTED = new Color(100, 116, 139);        // Slate 500 (#64748b)

    public byte[] generateCertificatePdf(Certificate cert, byte[] qrCodeImageBytes) {
        try {
            // Landscape A4: 842 x 595 points
            Rectangle pageSize = PageSize.A4.rotate();
            Document document = new Document(pageSize, 36, 36, 36, 36);
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            PdfWriter writer = PdfWriter.getInstance(document, out);

            document.open();

            // 1. Draw Ornamental Certificate Borders directly on the canvas
            PdfContentByte canvas = writer.getDirectContentUnder();
            float w = pageSize.getWidth();
            float h = pageSize.getHeight();

            // Background fill
            canvas.setColorFill(LIGHT_BG);
            canvas.rectangle(0, 0, w, h);
            canvas.fill();

            // Outer Ocean Blue Border
            canvas.setColorStroke(PRIMARY_BLUE);
            canvas.setLineWidth(5f);
            canvas.rectangle(20, 20, w - 40, h - 40);
            canvas.stroke();

            // Inner Light Sky Blue Accent Border
            canvas.setColorStroke(ACCENT_LIGHT_BLUE);
            canvas.setLineWidth(1.5f);
            canvas.rectangle(26, 26, w - 52, h - 52);
            canvas.stroke();

            // Corner ornamental accents
            drawCornerAccents(canvas, 30, 30, w - 60, h - 60);

            // 2. Fonts
            Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14, PRIMARY_BLUE);
            Font subHeaderFont = FontFactory.getFont(FontFactory.HELVETICA, 10, ACCENT_LIGHT_BLUE);
            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 22, PRIMARY_BLUE);
            Font presentationFont = FontFactory.getFont(FontFactory.HELVETICA, 11, TEXT_MUTED);
            Font nameFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 24, PRIMARY_BLUE);
            Font detailsFont = FontFactory.getFont(FontFactory.HELVETICA, 11, TEXT_DARK);
            Font eventFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14, PRIMARY_BLUE);
            Font descFont = FontFactory.getFont(FontFactory.HELVETICA_OBLIQUE, 10, TEXT_DARK);
            Font smallMutedFont = FontFactory.getFont(FontFactory.HELVETICA, 8, TEXT_MUTED);
            Font certIdFont = FontFactory.getFont(FontFactory.COURIER_BOLD, 9, PRIMARY_BLUE);

            // 3. Institution & Title Header
            Paragraph orgHeader = new Paragraph("CAMPUSVAULT SECURE CREDENTIAL REGISTRY", headerFont);
            orgHeader.setAlignment(Element.ALIGN_CENTER);
            document.add(orgHeader);

            Paragraph orgSub = new Paragraph("OFFICIAL DIGITAL RECORD OF ACHIEVEMENT", subHeaderFont);
            orgSub.setAlignment(Element.ALIGN_CENTER);
            orgSub.setSpacingAfter(10f);
            document.add(orgSub);

            // Certificate Title
            Paragraph certTitle = new Paragraph(cert.getCertificateTitle().toUpperCase(), titleFont);
            certTitle.setAlignment(Element.ALIGN_CENTER);
            certTitle.setSpacingAfter(8f);
            document.add(certTitle);

            // Presentation text
            Paragraph presentedTo = new Paragraph("This is proudly presented to certify that", presentationFont);
            presentedTo.setAlignment(Element.ALIGN_CENTER);
            presentedTo.setSpacingAfter(4f);
            document.add(presentedTo);

            // Recipient Student Name
            Paragraph studentName = new Paragraph(cert.getStudent().getFullName(), nameFont);
            studentName.setAlignment(Element.ALIGN_CENTER);
            studentName.setSpacingAfter(3f);
            document.add(studentName);

            // Department & College
            String collegeInfo = cert.getStudent().getDepartment() + " • " + cert.getStudent().getCollege();
            Paragraph studentMeta = new Paragraph(collegeInfo, detailsFont);
            studentMeta.setAlignment(Element.ALIGN_CENTER);
            studentMeta.setSpacingAfter(8f);
            document.add(studentMeta);

            // Event acknowledgment
            Paragraph eventIntro = new Paragraph("has actively participated and successfully demonstrated excellence in", presentationFont);
            eventIntro.setAlignment(Element.ALIGN_CENTER);
            eventIntro.setSpacingAfter(3f);
            document.add(eventIntro);

            Paragraph eventNamePara = new Paragraph(cert.getEvent().getEventName() + " (" + cert.getEvent().getCategory() + ")", eventFont);
            eventNamePara.setAlignment(Element.ALIGN_CENTER);
            eventNamePara.setSpacingAfter(6f);
            document.add(eventNamePara);

            // Description / Achievement statement
            if (cert.getDescription() != null && !cert.getDescription().isBlank()) {
                Paragraph descPara = new Paragraph("\"" + cert.getDescription() + "\"", descFont);
                descPara.setAlignment(Element.ALIGN_CENTER);
                descPara.setSpacingAfter(12f);
                document.add(descPara);
            }

            // 4. Footer Section with Signatures, QR Code & Certificate ID
            PdfPTable footerTable = new PdfPTable(3);
            footerTable.setWidthPercentage(90);
            footerTable.setWidths(new float[]{35f, 30f, 35f});

            // Left Cell: Issuance Info & Signatures
            PdfPCell leftCell = new PdfPCell();
            leftCell.setBorder(Rectangle.NO_BORDER);
            leftCell.setVerticalAlignment(Element.ALIGN_BOTTOM);
            Paragraph datePara = new Paragraph("Date of Issue: " + cert.getIssueDate().format(DateTimeFormatter.ofPattern("dd MMMM yyyy")), detailsFont);
            Paragraph orgPara = new Paragraph("Organizer: " + cert.getEvent().getOrganizer(), smallMutedFont);
            Paragraph sigLeft = new Paragraph("\n__________________________\nDean of Academic Affairs", detailsFont);
            leftCell.addElement(datePara);
            leftCell.addElement(orgPara);
            leftCell.addElement(sigLeft);

            // Center Cell: Verification Seal & ID
            PdfPCell centerCell = new PdfPCell();
            centerCell.setBorder(Rectangle.NO_BORDER);
            centerCell.setHorizontalAlignment(Element.ALIGN_CENTER);
            centerCell.setVerticalAlignment(Element.ALIGN_BOTTOM);
            Paragraph sealTitle = new Paragraph("[ SEAL OF AUTHENTICITY ]", subHeaderFont);
            sealTitle.setAlignment(Element.ALIGN_CENTER);
            Paragraph certIdLabel = new Paragraph("Certificate ID:", smallMutedFont);
            certIdLabel.setAlignment(Element.ALIGN_CENTER);
            Paragraph certIdValue = new Paragraph(cert.getCertificateId(), certIdFont);
            certIdValue.setAlignment(Element.ALIGN_CENTER);
            Paragraph statusText = new Paragraph("STATUS: " + cert.getStatus().name(), headerFont);
            statusText.setAlignment(Element.ALIGN_CENTER);
            centerCell.addElement(sealTitle);
            centerCell.addElement(certIdLabel);
            centerCell.addElement(certIdValue);
            centerCell.addElement(statusText);

            // Right Cell: QR Code & Verification Note
            PdfPCell rightCell = new PdfPCell();
            rightCell.setBorder(Rectangle.NO_BORDER);
            rightCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
            rightCell.setVerticalAlignment(Element.ALIGN_BOTTOM);

            if (qrCodeImageBytes != null && qrCodeImageBytes.length > 0) {
                Image qrImage = Image.getInstance(qrCodeImageBytes);
                qrImage.scaleToFit(75, 75);
                qrImage.setAlignment(Element.ALIGN_RIGHT);
                rightCell.addElement(qrImage);
            }

            Paragraph qrCaption = new Paragraph("Scan QR code to verify validity\nPowered by CampusVault Registry", smallMutedFont);
            qrCaption.setAlignment(Element.ALIGN_RIGHT);
            Paragraph sigRight = new Paragraph("\n__________________________\nDirector of Examinations", detailsFont);
            sigRight.setAlignment(Element.ALIGN_RIGHT);

            rightCell.addElement(qrCaption);
            rightCell.addElement(sigRight);

            footerTable.addCell(leftCell);
            footerTable.addCell(centerCell);
            footerTable.addCell(rightCell);

            document.add(footerTable);

            document.close();
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate certificate PDF: " + e.getMessage(), e);
        }
    }

    private void drawCornerAccents(PdfContentByte canvas, float x1, float y1, float x2, float y2) {
        canvas.setColorStroke(ACCENT_LIGHT_BLUE);
        canvas.setLineWidth(1f);
        float len = 15f;
        // Top-left
        canvas.moveTo(x1, y2 - len);
        canvas.lineTo(x1, y2);
        canvas.lineTo(x1 + len, y2);
        // Top-right
        canvas.moveTo(x2 - len, y2);
        canvas.lineTo(x2, y2);
        canvas.lineTo(x2, y2 - len);
        // Bottom-left
        canvas.moveTo(x1, y1 + len);
        canvas.lineTo(x1, y1);
        canvas.lineTo(x1 + len, y1);
        // Bottom-right
        canvas.moveTo(x2 - len, y1);
        canvas.lineTo(x2, y1);
        canvas.lineTo(x2, y1 + len);
        canvas.stroke();
    }
}
