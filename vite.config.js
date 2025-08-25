import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,   // 👉 원하는 포트 번호 (예: 3000)
    host: true,   // 👉 0.0.0.0 으로 열어서 같은 네트워크 기기에서도 접속 가능
  },
})
