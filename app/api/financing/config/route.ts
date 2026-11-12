import { NextResponse } from 'next/server';

function getBackendUrl(): string | null {
  return (
    process.env.FASTAPI_BACKEND_URL ||
    (process.env.USE_FASTAPI === 'true' ? 'http://127.0.0.1:8000' : null)
  );
}

export async function GET() {
  const backendUrl = getBackendUrl();
  if (backendUrl) {
    try {
      const res = await fetch(`${backendUrl}/api/financing/config`, {
        next: { revalidate: 60 },
        headers: {
          'x-api-key': process.env.RISEUP_API_KEY || '',
          'Content-Type': 'application/json',
        },
      });
      if (res.ok) {
        const data = await res.json();
        if (data?.ok) return NextResponse.json(data);
      }
    } catch {
      // Fall back to client INITIAL_PLANS when backend is unreachable
    }
  }
  return NextResponse.json({ ok: true, plans: [], fallback: true });
}
