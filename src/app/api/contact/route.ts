import { NextResponse } from 'next/server';
import { sendContactEmail } from '@/backend/mail/nodemailer';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Name, email, subject, and message are required.' },
        { status: 400 },
      );
    }

    const info = await sendContactEmail({
      name: String(name),
      email: String(email),
      phone: String(phone || ''),
      subject: String(subject),
      message: String(message),
    });

    return NextResponse.json({ success: true, messageId: info.messageId });
  } catch (error) {
    console.error('Contact email error:', error);
    return NextResponse.json(
      { error: 'Failed to send message. Please try again later.' },
      { status: 500 },
    );
  }
}
