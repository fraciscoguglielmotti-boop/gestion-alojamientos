import type { Metadata } from 'next'
import { Fraunces, Inter } from 'next/font/google'
import './romano.css'

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-fraunces',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Romano Glass — Bespoke Architectural Glass, Sydney',
  description:
    'Frameless shower screens, splashbacks, balustrades and bespoke glazing, designed and installed across Sydney since 2008.',
}

export default function RomanoLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${fraunces.variable} ${inter.variable}`}>{children}</div>
  )
}
