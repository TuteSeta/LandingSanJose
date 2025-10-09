/** @type {import('next').NextConfig} */
const nextConfig = {
  // para generar HTML estático
  output: 'export',

  // permitir imágenes remotas y desactivar optimización (requerido en export)
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: '**' }, // o poné tus dominios concretos
    ],
  },


};

export default nextConfig;
