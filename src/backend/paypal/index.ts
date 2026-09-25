const PAYPAL_API =
  process.env.PAYPAL_ENV === 'live'
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com';

export const PAYPAL_CURRENCY = 'USD';

export class PaypalError extends Error {
  status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.name = 'PaypalError';
    this.status = status;
  }
}

interface TokenCache {
  token: string;
  expiresAt: number;
}

interface PayPalTokenResponse {
  access_token?: string;
  expires_in?: number;
  error_description?: string;
}

interface PayPalLink {
  rel?: string;
  href?: string;
}

interface PayPalOrderResponse {
  id?: string;
  links?: PayPalLink[];
  message?: string;
}

interface PayPalCapture {
  id?: string;
  status?: string;
}

interface PayPalCaptureResponse {
  status?: string;
  message?: string;
  details?: { issue?: string }[];
  payer?: { name?: { given_name?: string; surname?: string } };
  purchase_units?: {
    payments?: {
      captures?: (PayPalCapture & { amount?: { value?: string } })[];
    };
  }[];
}

let tokenCache: TokenCache | undefined;

function paypalConfigured(): boolean {
  return Boolean(process.env.PAYPAL_CLIENT_ID && process.env.PAYPAL_CLIENT_SECRET);
}

async function getAccessToken(): Promise<string> {
  if (!paypalConfigured()) {
    throw new PaypalError('PayPal is not configured on this site.', 503);
  }
  if (tokenCache && tokenCache.expiresAt > Date.now()) {
    return tokenCache.token;
  }

  const res = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(
        `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
      ).toString('base64')}`,
    },
    body: 'grant_type=client_credentials',
    cache: 'no-store',
  });

  const json: PayPalTokenResponse = await res.json().catch(() => ({}));
  if (!res.ok || !json.access_token) {
    throw new PaypalError(
      json?.error_description || 'Unable to authenticate with PayPal.',
      res.status
    );
  }

  tokenCache = {
    token: json.access_token,
    expiresAt: Date.now() + (Number(json.expires_in) - 60) * 1000,
  };
  return tokenCache.token;
}

export async function createPayPalOrder(
  amount: number,
  description: string,
  referenceId: string
): Promise<{ id: string; approveLink?: string }> {
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new PaypalError('A payable amount is required to start PayPal checkout.', 400);
  }

  const token = await getAccessToken();
  const res = await fetch(`${PAYPAL_API}/v2/checkout/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      intent: 'CAPTURE',
      purchase_units: [
        {
          reference_id: referenceId,
          description,
          amount: {
            currency_code: PAYPAL_CURRENCY,
            value: amount.toFixed(2),
          },
        },
      ],
    }),
    cache: 'no-store',
  });

  const json: PayPalOrderResponse = await res.json().catch(() => ({}));
  if (!res.ok || !json.id) {
    throw new PaypalError(json?.message || 'Unable to create the PayPal order.', res.status);
  }

  const approveLink = (json.links || [])
    .find((link: PayPalLink) => link.rel === 'approve')?.href;

  return { id: json.id, approveLink };
}

export async function capturePayPalOrder(
  orderId: string
): Promise<{ captureId: string; payerName?: string; grossAmount: number }> {
  const token = await getAccessToken();
  const res = await fetch(`${PAYPAL_API}/v2/checkout/orders/${orderId}/capture`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-store',
  });

  const json: PayPalCaptureResponse = await res.json().catch(() => ({}));
  if (!res.ok || json.status !== 'COMPLETED') {
    throw new PaypalError(
      json?.message || json?.details?.[0]?.issue || 'Payment was not completed.',
      res.status === 200 ? 400 : res.status
    );
  }

  const captures = json.purchase_units?.[0]?.payments?.captures || [];
  const capture = captures.find((c) => c.status === 'COMPLETED') || captures[0];
  const payerName = json.payer?.name
    ? [json.payer.name.given_name, json.payer.name.surname].filter(Boolean).join(' ')
    : '';
  const grossAmount = Number(capture?.amount?.value) || 0;

  return {
    captureId: capture?.id || orderId,
    payerName,
    grossAmount,
  };
}