import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function findProjectRoot(startPath) {
  let currentPath = startPath;
  
  while (currentPath !== '/') {
    const pkgPath = join(currentPath, 'package.json');
    
    if (fs.existsSync(pkgPath)) {
      const pkgContent = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
      
      if (pkgContent.name !== '@arog/cli') {
        console.log('✅ Found project root:', currentPath);
        return currentPath;
      } else {
        console.log('⏭️  Skipping .arog package:', currentPath);
      }
    }
    
    currentPath = dirname(currentPath);
  }
  
  return process.cwd();
}

console.log('Starting from:', __dirname);
const projectRoot = findProjectRoot(__dirname);
console.log('\n📍 Project Root:', projectRoot);
console.log('📦 package.json exists:', fs.existsSync(join(projectRoot, 'package.json')));

const pkg = JSON.parse(fs.readFileSync(join(projectRoot, 'package.json'), 'utf8'));
console.log('📝 Project Name:', pkg.name);
console.log('🧪 Has test script:', !!pkg.scripts?.test);
console.log('✨ Has test:all script:', !!pkg.scripts?.['test:all']);
console.log('🌐 Has test:e2e script:', !!pkg.scripts?.['test:e2e']);
console.log('🔒 Has security:audit script:', !!pkg.scripts?.['security:audit']);
