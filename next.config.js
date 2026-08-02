/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export' removed — needed for /api/sheets route to work on Vercel
  // If you want GitHub Pages static export, you cannot use API routes.
  // Vercel pe deploy karo for full functionality.
}

module.exports = nextConfig
