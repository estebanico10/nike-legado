import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

const URL_TO_TEST = process.argv[2] || 'http://localhost:5173/inicio';

async function analyzeTheme(page, theme) {
  console.log(chalk.cyan(`\n🔍 Analizando contraste en modo: ${theme.toUpperCase()}`));
  
  // Forzar el tema usando localStorage (según Zustand persist) o media query
  await page.evaluate((themeColor) => {
    // Si la app usa un modo oscuro basado en clases:
    if (themeColor === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, theme);

  // Esperar un momento a que las animaciones/transiciones de tema se asienten
  await new Promise(resolve => setTimeout(resolve, 500));

  // Inyectar axe-core manualmente para evitar errores de ESM
  const axeSource = fs.readFileSync(path.resolve('./node_modules/axe-core/axe.min.js'), 'utf8');
  await page.evaluate(axeSource);

  // Ejecutar Axe específicamente para reglas de contraste
  const results = await page.evaluate(async () => {
    return await window.axe.run({
      runOnly: {
        type: 'rule',
        values: ['color-contrast']
      }
    });
  });

  const violations = results.violations;

  if (violations.length === 0) {
    console.log(chalk.green(`✅ ¡Excelente! No se encontraron problemas de contraste en modo ${theme}.`));
  } else {
    console.log(chalk.red(`❌ Se encontraron problemas de contraste en modo ${theme}:\n`));
    
    violations.forEach(violation => {
      console.log(chalk.yellow(`Regla: ${violation.id}`));
      console.log(chalk.white(`Descripción: ${violation.description}`));
      console.log(chalk.white(`Ayuda: ${violation.helpUrl}`));
      
      violation.nodes.forEach(node => {
        console.log(chalk.gray(`\n  Elemento afectado:`));
        console.log(chalk.white(`  ${node.html}`));
        console.log(chalk.red(`  Fallo: ${node.failureSummary}`));
      });
      console.log('\n----------------------------------------\n');
    });
  }
}

async function runAnalysis() {
  console.log(chalk.blue(`Iniciando análisis de contraste en: ${URL_TO_TEST}`));
  console.log(chalk.gray(`Asegúrate de tener el servidor de desarrollo corriendo (npm run dev)\n`));

  let browser;
  try {
    browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    
    // Configurar viewport responsivo desktop
    await page.setViewport({ width: 1440, height: 900 });

    console.log(chalk.gray(`Cargando página...`));
    await page.goto(URL_TO_TEST, { waitUntil: 'networkidle2' });

    // Análisis en Modo Claro
    await analyzeTheme(page, 'light');

    // Análisis en Modo Oscuro
    await analyzeTheme(page, 'dark');

  } catch (error) {
    console.error(chalk.red('\nError durante la ejecución del script:'));
    console.error(error.message);
  } finally {
    if (browser) {
      await browser.close();
      console.log(chalk.blue('\nAnálisis finalizado.'));
    }
  }
}

runAnalysis();
