import type { Metadata } from 'next'
import { Archivo, Cormorant_Garamond } from 'next/font/google'
import './romano.css'

const archivo = Archivo({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-archivo',
  display: 'swap',
})

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-cormorant',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Romano Glass — The substance that shapes the project | Sydney',
  description:
    'Bespoke architectural glass, drawn and made in Sydney since 2008. Balustrades, glass doors, frameless showers, splashbacks and tailor-made glazing.',
}

export default function RomanoLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${archivo.variable} ${cormorant.variable}`}>{children}</div>
  )
}
