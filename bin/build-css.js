const sass = require('sass');
const postcss = require('postcss');
const autoprefixer = require('autoprefixer');
const postcssLogical = require('postcss-logical');
const postcssDirPseudoClass = require('postcss-dir-pseudo-class');
const cssnano = require('cssnano');
const { promisify } = require('node:util');
const fs = require('node:fs');
const path = require('node:path');
const resolve = require('resolve');
const glob = promisify(require('glob'));

const renderScss = promisify(sass.render);
const { mkdir, writeFile } = fs.promises;

const cwd = process.cwd();
let chalk;

function getPostCSSPlugins() {
  return [
    autoprefixer,
    postcssLogical(),
    postcssDirPseudoClass(),
  ];
}

async function compileSCSS(file) {
  const importedFiles = new Set();
  const scssResult = await renderScss({
    file,
    importer: createImporter(importedFiles),
  });
  return scssResult.css;
}

function createImporter(importedFiles) {
  return (url, from, done) => {
    resolve(url, {
      basedir: path.dirname(from),
      filename: from,
      extensions: ['.scss'],
    }, (err, resolved) => {
      if (err) {
        done(err);
        return;
      }

      const realpath = fs.realpathSync(resolved);
      if (importedFiles.has(realpath)) {
        done({ contents: '' });
        return;
      }
      importedFiles.add(realpath);
      done({ file: realpath });
    });
  };
}

async function processCSS(css, file, plugins) {
  const result = await postcss(plugins).process(css, { from: file });
  result.warnings().forEach(warn => console.warn(warn.toString()));
  return result;
}

async function handleCSSOutput(file, css) {
  const outputDir = path.join(path.dirname(file), '../dist');
  const outfile = isJSIMgPackage(file) ?
    `${outputDir}/JSIMg.css` :
    `${outputDir}/style.css`;

  await saveCSS(outfile, css);
  const minifiedCSS = await minifyCSS(outfile, css);
  await saveCSS(outfile.replace(/\.css$/, '.min.css'), minifiedCSS);
}

async function handleCSSOutput(file, css) {
  const outputDir = path.join(path.dirname(file), '../dist');
  const outfile = isFibcousPackage(file) ?
    `${outputDir}/fibcous.css` :
    `${outputDir}/style.css`;

  await saveAndLogCSS(outfile, css);
  const minifiedCSS = await minifyCSS(outfile, css);
  await saveAndLogCSS(outfile.replace(/\.css$/, '.min.css'), minifiedCSS);
}



async function saveCSS(outfile, css) {
  try {
    await mkdir(path.dirname(outfile), { recursive: true });
    await writeFile(outfile, css);
    console.info(chalk.green('✓ CSS Processed:'), chalk.magenta(path.relative(cwd, outfile)));
  } catch (err) {
    throw new Error(`Failed to write file ${outfile}: ${err.message}`);
  }
}

function isJSIMgPackage(file) {
  return path.normalize(file).includes('packages/JSIMg/');
}

async function minifyCSS(outfile, css) {
  const result = await postcss([cssnano({ safe: true })]).process(css, { from: outfile });
  result.warnings().forEach(warn => console.warn(warn.toString()));
  return result.css;
}

async function compileCSS() {
  ({ default: chalk } = await import('chalk'));
  const files = await glob('packages/{,@JSIMg/}*/src/style.scss');
  const plugins = getPostCSSPlugins();

  for (const file of files) {
    try {
      const css = await compileSCSS(file);
      const postcssResult = await processCSS(css, file, plugins);
      await handleCSSOutput(file, postcssResult.css);
    } catch (err) {
      console.error(chalk.red(`✗ Error processing ${file}:`), chalk.red(err.message));
    }
  }

  console.info(chalk.yellow('CSS Bundles OK'));
};

compileCSS().catch(err => {
  console.error(chalk.red('✗ Global Error:'), chalk.red(err.message));
});
