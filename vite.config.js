import { defineConfig } from 'vite';
import handlebars from 'vite-plugin-handlebars';
import path from 'path';
import fs from 'fs';
import sharp from 'sharp';
import tailwindcss from '@tailwindcss/vite';
import chokidar from 'chokidar';

// Хелпер для определения веса шрифта
function getFontWeight(style) {
  const weights = {
    'thin': 100,
    'extralight': 200,
    'light': 300,
    'regular': 400,
    'normal': 400,
    'medium': 500,
    'semibold': 600,
    'bold': 700,
    'extrabold': 800,
    'black': 900
  };
  
  return weights[style.toLowerCase()] || 400;
}

// Хелпер для определения формата
function getFormat(ext) {
  const formats = {
    'woff2': 'woff2',
    'woff': 'woff',
    'ttf': 'truetype',
    'otf': 'opentype'
  };
  
  return formats[ext] || ext;
}

// Плагин для автоматического подключения шрифтов
const fontAutoPlugin = () => {
  return {
    name: 'font-auto-plugin',
    
    async buildStart() {
      const fontsDir = path.resolve(__dirname, 'src/files/fonts');
      const cssOutputDir = path.resolve(__dirname, 'src/scss/main');
      const cssFilePath = path.join(cssOutputDir, 'fonts.scss');
      
      console.log('Looking for fonts in:', fontsDir);
      console.log('Output SCSS file:', cssFilePath);
      
      if (!fs.existsSync(fontsDir)) {
        console.log('Fonts directory not found, skipping font generation');
        return;
      }

      if (!fs.existsSync(cssOutputDir)) {
        fs.mkdirSync(cssOutputDir, { recursive: true });
        console.log('Created directory:', cssOutputDir);
      }

      try {
        const fontFiles = fs.readdirSync(fontsDir);
        console.log('Found font files:', fontFiles);
        
        const fontFaceRules = [];
        const fontFamilies = {};
        
        for (const file of fontFiles) {
          if (/\.(woff2|woff|ttf|otf)$/i.test(file)) {
            const fileName = path.parse(file).name;
            const ext = path.parse(file).ext.slice(1);
            
            console.log('Processing font:', fileName);
            
            // Парсим название шрифта
            const match = fileName.match(/(.*?)([-_](bold|italic|light|medium|regular|black|extrabold|semibold|thin|extralight))?$/i);
            const familyName = match[1].replace(/[-_]/g, ' ');
            const style = match[3] || 'regular';
            
            if (!fontFamilies[familyName]) {
              fontFamilies[familyName] = [];
            }
            
            fontFamilies[familyName].push({
              file,
              ext,
              style: style.toLowerCase(),
              weight: getFontWeight(style),
              isItalic: style.toLowerCase().includes('italic')
            });
          }
        }
        
        console.log('Font families:', Object.keys(fontFamilies));
        
        // Генерируем @font-face правила
        for (const [family, variants] of Object.entries(fontFamilies)) {
          for (const variant of variants) {
            const fontFaceRule = `
@font-face {
  font-family: '${family}';
  src: url('../../files/fonts/${variant.file}') format('${getFormat(variant.ext)}');
  font-weight: ${variant.weight};
  font-style: ${variant.isItalic ? 'italic' : 'normal'};
  font-display: swap;
}
            `.trim();
            fontFaceRules.push(fontFaceRule);
          }
        }
        
        // Записываем SCSS файл
        if (fontFaceRules.length > 0) {
          const cssContent = `/* Auto-generated font styles */\n${fontFaceRules.join('\n\n')}`;
          fs.writeFileSync(cssFilePath, cssContent);
          console.log(`✅ Generated fonts2.scss with ${fontFaceRules.length} @font-face rules`);
        } else {
          console.log('❌ No font face rules were generated');
        }
        
      } catch (error) {
        console.error('Error generating font styles:', error);
      }
    }
  };
};

// Кастомный плагин для замены алиасов в HTML
const aliasHtmlPlugin = () => {
  return {
    name: 'alias-html',
    transformIndexHtml(html) {
      const aliasMap = {
        '@img/': '/images/',
        '@scss/': './scss/',
        '@js/': './js/',
        '@bg/': './img/',
        '@fonts/': './fonts/'
      };
      
      let transformedHtml = html;
      for (const [alias, realPath] of Object.entries(aliasMap)) {
        transformedHtml = transformedHtml.replace(new RegExp(alias, 'g'), realPath);
      }
      
      return transformedHtml;
    },
  };
};

