import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

interface ContactEmailData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

function buildSubjectLabel(subject: string): string {
  const labels: Record<string, string> = {
    'booking-inquiry': 'Booking Inquiry',
    'special-event': 'Special Event Planning',
    'spa-wellness': 'Spa & Wellness',
    'corporate': 'Corporate Retreat',
    'general': 'General Inquiry',
    'feedback': 'Feedback',
  };
  return labels[subject] || subject;
}

function buildHtmlEmail(data: ContactEmailData): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;background-color:#FAF4E6;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#FAF4E6;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.06);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#C49A3C,#8B6914);padding:32px 40px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:26px;letter-spacing:1px;">NAGAS Resort &amp; Spa</h1>
              <p style="margin:8px 0 0;color:rgba(255,255,255,0.85);font-size:13px;letter-spacing:2px;text-transform:uppercase;">New Contact Message</p>
            </td>
          </tr>

          <!-- Subject Badge -->
          <tr>
            <td style="padding:28px 40px 0;">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background-color:#FFF4E0;border:1px solid #C49A3C;border-radius:20px;padding:6px 18px;">
                    <span style="color:#8B6914;font-size:12px;font-weight:600;letter-spacing:0.5px;">${buildSubjectLabel(data.subject)}</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Sender Info -->
          <tr>
            <td style="padding:24px 40px 0;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F5F8FD;border-radius:12px;">
                <tr>
                  <td style="padding:24px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td width="50%" style="padding-bottom:16px;">
                          <p style="margin:0;color:#8B6914;font-size:11px;text-transform:uppercase;letter-spacing:1px;font-weight:600;">From</p>
                          <p style="margin:4px 0 0;color:#1B2A4A;font-size:15px;font-weight:600;">${data.name}</p>
                        </td>
                        <td width="50%" style="padding-bottom:16px;">
                          <p style="margin:0;color:#8B6914;font-size:11px;text-transform:uppercase;letter-spacing:1px;font-weight:600;">Email</p>
                          <p style="margin:4px 0 0;color:#1B2A4A;font-size:15px;"><a href="mailto:${data.email}" style="color:#C49A3C;text-decoration:none;">${data.email}</a></p>
                        </td>
                      </tr>
                      <tr>
                        <td width="50%">
                          <p style="margin:0;color:#8B6914;font-size:11px;text-transform:uppercase;letter-spacing:1px;font-weight:600;">Phone</p>
                          <p style="margin:4px 0 0;color:#1B2A4A;font-size:15px;">${data.phone || '—'}</p>
                        </td>
                        <td width="50%">
                          <p style="margin:0;color:#8B6914;font-size:11px;text-transform:uppercase;letter-spacing:1px;font-weight:600;">Date</p>
                          <p style="margin:4px 0 0;color:#1B2A4A;font-size:15px;">${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Message -->
          <tr>
            <td style="padding:24px 40px 0;">
              <p style="margin:0 0 8px;color:#8B6914;font-size:11px;text-transform:uppercase;letter-spacing:1px;font-weight:600;">Message</p>
              <div style="background-color:#FAF4E6;border-left:4px solid #C49A3C;border-radius:0 8px 8px 0;padding:20px 24px;">
                <p style="margin:0;color:#3D2B1F;font-size:15px;line-height:1.7;">${data.message.replace(/\n/g, '<br/>')}</p>
              </div>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:28px 40px 0;">
              <hr style="border:none;border-top:1px solid #E8E0D0;" />
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 40px 32px;text-align:center;">
              <p style="margin:0;color:#8B6914;font-size:11px;letter-spacing:1px;text-transform:uppercase;">NAGAS Resort &amp; Spa</p>
              <p style="margin:6px 0 0;color:#3D2B1F;font-size:12px;">123 Sunset Cove Drive, Jaffna, Sri Lanka</p>
              <p style="margin:4px 0 0;color:#3D2B1F;font-size:12px;">+66 (0) 123 456 789 | hello@nagasresort.com</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function sendContactEmail(data: ContactEmailData) {
  const info = await transporter.sendMail({
    from: `"NAGAS Resort Website" <${process.env.SMTP_USER}>`,
    to: 'mosesnirupan@gmail.com',
    replyTo: data.email,
    subject: `[NAGAS Resort] ${buildSubjectLabel(data.subject)} — ${data.name}`,
    html: buildHtmlEmail(data),
  });

  return info;
}
