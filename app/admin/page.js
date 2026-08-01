// app/admin/page.js
// ================================================================
// /admin route — password-protected admin dashboard
// URL: yoursite.com/admin
// ================================================================

import AdminPanel from '../../components/AdminPanel';

export const metadata = {
  title: 'Admin — Ashish Portfolio',
  robots: 'noindex, nofollow', // Google mein index nahi hoga
};

export default function AdminPage() {
  return <AdminPanel />;
}
