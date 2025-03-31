import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// __dirname en ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Lista de carpetas o archivos a ignorar
const IGNORE_LIST = ['paginaweb', 'loading_screen', 'folders.json', 'data.json', 'data2.json'];

/**
 * Recorre recursivamente un directorio y devuelve la estructura (carpetas, archivos),
 * ignorando los nombres en IGNORE_LIST.
 */
function getDirectoryStructure(dir) {
  const result = {
    name: path.basename(dir),
    folders: [],
    files: [],
  };

  const items = fs.readdirSync(dir);
  items.forEach((item) => {
    if (IGNORE_LIST.includes(item)) return; // Ignorar carpeta o archivo

    const fullPath = path.join(dir, item);
    const stats = fs.statSync(fullPath);

    if (stats.isDirectory()) {
      result.folders.push(getDirectoryStructure(fullPath));
    } else {
      result.files.push(item);
    }
  });

  return result;
}

// Ruta a explorar
const ROOT_DIR = path.join(__dirname, '../../assets/'); 

// Obtenemos estructura
const directoryData = getDirectoryStructure(ROOT_DIR);

// Guarda el JSON en /assets/json/folders.json
fs.writeFileSync(
  path.join(ROOT_DIR, 'json', 'folders.json'),
  JSON.stringify(directoryData, null, 2),
  'utf-8'
);

console.log('¡JSON generado con éxito, ignorando:', IGNORE_LIST.join(', '), '!');