// Кастомный плагин для генерации WebP
// Кастомный плагин для генерации WebP
const webpGenerator = () => {
  let isBuild = false;
  let watcher = null;

  return {
    name: 'webp-generator',

    config(config, { command }) {
      isBuild = command === 'build';
    },

    async buildStart() {
      if (isBuild) return;

      const imagesDir = path.resolve(__dirname, 'src/images');
      const webpDir = path.resolve(__dirname, 'src/images/webp');

      if (!fs.existsSync(imagesDir)) {
        console.log('❌ Images directory not found:', imagesDir);
        return;
      }

      // Создаём папку webp, если её нет
      if (!fs.existsSync(webpDir)) {
        fs.mkdirSync(webpDir, { recursive: true });
        console.log('📁 Created: src/images/webp');
      }

      // Функция для генерации WebP
      const generateWebP = async (filePath) => {
        try {
          const fileName = path.parse(filePath).name;
          const ext = path.extname(filePath).toLowerCase();
          const outputFilePath = path.join(webpDir, `${fileName}.webp`);

          // Пропускаем не изображения
          if (!/\.(jpg|jpeg|png)$/i.test(ext)) return;

          await sharp(filePath)
            .webp({ quality: 90, effort: 4 })
            .toFile(outputFilePath);
          
          console.log(`✅ WebP generated: ${path.basename(outputFilePath)}`);
        } catch (error) {
          console.warn(`❌ Failed to generate WebP: ${error.message}`);
        }
      };

      // Обрабатываем уже существующие изображения при старте
      try {
        const files = fs.readdirSync(imagesDir);
        let processed = 0;
        
        for (const file of files) {
          if (/\.(jpg|jpeg|png)$/i.test(file)) {
            await generateWebP(path.join(imagesDir, file));
            processed++;
          }
        }
        
        console.log(`🔄 Processed ${processed} existing images`);
      } catch (error) {
        console.error('❌ Error reading images directory:', error);
      }
    },

    async configureServer(server) {
      if (isBuild) return;

      const imagesDir = path.resolve(__dirname, 'src/images');
      const webpDir = path.resolve(__dirname, 'src/images/webp');

      if (!fs.existsSync(imagesDir)) {
        console.log('❌ Images directory not found for watching');
        return;
      }

      // Функция для генерации WebP
      const generateWebP = async (filePath) => {
        try {
          const fileName = path.parse(filePath).name;
          const ext = path.extname(filePath).toLowerCase();
          const outputFilePath = path.join(webpDir, `${fileName}.webp`);

          // Пропускаем не изображения
          if (!/\.(jpg|jpeg|png)$/i.test(ext)) return;

          await sharp(filePath)
            .webp({ quality: 90, effort: 4 })
            .toFile(outputFilePath);
          
          console.log(`✅ WebP generated: ${path.basename(outputFilePath)}`);
        } catch (error) {
          console.warn(`❌ Failed to generate WebP: ${error.message}`);
        }
      };

      // Настраиваем отслеживание ВСЕХ изменений в папке
      watcher = chokidar.watch(imagesDir, {
        ignoreInitial: true,
        persistent: true,
        awaitWriteFinish: {
          stabilityThreshold: 1000,
          pollInterval: 100
        },
        depth: 1 // Только первый уровень вложенности
      });

      // Обрабатываем все события
      watcher
        .on('add', (filePath) => {
          console.log(`📸 New image added: ${path.basename(filePath)}`);
          generateWebP(filePath);
        })
        .on('change', (filePath) => {
          console.log(`📸 Image changed: ${path.basename(filePath)}`);
          generateWebP(filePath);
        })
        .on('unlink', (filePath) => {
          // Удаляем соответствующий webp файл при удалении оригинала
          if (/\.(jpg|jpeg|png)$/i.test(filePath)) {
            const webpPath = path.join(webpDir, `${path.parse(filePath).name}.webp`);
            if (fs.existsSync(webpPath)) {
              fs.unlinkSync(webpPath);
              console.log(`🗑️ Removed WebP: ${path.basename(webpPath)}`);
            }
          }
        });

      console.log('👀 Watching for image changes in src/images/...');
      
      // Останавливаем watcher при закрытии сервера
      server.httpServer?.once('close', async () => {
        if (watcher) {
          await watcher.close();
          console.log('👋 Stopped watching for images');
        }
      });
    },

    async closeBundle() {
      // Останавливаем watcher при завершении
      if (watcher) {
        await watcher.close();
      }

      if (!isBuild) return;

      // Генерация WebP для production
      const imagesDir = path.resolve(__dirname, 'src/images');
      const outputDir = path.resolve(__dirname, 'dist/images/webp');

      if (!fs.existsSync(imagesDir)) return;
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      try {
        const files = fs.readdirSync(imagesDir);
        for (const file of files) {
          if (/\.(jpg|jpeg|png)$/i.test(file)) {
            const inputPath = path.join(imagesDir, file);
            const outputPath = path.join(outputDir, `${path.parse(file).name}.webp`);

            await sharp(inputPath)
              .webp({ quality: 80, effort: 4 })
              .toFile(outputPath);
            console.log(`✅ Prod WebP: ${file}`);
          }
        }
      } catch (error) {
        console.error('❌ Error generating production WebP:', error);
      }
    },
  };
};

