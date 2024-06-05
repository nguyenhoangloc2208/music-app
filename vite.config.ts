import { UserConfig, loadEnv  } from 'vite'
import react from '@vitejs/plugin-react-swc'

const youtubeApiUrl = 'https://www.googleapis.com';

// https://vitejs.dev/config/
export default ({ mode }: { mode: string }): UserConfig => {
  process.env = {...process.env, ...loadEnv(mode, process.cwd())};
  return ({
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: youtubeApiUrl,
          changeOrigin: true,   
          rewrite: (path) => {
            const urlObj = new URL(
              path,
              youtubeApiUrl + path.replace(/^\/api/, ''),
            );
            
            urlObj.searchParams.set('type', 'video');
            urlObj.searchParams.set('maxResults', '6');
            urlObj.searchParams.set('part', 'snippet');
            urlObj.searchParams.set(
              'key',
              process.env.VITE_YOUTUBE_API_KEY as string,
            );
            return urlObj
            .toString()
            .replace(youtubeApiUrl, '')
            .replace('/api', '');
          },
        },
      },
    },
    test: {
      environment: 'jsdom',
      globals: true,
      coverage: {
        include: ['src/**/*'],
      },
      setupFiles: ['src/test/setup.ts'],
    },
  })
} 