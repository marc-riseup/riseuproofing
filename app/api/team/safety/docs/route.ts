import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import { isSafetyAuthenticated } from '@/lib/safety-docs/auth';
import { SAFETY_DOCUMENTS } from '@/lib/safety-docs/data';

export async function GET(req: NextRequest) {
  // 1. Password Protection Check: strictly required for PDFs!
  if (!isSafetyAuthenticated(req)) {
    return NextResponse.json(
      {
        ok: false,
        errorEn: 'Access denied. Password required to view safety documents.',
        errorEs: 'Acceso denegado. Se requiere contraseña para ver los documentos de seguridad.',
      },
      { status: 401 }
    );
  }

  const { searchParams } = req.nextUrl;
  const docId = searchParams.get('id');
  const filenameParam = searchParams.get('file');
  const isDownload = searchParams.get('download') === '1';

  // 2. Identify the requested document
  const doc = SAFETY_DOCUMENTS.find(
    (d) => d.id === docId || d.filename === filenameParam || d.code.toLowerCase().replace(/\s+/g, '-') === docId
  );

  if (!doc) {
    return NextResponse.json(
      {
        ok: false,
        errorEn: 'Safety document not found.',
        errorEs: 'Documento de seguridad no encontrado.',
      },
      { status: 404 }
    );
  }

  // 3. Prevent path traversal & read from secured files directory
  const safeFilename = path.basename(doc.filename);
  const filePath = path.join(process.cwd(), 'lib', 'safety-docs', 'files', safeFilename);

  if (!fs.existsSync(filePath)) {
    return NextResponse.json(
      {
        ok: false,
        errorEn: 'Document file missing from server archive.',
        errorEs: 'El archivo del documento no se encuentra en el archivo del servidor.',
      },
      { status: 404 }
    );
  }

  const fileBuffer = fs.readFileSync(filePath);

  const dispositionType = isDownload ? 'attachment' : 'inline';
  const headers = new Headers();
  headers.set('Content-Type', 'application/pdf');
  headers.set('Content-Length', fileBuffer.length.toString());
  headers.set('Content-Disposition', `${dispositionType}; filename="${safeFilename}"`);
  headers.set('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');

  return new Response(fileBuffer, {
    status: 200,
    headers,
  });
}
