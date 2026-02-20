// Script para traducir archivos .md a español y generar versiones .es.md
// Requiere: npm install axios dotenv js-yaml
// Configura tu API key en un archivo .env como TRANSLATE_API_KEY=tu_clave

const fs = require('fs');
const path = require('path');
const axios = require('axios');
const yaml = require('js-yaml');
require('dotenv').config();

const API_KEY = process.env.TRANSLATE_API_KEY; // DeepL o Google Translate
const API_URL = 'https://api-free.deepl.com/v2/translate'; // Cambia si usas otro proveedor
const rootDir = path.join(__dirname, '../content/pages');

const FIELDS_TO_TRANSLATE = [
  'title', 'subtitle', 'description', 'label', 'caption', 'text', 'excerpt'
];

// Configuración de idiomas soportados
const SUPPORTED_LANGS = [
  { code: 'EN', suffix: '', deepl: 'EN' },
  { code: 'ES', suffix: '.es', deepl: 'ES' },
  // Para agregar más idiomas, añade aquí: { code: 'FR', suffix: '.fr', deepl: 'FR' }, etc.
];

function getLangFromFilename(filename) {
  for (const lang of SUPPORTED_LANGS) {
    if (lang.suffix && filename.endsWith(`${lang.suffix}.md`)) return lang;
  }
  // Si no tiene sufijo, se asume el idioma base (inglés)
  if (filename.endsWith('.md')) return SUPPORTED_LANGS[0];
  return null;
}

function getCounterpartPath(filePath, targetLang) {
  const dir = path.dirname(filePath);
  const base = path.basename(filePath, '.md');
  // Elimina cualquier sufijo de idioma existente
  let baseName = base;
  for (const lang of SUPPORTED_LANGS) {
    if (lang.suffix && base.endsWith(lang.suffix)) {
      baseName = base.slice(0, -lang.suffix.length);
      break;
    }
  }
  const newFile = `${baseName}${targetLang.suffix}.md`;
  return path.join(dir, newFile);
}

async function translateText(text, targetLangCode) {
  // Traduce texto usando DeepL API
  try {
    const deeplCode = SUPPORTED_LANGS.find(l => l.code === targetLangCode)?.deepl || targetLangCode;
    const res = await axios.post(
      API_URL,
      new URLSearchParams({
        auth_key: API_KEY,
        text,
        target_lang: deeplCode
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );
    return res.data.translations[0].text;
  } catch (err) {
    console.error('Error traduciendo:', err.response?.data || err.message);
    return text;
  }
}

function getAllMdAndEsMdFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllMdAndEsMdFiles(filePath));
    } else if (file.endsWith('.md')) {
      results.push(filePath);
    }
  });
  return results;
}

async function translateFieldsRecursively(obj, targetLangCode) {
  if (Array.isArray(obj)) {
    return Promise.all(obj.map((item) => translateFieldsRecursively(item, targetLangCode)));
  } else if (obj && typeof obj === 'object') {
    const entries = await Promise.all(
      Object.entries(obj).map(async ([key, value]) => {
        if (FIELDS_TO_TRANSLATE.includes(key) && typeof value === 'string' && value.trim()) {
          return [key, await translateText(value, targetLangCode)];
        } else if (typeof value === 'object' && value !== null) {
          return [key, await translateFieldsRecursively(value, targetLangCode)];
        } else {
          return [key, value];
        }
      })
    );
    return Object.fromEntries(entries);
  } else {
    return obj;
  }
}

async function processFileToTargetLang(filePath, sourceLang, targetLang) {
  const targetPath = getCounterpartPath(filePath, targetLang);
  const forzarSobreescritura = process.argv.includes('--force');
  if (fs.existsSync(targetPath) && !forzarSobreescritura) return; // Ya existe la contraparte (omitir a menos que --force)
  let content = fs.readFileSync(filePath, 'utf8');
  // Extrae YAML y body
  const match = content.match(/^---([\s\S]*?)---([\s\S]*)/);
  if (!match) return;
  let [_, yamlStr, body] = match;
  let yamlObj;
  try {
    yamlObj = yaml.load(yamlStr);
  } catch (e) {
    console.error(`YAML inválido en ${filePath}`);
    return;
  }
  const translatedYamlObj = await translateFieldsRecursively(yamlObj, targetLang.code);
  const translatedYamlStr = yaml.dump(translatedYamlObj, { lineWidth: 120 });
  const translatedBody = await translateText(body.trim(), targetLang.code);
  const newContent = `---\n${translatedYamlStr.trim()}\n---\n${translatedBody ? translatedBody.trim() + '\n' : ''}`;
  fs.writeFileSync(targetPath, newContent, 'utf8');
  console.log(`Generado: ${targetPath}`);
}

async function main() {
  const files = getAllMdAndEsMdFiles(rootDir);
  for (const filePath of files) {
    if (!filePath.endsWith('.md')) continue;
    const sourceLang = getLangFromFilename(path.basename(filePath));
    if (!sourceLang) continue;
    for (const targetLang of SUPPORTED_LANGS) {
      if (targetLang.code === sourceLang.code) continue; // No traducir al mismo idioma
      await processFileToTargetLang(filePath, sourceLang, targetLang);
    }
  }
  console.log('Traducción multilingüe finalizada.');
}

main(); 