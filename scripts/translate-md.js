// Script para traducir archivos .es.md (español) a inglés y generar versiones .md
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

// Recorre el objeto YAML y recolecta los textos traducibles junto con sus rutas de acceso
function recolectarTextos(obj) {
  const textos = [];
  const rutas = [];
  function recorrer(nodo, ruta) {
    if (Array.isArray(nodo)) {
      nodo.forEach((item, i) => recorrer(item, [...ruta, i]));
    } else if (nodo && typeof nodo === 'object') {
      for (const [clave, valor] of Object.entries(nodo)) {
        if (FIELDS_TO_TRANSLATE.includes(clave) && typeof valor === 'string' && valor.trim()) {
          textos.push(valor);
          rutas.push([...ruta, clave]);
        } else if (typeof valor === 'object' && valor !== null) {
          recorrer(valor, [...ruta, clave]);
        }
      }
    }
  }
  recorrer(obj, []);
  return { textos, rutas };
}

// Aplica un array de traducciones de vuelta al objeto usando las rutas guardadas
function aplicarTraducciones(obj, rutas, traducciones) {
  const resultado = JSON.parse(JSON.stringify(obj)); // clon profundo para no mutar el original
  rutas.forEach((ruta, i) => {
    let nodo = resultado;
    for (let j = 0; j < ruta.length - 1; j++) nodo = nodo[ruta[j]];
    nodo[ruta[ruta.length - 1]] = traducciones[i];
  });
  return resultado;
}

// Una sola llamada a DeepL con todos los textos del archivo — evita errores 429
async function traducirLote(textos, codigoLang) {
  if (!textos.length) return [];
  const deeplCode = SUPPORTED_LANGS.find(l => l.code === codigoLang)?.deepl || codigoLang;
  try {
    const res = await axios.post(
      API_URL,
      { text: textos, target_lang: deeplCode },
      { headers: {
          'Authorization': `DeepL-Auth-Key ${API_KEY}`,
          'Content-Type': 'application/json'
      }}
    );
    return res.data.translations.map(t => t.text);
  } catch (err) {
    console.error('Error en lote:', err.response?.data || err.message);
    return textos; // fallback: devuelve los textos originales sin traducir
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

async function processFileToTargetLang(filePath, sourceLang, targetLang) {
  const targetPath = getCounterpartPath(filePath, targetLang);
  const forzarSobreescritura = process.argv.includes('--force');
  if (fs.existsSync(targetPath) && !forzarSobreescritura) return; // Ya existe la contraparte (omitir a menos que --force)

  const content = fs.readFileSync(filePath, 'utf8');
  // Extrae YAML frontmatter y body
  const match = content.match(/^---([\s\S]*?)---([\s\S]*)/);
  if (!match) return;

  const [_, yamlStr, body] = match;
  let yamlObj;
  try {
    yamlObj = yaml.load(yamlStr);
  } catch (e) {
    console.error(`YAML inválido en ${filePath}`);
    return;
  }

  // Recolectar todos los textos traducibles del YAML en un array plano
  const { textos: textosYaml, rutas } = recolectarTextos(yamlObj);
  const bodyTrimmed = body.trim();
  // El body también se incluye al final del lote si existe
  const todosLosTextos = bodyTrimmed ? [...textosYaml, bodyTrimmed] : textosYaml;

  console.log(`  Traduciendo ${todosLosTextos.length} campo(s) en una sola llamada...`);

  // Una sola llamada a DeepL con todos los textos del archivo
  const traducciones = await traducirLote(todosLosTextos, targetLang.code);

  // Aplicar traducciones al objeto YAML
  const tradYaml = traducciones.slice(0, textosYaml.length);
  const yamlTraducido = aplicarTraducciones(yamlObj, rutas, tradYaml);
  const yamlStrTraducido = yaml.dump(yamlTraducido, { lineWidth: 120 });

  // Body traducido (último elemento del lote, si existía)
  const bodyTraducido = bodyTrimmed ? traducciones[textosYaml.length] : '';

  const nuevoContenido = `---\n${yamlStrTraducido.trim()}\n---\n${bodyTraducido ? bodyTraducido.trim() + '\n' : ''}`;
  fs.writeFileSync(targetPath, nuevoContenido, 'utf8');
  console.log(`Generado: ${targetPath}`);
}

async function main() {
  const files = getAllMdAndEsMdFiles(rootDir);
  // El español (.es.md) es la fuente de verdad; generamos únicamente la versión EN (.md)
  const idiomaFuente = SUPPORTED_LANGS.find(l => l.code === 'ES');
  const idiomaDestino = SUPPORTED_LANGS.find(l => l.code === 'EN');
  for (const filePath of files) {
    const sourceLang = getLangFromFilename(path.basename(filePath));
    if (!sourceLang || sourceLang.code !== idiomaFuente.code) continue; // Omitir archivos que no sean ES
    await processFileToTargetLang(filePath, idiomaFuente, idiomaDestino);
  }
  console.log('Traducción ES → EN finalizada.');
}

main(); 