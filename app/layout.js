import { Space_Grotesk, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-space',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-mono',
})

export const metadata = {
  title: 'Ashish Kumar Prajapati — AI/ML Developer',
  description: 'B.Tech CSE (AI/ML) @ SRIMT Lucknow. AI Intern @ Techpile Technology. Building intelligent systems with Python, Computer Vision & Machine Learning.',
  keywords: ['Python', 'AI', 'ML', 'Computer Vision', 'OpenCV', 'TensorFlow', 'Flask', 'Lucknow'],
  authors: [{ name: 'Ashish Kumar Prajapati' }],
  openGraph: {
    title: 'Ashish Kumar Prajapati — AI/ML Developer',
    description: 'Python Dev · AI/ML Engineer · Lucknow 🇮🇳',
    type: 'website',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${jetbrainsMono.variable}`}>
      <body>{children}</body>
    </html>
  )
}