// Плагин для копирования дополнительных assets
const copyAssetsPlugin = () => {
  return {
    name: 'copy-assets',
    
    // Копируем при завершении сборки
    async closeBundle() {
      console.log('📋 Copying additional assets...');
      
      // Копируем ВСЕ оригинальные изображения из src/images в dist/images
      const imagesSrcDir = path.resolve(__dirname, 'src/images');
      const imagesDestDir = path.resolve(__dirname, 'dist/images');
      
      if (fs.existsSync(imagesSrcDir)) {
        if (!fs.existsSync(imagesDestDir)) {
          fs.mkdirSync(imagesDestDir, { recursive: true });
        }
        
        const imageFiles = fs.readdirSync(imagesSrcDir);
        for (const file of imageFiles) {
          // Копируем все изображения, кроме тех, что уже в webp папке
          if (!file.endsWith('.webp') && /\.(jpg|jpeg|png|gif|svg|ico)$/i.test(file)) {
            fs.copyFileSync(path.join(imagesSrcDir, file), path.join(imagesDestDir, file));
          }
        }
        console.log('✅ Original images copied to dist/images');
      }
      
      // Копируем только дополнительные файлы, которые не обрабатываются Vite
      const additionalAssets = [
        { 
          src: path.resolve(__dirname, 'src/files/icons'), 
          dest: path.resolve(__dirname, 'dist/files/icons') 
        },
        { 
          src: path.resolve(__dirname, 'src/files/docs'), 
          dest: path.resolve(__dirname, 'dist/files/docs') 
        },
        // Добавляем другие папки, которые нужно скопировать как есть
      ];
      
      for (const asset of additionalAssets) {
        if (fs.existsSync(asset.src)) {
          if (!fs.existsSync(asset.dest)) {
            fs.mkdirSync(asset.dest, { recursive: true });
          }
          
          const files = fs.readdirSync(asset.src);
          for (const file of files) {
            fs.copyFileSync(
              path.join(asset.src, file), 
              path.join(asset.dest, file)
            );
          }
          console.log(`✅ Copied: ${path.basename(asset.src)}`);
        }
      }
      
      // Копируем WebP изображения (если они были сгенерированы в src)
      const webpSrcDir = path.resolve(__dirname, 'src/images/webp');
      const webpDestDir = path.resolve(__dirname, 'dist/images/webp');
      
      if (fs.existsSync(webpSrcDir)) {
        if (!fs.existsSync(webpDestDir)) {
          fs.mkdirSync(webpDestDir, { recursive: true });
        }
        
        const webpFiles = fs.readdirSync(webpSrcDir);
        for (const file of webpFiles) {
          if (/\.webp$/i.test(file)) {
            fs.copyFileSync(path.join(webpSrcDir, file), path.join(webpDestDir, file));
          }
        }
        console.log('✅ WebP images copied');
      }
    }
  };
};

export default defineConfig({
  root: path.resolve(__dirname, 'src'),
  base: './',

  resolve: {
    alias: {
      '@img': path.resolve(__dirname, 'src/images'),
      '@scss': path.resolve(__dirname, 'src/scss'),
      '@js': path.resolve(__dirname, 'src/js'),
      '@bg': path.resolve(__dirname, 'src/img'),
      '@fonts': path.resolve(__dirname, 'src/files/fonts'),
    },
  },

  plugins: [
    fontAutoPlugin(),
    aliasHtmlPlugin(),
    webpGenerator(),
    handlebars({
      partialDirectory: path.resolve(__dirname, 'src/html/partials'),
      context: {
        title: {
          index: 'Главная',
        },
      },
      reloadOnPartialChange: true,
    }),
    copyAssetsPlugin(),
    tailwindcss(),
  ],

  build: {
    minify: true,
    sourcemap: 'inline',
    outDir: path.resolve(__dirname, 'dist'),
    
    // ⚡ ВАЖНО: настройка обработки assets для сохранения оригинальных имен
    assetsInlineLimit: 0, // Отключаем инлайнинг файлов
    rollupOptions: {
      output: {
        // Сохраняем оригинальные имена для шрифтов и изображений
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && /\.(woff|woff2|eot|ttf|otf)$/i.test(assetInfo.name)) {
            return `files/fonts/[name][extname]`;
          }
          if (assetInfo.name && /\.(jpg|jpeg|png|gif|svg|ico)$/i.test(assetInfo.name)) {
            return `images/[name][extname]`;
          }
          // Для остальных assets (CSS) оставляем хешированные имена в папке assets
          return `assets/[name]-[hash][extname]`;
        },
        // JS файлы попадают в assets
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
      },
      
      input: {
        index: path.resolve(__dirname, 'src/html/index.html'),
        ui_kit: path.resolve(__dirname, 'src/html/ui-kit.html'),
        error: path.resolve(__dirname, 'src/html/404.html'),
      },
    },
    emptyOutDir: true,
  },

  server: {
    open: '/html/index.html',
    watch: {
      usePolling: true,
      interval: 1000,
      ignored: ['**/node_modules/**', '**/.git/**'],
    },
  },
});