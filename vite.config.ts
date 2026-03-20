import path from 'path';
import fs from 'fs';
import { exec } from 'child_process';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
      proxy: {
        '/api': {
          target: 'http://localhost:3001',
          changeOrigin: true,
        }
      }
    },
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
    },
    plugins: [
      react(),
      {
        name: 'local-content-api',
        configureServer(server) {
          // Save Content Endpoint
          server.middlewares.use('/api/admin/content', (req, res, next) => {
            if (req.method === 'POST') {
              let body = '';
              req.on('data', (chunk) => {
                body += chunk.toString();
              });
              req.on('end', () => {
                try {
                  const filePath = path.resolve(__dirname, 'src/data/homeContent.json');
                  const backupDir = path.resolve(__dirname, 'src/data/.backups');

                  // Create backup of current file before overwriting
                  if (fs.existsSync(filePath)) {
                    if (!fs.existsSync(backupDir)) {
                      fs.mkdirSync(backupDir, { recursive: true });
                    }
                    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
                    const backupPath = path.join(backupDir, `homeContent-${timestamp}.json`);
                    fs.copyFileSync(filePath, backupPath);
                  }

                  const json = JSON.parse(body);
                  fs.writeFileSync(filePath, JSON.stringify(json, null, 4));
                  res.setHeader('Content-Type', 'application/json');
                  res.statusCode = 200;
                  res.end(JSON.stringify({ success: true }));
                } catch (e) {
                  console.error('Error saving content:', e);
                  res.statusCode = 500;
                  res.end(JSON.stringify({ error: 'Failed to save content' }));
                }
              });
              return;
            }
            next();
          });

          // Push to Git Endpoint
          server.middlewares.use('/api/admin/push', (req, res, next) => {
            if (req.method === 'POST') {
              exec('git add src/data/homeContent.json && git commit -m "Content Update via Content Engine" && git push', (error, stdout, stderr) => {
                res.setHeader('Content-Type', 'application/json');
                if (error) {
                  console.error('Git Push Error:', stderr);
                  res.statusCode = 500;
                  res.end(JSON.stringify({ error: 'Failed to push changes', details: stderr }));
                  return;
                }
                res.statusCode = 200;
                res.end(JSON.stringify({ success: true, output: stdout }));
              });
              return;
            }
            next();
          });

          // List Backups Endpoint
          server.middlewares.use('/api/admin/backups', (req, res, next) => {
            if (req.method === 'GET') {
              const backupDir = path.resolve(__dirname, 'src/data/.backups');
              if (!fs.existsSync(backupDir)) {
                res.end(JSON.stringify([]));
                return;
              }
              const files = fs.readdirSync(backupDir)
                .filter(f => f.endsWith('.json'))
                .map(f => ({
                  name: f,
                  time: fs.statSync(path.join(backupDir, f)).mtime
                }))
                .sort((a, b) => b.time.getTime() - a.time.getTime());

              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(files));
              return;
            }
            next();
          });

          // Restore Backup Endpoint
          server.middlewares.use('/api/admin/restore', (req, res, next) => {
            if (req.method === 'POST') {
              let body = '';
              req.on('data', chunk => body += chunk);
              req.on('end', () => {
                try {
                  const { filename } = JSON.parse(body);
                  const backupPath = path.resolve(__dirname, 'src/data/.backups', filename);
                  const targetPath = path.resolve(__dirname, 'src/data/homeContent.json');

                  if (fs.existsSync(backupPath)) {
                    fs.copyFileSync(backupPath, targetPath);
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({ success: true }));
                  } else {
                    throw new Error('Backup not found');
                  }
                } catch (e) {
                  res.statusCode = 500;
                  res.end(JSON.stringify({ error: 'Restore failed' }));
                }
              });
              return;
            }
            next();
          });
        }
      }
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    },
    build: {
      target: 'es2020',
      minify: 'esbuild',
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-react': ['react', 'react-dom'],
            'vendor-three': ['three', '@react-three/fiber', '@react-three/drei'],
            'vendor-framer': ['framer-motion'],
            'vendor-ui': ['lucide-react'],
          },
        },
      },
    }
  };
});
