import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})

// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';

// export default defineConfig({
//   plugins: [react()],
//   server: {
//     host: '0.0.0.0', // Allow external access (required for ngrok)
//     port: 3000,      // Ensure this matches your ngrok port
//     allowedHosts: ['.ngrok-free.app'], // Allow all ngrok subdomain
//   },
// });
