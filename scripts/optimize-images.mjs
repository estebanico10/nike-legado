import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Uncomment the next line if sharp is installed
// import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PUBLIC_DIR = path.join(__dirname, '../public/assets');

async function processDirectory(dir) {
  if (!fs.existsSync(dir)) {
    console.log(`Directorio no existe: ${dir}`);
    return;
  }

  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      await processDirectory(fullPath);
    } else if (file.match(/\.(png|jpe?g)$/i)) {
      console.log(`Encontrada imagen para optimizar: ${fullPath}`);
      // MOCK LOGIC: If sharp were installed, we would run:
      // const outputFilename = fullPath.replace(/\.(png|jpe?g)$/i, '.webp');
      // await sharp(fullPath)
      //   .resize(1200, null, { withoutEnlargement: true })
      //   .webp({ quality: 80 })
      //   .toFile(outputFilename);
      // console.log(`Optimizada y guardada como: ${outputFilename}`);
      console.log(`[MOCK] Sharp procesaría y convertiría ${file} a webp.`);
    }
  }
}

async function run() {
  console.log('Iniciando optimización de imágenes en public/assets...');
  await processDirectory(PUBLIC_DIR);
  console.log('Optimización finalizada.');
}

run().catch(console.error);
