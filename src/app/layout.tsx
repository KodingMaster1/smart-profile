import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Smart Profile - AI-Powered CV & Job Assistant',
  description: 'Build your professional profile, find jobs, and get AI-powered career assistance',
  keywords: ['profile', 'CV', 'resume', 'job search', 'AI', 'career'],
  authors: [{ name: 'KodingMaster1' }],
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50">
          {children}
        </div>
      </body>
    </html>
  )
} 