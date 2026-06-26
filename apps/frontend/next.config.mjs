/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Transpila los paquetes internos del monorepo (codigo TypeScript sin compilar).
  transpilePackages: ["@biocall/shared"],
};

export default nextConfig;
