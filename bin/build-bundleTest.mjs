#!/usr/bin/env node

import fs from 'node:fs/promises'
import path from 'node:path'
import chalk from 'chalk'

import esbuild from 'esbuild'
import babel from 'esbuild-plugin-babel'

const JSIMg_ROOT = new URL('../', import.meta.url)
const PACKAGES_ROOT = new URL('./packages/', JSIMg_ROOT)

function buildBundle (srcFile, bundleFile, { minify = true, standalone = '', plugins, target, format } = {}) {
  return esbuild.build({
    bundle: true,
    sourcemap: true,
    entryPoints: [srcFile],
    outfile: bundleFile,
    platform: 'browser',
    minify,
    keepNames: true,
    plugins,
    target,
    format,
  }).then(() => {
    if (minify) {
      console.info(chalk.green(`✓ Built Minified Bundle [${standalone}]:`), chalk.magenta(bundleFile))
    } else {
      console.info(chalk.green(`✓ Built Bundle [${standalone}]:`), chalk.magenta(bundleFile))
    }
  })
}

await fs.mkdir(new URL('./JSIMg/dist', PACKAGES_ROOT), { recursive: true })
await fs.mkdir(new URL('./@JSIMg/locales/dist', PACKAGES_ROOT), { recursive: true })

const methods = [
  buildBundle(
    './packages/JSIMg/index.mjs',
    './packages/JSIMg/dist/JSIMg.min.mjs',
    { standalone: 'JSIMg (ESM)', format: 'esm' },
  ),
  buildBundle(
    './packages/JSIMg/bundle-legacy.mjs',
    './packages/JSIMg/dist/JSIMg.legacy.min.js',
    {
      standalone: 'JSIMg (with polyfills)',
      target: 'es5',
      plugins:[babel({
        config:{
          compact: false,
          highlightCode: false,
          inputSourceMap: true,

          browserslistEnv: 'legacy',
          presets: [['@babel/preset-env',  {
            loose: false,
            targets: { ie:11 },
            useBuiltIns: 'entry',
            corejs: { version: '3.24', proposals: true },
          }]],
        },
      })],
    },
  ),
  buildBundle(
    './packages/JSIMg/bundle.mjs',
    './packages/JSIMg/dist/JSIMg.min.js',
    { standalone: 'JSIMg', format: 'iife' },
  ),

]

// Build mini versions of  locales
const localesModules = await fs.opendir(new URL('./@JSIMg/locales/src/', PACKAGES_ROOT))
for await (const dirent of localesModules) {
  if (!dirent.isDirectory() && dirent.name.endsWith('.js')) {
    const localeName = path.basename(dirent.name, '.js')
    methods.push(
      buildBundle(
        `./packages/@JSIMg/locales/src/${localeName}.js`,
        `./packages/@JSIMg/locales/dist/${localeName}.min.js`,
        { minify: true },
      ),
    )
  }
}
