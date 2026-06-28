import { Poppins } from 'next/font/google'
import MenuBar from './components/menubar/menubar'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})

export const metadata = {
  title: 'SANEM - Sistema de Doações',
  description: 'Sistema de gestão de doações e beneficiários',
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className={poppins.className}>
        <MenuBar />
        {children}
      </body>
    </html>
  )
}
