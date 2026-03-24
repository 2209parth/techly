import { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Techly — Best IT Company in Ahmedabad & Bhavnagar',
    short_name: 'Techly',
    description: 'Techly is a leading IT solutions provider in Ahmedabad and Bhavnagar, specializing in AI-based web and app development.',
    start_url: '/',
    display: 'standalone',
    background_color: '#000510',
    theme_color: '#0065FF',
    icons: [
      {
        src: '/icon.png',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        src: '/icon.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
