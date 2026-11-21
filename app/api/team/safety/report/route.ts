import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

const CHRISTIAN_EMAIL = 'chris@riseuprac.com';
const LOG_FILE_PATH = path.join(process.cwd(), 'lib', 'safety-docs', 'hazard-reports.log');

export async function POST(req: NextRequest) {
  try {
    let date = '';
    let location = '';
    let hazardDescription = '';
    let actionTaken = '';
    let reporterName = '';
    let reporterPhone = '';
    let photoFilename = '';
    let photoSize = 0;
    let photoBase64 = '';

    const contentType = req.headers.get('content-type') || '';

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();

      // Honeypot anti-spam check
      const honeypot = formData.get('company_website') || formData.get('hp_email');
      if (honeypot) {
        // Silently accept bot submission
        return NextResponse.json({ ok: true, message: 'Report submitted' });
      }

      date = (formData.get('date') as string) || '';
      location = (formData.get('location') as string) || '';
      hazardDescription =
        (formData.get('hazardDescription') as string) || (formData.get('hazard') as string) || '';
      actionTaken = (formData.get('actionTaken') as string) || '';
      reporterName = (formData.get('reporterName') as string) || (formData.get('name') as string) || '';
      reporterPhone = (formData.get('reporterPhone') as string) || (formData.get('phone') as string) || '';

      const photoFile = formData.get('photo') as File | null;
      if (photoFile && photoFile.size > 0 && photoFile.name) {
        photoFilename = photoFile.name;
        photoSize = photoFile.size;
        const arrayBuffer = await photoFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        photoBase64 = buffer.toString('base64');
      }
    } else {
      const json = await req.json().catch(() => ({}));

      // Honeypot check
      if (json.company_website || json.hp_email) {
        return NextResponse.json({ ok: true, message: 'Report submitted' });
      }

      date = json.date || '';
      location = json.location || json.jobsite || '';
      hazardDescription = json.hazardDescription || json.hazard || '';
      actionTaken = json.actionTaken || '';
      reporterName = json.reporterName || json.name || '';
      reporterPhone = json.reporterPhone || json.phone || '';
      if (json.photoBase64) {
        photoBase64 = json.photoBase64;
        photoFilename = json.photoFilename || 'hazard_photo.jpg';
        photoSize = Math.round((photoBase64.length * 3) / 4);
      }
    }

    // Validation: Date, Location, and Hazard Description are required
    if (!date.trim() || !location.trim() || !hazardDescription.trim()) {
      return NextResponse.json(
        {
          ok: false,
          errorEn: 'Date, jobsite location, and hazard description are required.',
          errorEs: 'La fecha, la ubicación del sitio de trabajo y la descripción del peligro son obligatorias.',
        },
        { status: 400 }
      );
    }

    const isAnonymous = !reporterName.trim();
    const displayName = isAnonymous ? 'ANONYMOUS / ANÓNIMO' : reporterName.trim();
    const displayPhone = reporterPhone.trim() || 'Not provided / No proporcionado';

    const timestamp = new Date().toISOString();
    const reportRecord = {
      id: `HAZ-${Date.now().toString(36).toUpperCase()}`,
      timestamp,
      date: date.trim(),
      location: location.trim(),
      hazardDescription: hazardDescription.trim(),
      actionTaken: actionTaken.trim() || 'None reported / Ninguna reportada',
      reporterName: displayName,
      reporterPhone: displayPhone,
      isAnonymous,
      recipient: CHRISTIAN_EMAIL,
      photoFilename,
      photoSizeKb: Math.round(photoSize / 1024),
    };

    // 1. Persist to local append-only hazard ledger
    try {
      const logEntry = JSON.stringify(reportRecord) + '\n';
      fs.appendFileSync(LOG_FILE_PATH, logEntry, 'utf8');
    } catch (logErr) {
      console.error('[SAFETY HAZARD LEDGER WRITE ERROR]', logErr);
    }

    // 2. Dispatch email to Christian Lavalle (chris@riseuprac.com)
    const emailSubject = `🚨 [SAFETY HAZARD REPORT] Jobsite: ${reportRecord.location} (${reportRecord.date})`;
    const emailBody = `
===================================================================
RISE UP ROOFING & CONSTRUCTION - EMPLOYEE SAFETY HAZARD REPORT
===================================================================
DISPATCH TO: Christian Lavalle <${CHRISTIAN_EMAIL}>
RECORD ID:   ${reportRecord.id}
SUBMITTED:   ${timestamp}
===================================================================

1. DATE OF HAZARD / FECHA:
   ${reportRecord.date}

2. JOBSITE OR LOCATION / SITIO O UBICACIÓN:
   ${reportRecord.location}

3. HAZARD DESCRIPTION / DESCRIPCIÓN DEL PELIGRO:
   ${reportRecord.hazardDescription}

4. WHAT WAS DONE ABOUT IT / ACCIÓN TOMADA (SI HUBO ALGUNA):
   ${reportRecord.actionTaken}

5. REPORTER / REPORTADO POR:
   ${reportRecord.reporterName}

6. CONTACT PHONE / TELÉFONO DE CONTACTO:
   ${reportRecord.reporterPhone}

7. PHOTO ATTACHMENT / FOTO ADJUNTA:
   ${photoFilename ? `Yes (${photoFilename}, ~${reportRecord.photoSizeKb} KB)` : 'None attached / Sin foto'}

===================================================================
CAL/OSHA NON-RETALIATION NOTICE:
"No one will be punished for reporting a hazard or an injury."
"Nadie será castigado por reportar un peligro o una lesión."
===================================================================
`;

    console.log(`[SAFETY HAZARD DISPATCH TO ${CHRISTIAN_EMAIL}]`, emailBody);

    // Optional external email service dispatch if configured
    if (process.env.RESEND_API_KEY) {
      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: 'Rise Up Safety Portal <safety@riseuprac.com>',
            to: [CHRISTIAN_EMAIL],
            reply_to: reporterPhone.includes('@') ? reporterPhone : undefined,
            subject: emailSubject,
            text: emailBody,
            attachments: photoBase64
              ? [
                  {
                    filename: photoFilename || 'jobsite-hazard.jpg',
                    content: photoBase64,
                  },
                ]
              : undefined,
          }),
        });
      } catch (emailErr) {
        console.error('[RESEND DISPATCH ERROR]', emailErr);
      }
    }

    return NextResponse.json({
      ok: true,
      success: true,
      reportId: reportRecord.id,
      recipient: CHRISTIAN_EMAIL,
      messageEn: 'Thank you for keeping our crew safe. Your report has been dispatched to Christian Lavalle (chris@riseuprac.com).',
      messageEs: 'Gracias por mantener seguro a nuestro equipo. Su reporte ha sido enviado a Christian Lavalle (chris@riseuprac.com).',
    });
  } catch (err: unknown) {
    console.error('[HAZARD REPORT SERVER ERROR]', err);
    return NextResponse.json(
      {
        ok: false,
        errorEn: 'An unexpected error occurred while processing your report. Please call Christian or Marc directly.',
        errorEs: 'Ocurrió un error inesperado al procesar su reporte. Llame directamente a Christian o Marc.',
      },
      { status: 500 }
    );
  }
}
