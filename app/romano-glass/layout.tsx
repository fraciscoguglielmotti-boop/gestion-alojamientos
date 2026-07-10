import type { Metadata } from 'next'
import { Cormorant_Garamond, Jost } from 'next/font/google'
import './romano.css'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

const jost = Jost({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-jost',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Romano Glass — Where light shapes the space | Sydney',
  description:
    'Bespoke architectural glass, drawn and made in Sydney since 2008. Balustrades, glass doors, frameless showers, splashbacks and tailor-made glazing.',
}

export default function RomanoLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${cormorant.variable} ${jost.variable}`}>{children}</div>
  )
}
