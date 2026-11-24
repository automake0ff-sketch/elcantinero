import type { Metadata, Viewport } from 'next';
import './globals.css';
import { getRestaurantJsonLd } from '@/lib/seo';
import restauranteData from '@/data/restaurante.json';

export const viewport: Viewport = {
  themeColor: '#0E0D0B',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://elcantinerotapas.es'),
  title: {
    default: 'El Cantinero Tapas | Bar de Tapas y Desayunos en Sevilla Este',
    template: '%s | El Cantinero Tapas Sevilla',
  },
  description:
    'El Cantinero Tapas en Sevilla Este (C. Periodista Juan Tribuna, 5). Especialistas en croquetas caseras de jamón ibérico, ensaladilla rusa, carnes y desayunos tradicionales andaluces. Tel: 642 01 90 26.',
  keywords: [
    'El Cantinero Tapas',
    'bar de tapas Sevilla Este',
    'desayunos Sevilla Este',
    'croquetas caseras Sevilla',
    'restaurante Calle Periodista Juan Tribuna',
    'comer en Sevilla Este',
    'tapas tradicionales Sevilla',
    'tapeo andaluz',
  ],
  authors: [{ name: 'El Cantinero Tapas' }],
  creator: 'El Cantinero Tapas',
  icons: {
    icon: '/assets/imagenes/identidad/favicon.svg',
    apple: '/assets/imagenes/identidad/favicon.svg',
  },
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: 'https://elcantinerotapas.es',
    siteName: 'El Cantinero Tapas',
    title: 'El Cantinero Tapas | Bar de Tapas & Desayunos en Sevilla Este',
    description:
      'Auténtico sabor del tapeo sevillano, raciones caseras y desayunos tradicionales en la C. Periodista Juan Tribuna, 5. Valorado con 4.8★ en Google.',
    images: [
      {
        url: '/assets/imagenes/platos/croquetas-jamon.svg',
        width: 1200,
        height: 630,
        alt: 'Croquetas de Jamón Ibérico de El Cantinero Tapas Sevilla',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'El Cantinero Tapas | Sevilla Este',
    description: 'Tapas tradicionales, desayunos con solera y raciones caseras en Sevilla Este.',
    images: ['/assets/imagenes/platos/croquetas-jamon.svg'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = getRestaurantJsonLd();

  return (
    <html lang="es" className="h-full scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#0E0D0B] text-[#FDFCF7] antialiased selection:bg-[#E5A93C] selection:text-[#0E0D0B]">
        {children}
      </body>
    </html>
  );
}
