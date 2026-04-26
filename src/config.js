// ─── WhatsApp ─────────────────────────────────────────────────────────────────
// Replace with the real WhatsApp number (digits only, include country code)
export const WA_NUMBER = '233548721544'   // e.g. '233241234567'

// ─── MoMo ─────────────────────────────────────────────────────────────────────
// Number customers send tournament entry fees to. Displayed on the
// registration form when "Pay now via MoMo" is selected.
export const MOMO_NUMBER = '0548721544'
export const MOMO_NAME = 'Rahitalu Game Lounge'

// ─── API ──────────────────────────────────────────────────────────────────────
const isDev = window.location.hostname === 'localhost'
export const API_BASE_URL = isDev
  ? 'http://localhost:5715/gc'
  : 'https://datahub-wfqk.onrender.com/gc'

// ─── EmailJS ──────────────────────────────────────────────────────────────────
// 1. Go to https://www.emailjs.com  →  sign up free
// 2. Add an Email Service (Gmail works) → copy the Service ID below
// 3. Create an Email Template → copy the Template ID below
//    Template variables to use in your template:
//      {{from_name}}  {{from_phone}}  {{message}}
// 4. Go to Account → API Keys → copy your Public Key below
export const EMAILJS_SERVICE_ID  = 'YOUR_SERVICE_ID'
export const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID'
export const EMAILJS_PUBLIC_KEY  = 'YOUR_PUBLIC_KEY'
