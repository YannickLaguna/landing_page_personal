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

async function translateText(text) {
  // Traduce texto usando DeepL API
  try {
    const res = await axios.post(
      API_URL,
      new URLSearchParams({
        auth_key: API_KEY,
        text,
        target_lang: 'ES'
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );
    return res.data.translations[0].text;
  } catch (err) {
    console.error('Error traduciendo:', err.response?.data || err.message);
    return text;
  }
}

function getAllMdFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllMdFiles(filePath));
    } else if (file.endsWith('.md') && !file.endsWith('.es.md')) {
      results.push(filePath);
    }
  });
  return results;
}

async function translateFieldsRecursively(obj) {
  if (Array.isArray(obj)) {
    return Promise.all(obj.map(translateFieldsRecursively));
  } else if (obj && typeof obj === 'object') {
    const entries = await Promise.all(
      Object.entries(obj).map(async ([key, value]) => {
        if (FIELDS_TO_TRANSLATE.includes(key) && typeof value === 'string' && value.trim()) {
          return [key, await translateText(value)];
        } else if (typeof value === 'object' && value !== null) {
          return [key, await translateFieldsRecursively(value)];
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

async function processFile(filePath) {
  const dir = path.dirname(filePath);
  const file = path.basename(filePath);
  const base = file.replace('.md', '');
  const esFile = `${base}.es.md`;
  const esPath = path.join(dir, esFile);
  if (fs.existsSync(esPath)) return;
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
  const translatedYamlObj = await translateFieldsRecursively(yamlObj);
  const translatedYamlStr = yaml.dump(translatedYamlObj, { lineWidth: 120 });
  const translatedBody = await translateText(body.trim());
  const newContent = `---\n${translatedYamlStr.trim()}\n---\n${translatedBody ? translatedBody.trim() + '\n' : ''}`;
  fs.writeFileSync(esPath, newContent, 'utf8');
  console.log(`Generado: ${esPath}`);
}

async function main() {
  const files = getAllMdFiles(rootDir);
  for (const filePath of files) {
    await processFile(filePath);
  }
  console.log('Traducción finalizada.');
}

main(); 