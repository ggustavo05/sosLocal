/**
 * Gera src/constants/buildInfo.ts com hash do commit Git atual.
 * Executado em prestart/preweb antes do Expo.
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const OUT_DIR = path.join(__dirname, '..', 'src', 'constants');
const OUT_FILE = path.join(OUT_DIR, 'buildInfo.ts');

function git(command) {
  try {
    return execSync(command, { encoding: 'utf8', cwd: path.join(__dirname, '..') }).trim();
  } catch {
    return null;
  }
}

const fullHash = git('git rev-parse HEAD');
const shortHash = git('git rev-parse --short HEAD');
const generatedAt = new Date().toISOString();

const GIT_COMMIT_HASH = fullHash ?? 'indisponível';
const GIT_COMMIT_SHORT = shortHash ?? 'indisponível';

const content = `/**
 * Gerado automaticamente por scripts/generate-build-info.js — não editar à mão.
 * Commit de referência da versão em execução/build.
 */
export const GIT_COMMIT_HASH = '${GIT_COMMIT_HASH}';
export const GIT_COMMIT_SHORT = '${GIT_COMMIT_SHORT}';
export const BUILD_GENERATED_AT = '${generatedAt}';
`;

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

fs.writeFileSync(OUT_FILE, content, 'utf8');
console.log(`[build-info] ${OUT_FILE} ← commit ${GIT_COMMIT_SHORT}`);
