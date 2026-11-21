import { NextRequest, NextResponse } from 'next/server';
import {
  SAFETY_PORTAL_PASSWORD,
  SAFETY_COOKIE_NAME,
  generateSafetyToken,
  isSafetyAuthenticated,
} from '@/lib/safety-docs/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const password = typeof body.password === 'string' ? body.password.trim() : '';

    if (password !== SAFETY_PORTAL_PASSWORD) {
      return NextResponse.json(
        {
          ok: false,
          errorEn: 'Incorrect password. Please contact Christian Lavalle or Marc Sarellano.',
          errorEs: 'Contraseña incorrecta. Comuníquese con Christian Lavalle o Marc Sarellano.',
        },
        { status: 401 }
      );
    }

    const token = generateSafetyToken();
    const res = NextResponse.json({
      ok: true,
      token,
      messageEn: 'Welcome to the Rise Up Employee Safety Portal.',
      messageEs: 'Bienvenido al Portal de Seguridad de Empleados de Rise Up.',
    });

    // Set secure persistent cookie for 30 days
    res.cookies.set({
      name: SAFETY_COOKIE_NAME,
      value: token,
      path: '/',
      httpOnly: false, // Accessible to client-side fetch & inline document openers
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return res;
  } catch (err) {
    return NextResponse.json(
      { ok: false, errorEn: 'Server error processing request.', errorEs: 'Error del servidor al procesar la solicitud.' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const authenticated = isSafetyAuthenticated(req);
  return NextResponse.json({
    authenticated,
    token: authenticated ? generateSafetyToken() : null,
  });
}

export async function DELETE() {
  const res = NextResponse.json({
    ok: true,
    messageEn: 'Logged out successfully.',
    messageEs: 'Sesión cerrada exitosamente.',
  });

  res.cookies.set({
    name: SAFETY_COOKIE_NAME,
    value: '',
    path: '/',
    maxAge: 0,
  });

  return res;
}
