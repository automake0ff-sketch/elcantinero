import restauranteData from '@/data/restaurante.json';

export function getRestaurantJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    '@id': 'https://elcantinerotapas.es/#restaurant',
    name: restauranteData.nombre,
    alternateName: 'Bar El Cantinero Tapas Sevilla',
    description:
      'Bar de tapas caseras, raciones abundantes y desayunos tradicionales en Sevilla Este. Famoso por sus croquetas de jamón ibérico y cocina tradicional.',
    url: 'https://elcantinerotapas.es',
    telephone: restauranteData.telefonoHref,
    priceRange: '€',
    servesCuisine: ['Española', 'Andaluza', 'Tapas Tradicionales', 'Desayunos'],
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Calle Periodista Juan Tribuna, 5',
      addressLocality: 'Sevilla',
      addressRegion: 'Sevilla',
      postalCode: '41020',
      addressCountry: 'ES',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 37.4042,
      longitude: -5.9268,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '07:00',
        closes: '17:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Saturday', 'Sunday'],
        opens: '08:00',
        closes: '16:30',
      },
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: restauranteData.totalResenasGoogle.toString(),
      bestRating: '5',
      worstRating: '1',
    },
    hasMenu: 'https://elcantinerotapas.es/carta',
    image: [
      'https://elcantinerotapas.es/assets/imagenes/platos/croquetas-jamon.svg',
      'https://elcantinerotapas.es/assets/imagenes/galeria/terraza.svg',
    ],
  };
}
