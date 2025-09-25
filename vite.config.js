import { defineConfig } from 'vite';
import handlebars from 'vite-plugin-handlebars';
import path from 'path';
import fs from 'fs';
import sharp from 'sharp';
import tailwindcss from '@tailwindcss/vite';

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

// Улучшенный плагин для копирования dist в docs с исправлением HTML
const copyDistToDocs = () => {
  return {
    name: 'copy-dist-to-docs',
    apply: 'build',

    async writeBundle() {
      console.log('📁 Copying dist to docs...');

      const distDir = path.resolve(__dirname, 'dist');
      const docsDir = path.resolve(__dirname, 'docs');

      if (!fs.existsSync(distDir)) {
        console.log('❌ dist directory not found');
        return;
      }

      // Ждем завершения всех других плагинов
      await new Promise(resolve => setTimeout(resolve, 2000));

      if (fs.existsSync(docsDir)) {
        console.log('🗑️ Cleaning docs directory...');
        fs.rmSync(docsDir, { recursive: true });
      }
      fs.mkdirSync(docsDir, { recursive: true });

      // Простая рекурсивная функция копирования
      const copyRecursiveSync = (src, dest) => {
        if (!fs.existsSync(src)) return;
        
        const stats = fs.statSync(src);
        
        if (stats.isDirectory()) {
          if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, { recursive: true });
          }
          
          const items = fs.readdirSync(src);
          for (const item of items) {
            if (item === 'html') continue;
            copyRecursiveSync(path.join(src, item), path.join(dest, item));
          }
        } else {
          fs.copyFileSync(src, dest);
        }
      };

      // Копируем всё из dist в docs, кроме html папки
      copyRecursiveSync(distDir, docsDir);
      console.log('✅ Basic structure copied');

      // Обрабатываем HTML файлы отдельно
      const htmlDir = path.join(distDir, 'html');
      if (fs.existsSync(htmlDir)) {
        const htmlFiles = fs.readdirSync(htmlDir).filter(f => f.endsWith('.html'));
        for (const htmlFile of htmlFiles) {
          const srcPath = path.join(htmlDir, htmlFile);
          const destPath = path.join(docsDir, htmlFile);
          
          if (fs.existsSync(srcPath)) {
            fs.copyFileSync(srcPath, destPath);

            console.log(`🔧 Fixing HTML quotes in: ${htmlFile}`);
            
            // Читаем содержимое HTML файла
            let content = fs.readFileSync(destPath, 'utf8');
            
            // 1. Исправляем пути в HTML файлах
            content = content
              .replace(/(src|href|data-src|srcset)=["']\/(assets|images|files)\//g, '$1="./$2/')
              .replace(/(src|href|data-src|srcset)=["']\.\.\/(assets|images|files)\//g, '$1="./$2/')
              .replace(/(src|href|data-src|srcset)=["']\.(?!\.)\//g, '$1="./');

            // 2. Исправляем проблему с кавычками в picture тегах
            // Первый проход: исправляем смешанные кавычки в source тегах
            content = content.replace(
              /<picture>\s*<source\s+srcset=("|')([^"']+)("|')\s+type=("|')image\/webp("|')\s*>/gi,
              (match, quote1, srcset, quote2, quote3, quote4) => {
                // Унифицируем кавычки - используем двойные везде
                return `<picture><source srcset="${srcset}" type="image/webp">`;
              }
            );

            // Второй проход: исправляем случай, когда кавычки вообще отсутствуют
            content = content.replace(
              /<picture>\s*<source\s+srcset=([^\s>]+)\s+type=([^\s>]+)\s*>/gi,
              (match, srcset, type) => {
                // Добавляем кавычки, если их нет
                const fixedSrcset = srcset.includes('"') ? srcset : `"${srcset}"`;
                const fixedType = type.includes('"') ? type : `"${type}"`;
                return `<picture><source srcset=${fixedSrcset} type=${fixedType}>`;
              }
            );

            // 3. Исправляем проблему с mixed quotes в img тегах
            content = content.replace(
              /<img([^>]*?)src=("|')([^"']+)("|')([^>]*?)>/gi,
              (match, before, quote1, src, quote2, after) => {
                // Унифицируем кавычки - всегда используем двойные
                // Также проверяем другие атрибуты на смешанные кавычки
                let fixedAfter = after.replace(/(\w+)=("|')([^"']+)("|')/g, '$1="$3"');
                return `<img${before}src="${src}"${fixedAfter}>`;
              }
            );

            // 4. Дополнительное исправление для атрибутов alt, loading и class
            content = content.replace(
              /<img([^>]*?)alt=("|')([^"']*)("|')([^>]*?)>/gi,
              (match, before, quote1, alt, quote2, after) => {
                return `<img${before}alt="${alt}"${after}>`;
              }
            );

            content = content.replace(
              /<img([^>]*?)loading=("|')([^"']*)("|')([^>]*?)>/gi,
              (match, before, quote1, loading, quote2, after) => {
                return `<img${before}loading="${loading}"${after}>`;
              }
            );

            content = content.replace(
              /<img([^>]*?)class=("|')([^"']*)("|')([^>]*?)>/gi,
              (match, before, quote1, className, quote2, after) => {
                return `<img${before}class="${className}"${after}>`;
              }
            );

            // 5. Исправляем конкретную проблему из примера
            content = content.replace(
              /<picture><source srcset=("|')([^"']+)("|') type=("|')image\/webp("|')><img([^>]*?)src=("|')([^"']+)("|')([^>]*?)><\/picture>/gi,
              (match, quote1, webpSrc, quote2, quote3, quote4, imgAttrs, quote5, imgSrc, quote6, imgAfter) => {
                // Унифицируем все кавычки в picture блоке
                return `<picture><source srcset="${webpSrc}" type="image/webp"><img${imgAttrs}src="${imgSrc}"${imgAfter}></picture>`;
              }
            );

            // 6. Общее исправление для всех тегов с атрибутами
            content = content.replace(
              /<(\w+)([^>]*?)>/gi,
              (match, tagName, attributes) => {
                if (tagName.toLowerCase() === 'script' || tagName.toLowerCase() === 'style') {
                  return match; // Не трогаем script и style теги
                }
                
                // Исправляем все атрибуты в теге
                const fixedAttributes = attributes.replace(
                  /(\w+)=("|')([^"']*)("|')/g,
                  '$1="$3"'
                );
                
                return `<${tagName}${fixedAttributes}>`;
              }
            );

            // Записываем исправленное содержимое
            fs.writeFileSync(destPath, content, 'utf8');
            console.log(`✅ Fixed HTML quotes in: ${htmlFile}`);
          }
        }
        console.log(`✅ Copied and fixed ${htmlFiles.length} HTML files to docs root`);
      }

      console.log('✅ dist successfully copied to docs with HTML fixes');
      
      // Детальная проверка содержимого
      console.log('📁 Final docs structure:');
      if (fs.existsSync(docsDir)) {
        const items = fs.readdirSync(docsDir);
        console.log('📋 Docs contents:', items);
        
        const imagesDir = path.join(docsDir, 'images');
        if (fs.existsSync(imagesDir)) {
          const images = fs.readdirSync(imagesDir);
          console.log('🖼️ Images in docs:', images.length, 'files');
        }
      }
    }
  };
};

// Плагин для автоматического подключения шрифтов
const fontAutoPlugin = () => {
  let lastFontHash = null;

  const getFontDirHash = (fontsDir) => {
    try {
      const files = fs.readdirSync(fontsDir)
        .filter(file => /\.(woff2|woff|ttf|otf)$/i.test(file))
        .sort()
        .map(file => `${file}-${fs.statSync(path.join(fontsDir, file)).mtimeMs}`)
        .join('|');
      return files ? require('crypto').createHash('md5').update(files).digest('hex') : null;
    } catch {
      return null;
    }
  };

  return {
    name: 'font-auto-plugin',

    async buildStart() {
      const fontsDir = path.resolve(__dirname, 'src/files/fonts');
      const cssOutputDir = path.resolve(__dirname, 'src/scss/main');
      const cssFilePath = path.join(cssOutputDir, 'fonts.scss');

      if (!fs.existsSync(fontsDir)) {
        console.log('Fonts directory not found, skipping font generation');
        return;
      }

      if (!fs.existsSync(cssOutputDir)) {
        fs.mkdirSync(cssOutputDir, { recursive: true });
      }

      const currentHash = getFontDirHash(fontsDir);

      if (lastFontHash === currentHash && fs.existsSync(cssFilePath)) {
        console.log('✅ fonts.scss is up to date, skipping regeneration');
        return;
      }

      console.log('🔄 Fonts changed or first run — regenerating fonts.scss');

      try {
        const fontFiles = fs.readdirSync(fontsDir);
        const fontFaceRules = [];
        const fontFamilies = {};

        for (const file of fontFiles) {
          if (/\.(woff2|woff|ttf|otf)$/i.test(file)) {
            const fileName = path.parse(file).name;
            const ext = path.parse(file).ext.slice(1);

            const match = fileName.match(/(.*?)([-_](bold|italic|light|medium|regular|black|extrabold|semibold|thin|extralight))?$/i);
            const familyName = match ? match[1].replace(/[-_]/g, ' ') : fileName;
            const style = match && match[3] ? match[3] : 'regular';

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

        if (fontFaceRules.length > 0) {
          const cssContent = `/* Auto-generated font styles */\n${fontFaceRules.join('\n\n')}`;
          fs.writeFileSync(cssFilePath, cssContent);
          console.log(`✅ Generated fonts.scss with ${fontFaceRules.length} @font-face rules`);
          lastFontHash = currentHash;
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

// ИСПРАВЛЕННЫЙ плагин для работы с изображениями
const imagesPlugin = () => {
  let isBuild = false;

  return {
    name: 'images-plugin',

    config(config, { command }) {
      isBuild = command === 'build';
    },

    // Используем generateBundle вместо buildStart
    async generateBundle() {
      if (!isBuild) return;

      console.log('🖼️ Processing images...');
      
      const imagesSrcDir = path.resolve(__dirname, 'src/images');
      const imagesDistDir = path.resolve(__dirname, 'dist/images');
      const webpDistDir = path.join(imagesDistDir, 'webp');

      if (!fs.existsSync(imagesSrcDir)) {
        console.log('📁 Images directory not found, skipping image processing');
        return;
      }

      // Создаем папки назначения
      if (!fs.existsSync(imagesDistDir)) {
        fs.mkdirSync(imagesDistDir, { recursive: true });
      }
      if (!fs.existsSync(webpDistDir)) {
        fs.mkdirSync(webpDistDir, { recursive: true });
      }

      try {
        const files = fs.readdirSync(imagesSrcDir);
        let copiedCount = 0;
        let webpCount = 0;

        for (const file of files) {
          const srcPath = path.join(imagesSrcDir, file);
          const distPath = path.join(imagesDistDir, file);

          // Копируем оригинальные изображения
          if (/\.(jpg|jpeg|png|gif|svg|ico)$/i.test(file)) {
            fs.copyFileSync(srcPath, distPath);
            copiedCount++;
            console.log(`📄 Copied: ${file}`);
          }

          // Генерируем WebP для подходящих форматов
          if (/\.(jpg|jpeg|png)$/i.test(file)) {
            const webpPath = path.join(webpDistDir, `${path.parse(file).name}.webp`);
            try {
              await sharp(srcPath)
                .webp({ quality: 80, effort: 4 })
                .toFile(webpPath);
              webpCount++;
              console.log(`🎨 Created WebP: ${path.parse(file).name}.webp`);
            } catch (error) {
              console.warn(`⚠️ Could not convert ${file} to WebP:`, error.message);
            }
          }
        }

        console.log(`✅ Copied ${copiedCount} original images`);
        console.log(`✅ Generated ${webpCount} WebP images`);
        
        // Проверяем результат
        if (fs.existsSync(imagesDistDir)) {
          const distImages = fs.readdirSync(imagesDistDir);
          console.log('📋 Images in dist:', distImages);
        }
        if (fs.existsSync(webpDistDir)) {
          const webpImages = fs.readdirSync(webpDistDir);
          console.log('🎨 WebP images generated:', webpImages.length);
        }
        
      } catch (error) {
        console.error('❌ Error processing images:', error);
      }
    }
  };
};

// Более надежный плагин для обработки изображений
const pictureWebpPlugin = () => {
  let isBuild = false;

  return {
    name: 'picture-webp-plugin',

    config(config, { command }) {
      isBuild = command === 'build';
    },
    
    transformIndexHtml(html) {
      if (!isBuild) {
        return html;
      }

      console.log('🖼️ Wrapping images in <picture> tags for production...');
      
      // Универсальное регулярное выражение для поиска img тегов
      const imgRegex = /<img\b([^>]*?\bsrc\s*=\s*(["'])([^"']+?\.(png|jpe?g|jpg))\2[^>]*?)>/gi;
      
      let result = html;
      let match;
      
      // Обрабатываем каждое совпадение отдельно для лучшего контроля
      while ((match = imgRegex.exec(html)) !== null) {
        const fullMatch = match[0];
        const attributes = match[1];
        const quote = match[2];
        const src = match[3];
        
        // Пропускаем изображения, которые уже в picture или имеют data-skip-webp
        if (fullMatch.includes('data-skip-webp') || 
            fullMatch.includes('<picture') || 
            html.substring(match.index - 50, match.index).includes('<picture')) {
          continue;
        }
        
        let webpSrc;
        
        if (src.startsWith('/images/')) {
          webpSrc = src.replace('/images/', '/images/webp/').replace(/\.(png|jpe?g|jpg)$/i, '.webp');
        } else if (src.startsWith('images/')) {
          webpSrc = src.replace('images/', 'images/webp/').replace(/\.(png|jpe?g|jpg)$/i, '.webp');
        } else if (src.startsWith('./images/')) {
          webpSrc = src.replace('./images/', './images/webp/').replace(/\.(png|jpe?g|jpg)$/i, '.webp');
        } else {
          const lastSlashIndex = src.lastIndexOf('/');
          if (lastSlashIndex !== -1) {
            const path = src.substring(0, lastSlashIndex);
            const fileName = src.substring(lastSlashIndex + 1);
            const webpFileName = fileName.replace(/\.(png|jpe?g|jpg)$/i, '.webp');
            webpSrc = `${path}/webp/${webpFileName}`;
          } else {
            webpSrc = src.replace(/\.(png|jpe?g|jpg)$/i, '.webp');
          }
        }
        
        // Используем тот же тип кавычек, что и в оригинальном теге
        const replacement = `<picture><source srcset=${quote}${webpSrc}${quote} type="image/webp">${fullMatch}</picture>`;
        result = result.replace(fullMatch, replacement);
      }
      
      return result;
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
  handlebars({
    partialDirectory: path.resolve(__dirname, 'src/html/partials'),
    context: {
      title: {
        index: 'Главная',
      },
    },
  }),
  aliasHtmlPlugin(),
  imagesPlugin(),
  pictureWebpPlugin(), // После imagesPlugin, но до tailwindcss
  tailwindcss(),
  copyDistToDocs(),
],

  build: {
    minify: true,
    sourcemap: 'inline',
    outDir: path.resolve(__dirname, 'dist'),
    
    assetsInlineLimit: 0,
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && /\.(woff|woff2|eot|ttf|otf)$/i.test(assetInfo.name)) {
            return `files/fonts/[name][extname]`;
          }
          if (assetInfo.name && /\.(jpg|jpeg|png|gif|svg|ico)$/i.test(assetInfo.name)) {
            return `images/[name][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
      },
      
      input: {
        index: path.resolve(__dirname, 'src/html/index.html'),
        ui_kit: path.resolve(__dirname, 'src/html/ui-kit.html'),
        error: path.resolve(__dirname, 'src/html/404.html'),
        catalog_page_1: path.resolve(__dirname, 'src/html/OKATEC-Inverters.html'),
        catalog_page_2: path.resolve(__dirname, 'src/html/catalog-subcategory.html'),
      },
    },
    emptyOutDir: true,
  },

  server: {
    open: '/html/index.html',
    watch: {
      ignored: [
        '**/node_modules/**',
        '**/.git/**',
        '**/dist/**',
        '**/docs/**',
        '**/src/files/**',
        '**/src/images/webp/**',
      ],
    },
  },
});