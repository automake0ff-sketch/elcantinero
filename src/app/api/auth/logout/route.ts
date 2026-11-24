import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ ok: true, message: 'Sesión cerrada' });
  response.cookies.delete('cantinero_admin_session');
  return response;
}
