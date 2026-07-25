const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'components/tables');
const files = fs.readdirSync(dir).filter(f => f.endsWith('-client.tsx'));

let count = 0;
for (const file of files) {
  const fp = path.join(dir, file);
  let content = fs.readFileSync(fp, 'utf8');
  const original = content;
  
  // 1. Remove import line
  content = content.replace(/import ValidationControls from ["']@\/components\/tables\/validation-controls["'];\n/g, '');
  
  // 2. Remove active <ValidationControls ... /> (not commented)
  content = content.replace(/\s*<ValidationControls\n\s+tabelKode=\{tabelKode\}\n\s+tahunAkademikId=\{tahunAkademikId\}\n\s+currentStatus=\{currentStatus\}\n\s+userRole=\{userRole\}\n\s+onChangeStatus=\{setCurrentStatus\}\n\s+triggerToast=\{triggerToast\}\n\s*\/>/g, '');

  // 3. Remove commented-out blocks  
  content = content.replace(/\s*\{\/\*\s*Validation Controls[^]*?\*\/\}\n/g, '');
  content = content.replace(/\s*\{\/\*\s*\n\s*<ValidationControls[^]*?\*\/\}\n/g, '');
  
  if (content !== original) {
    fs.writeFileSync(fp, content);
    count++;
    console.log('Cleaned:', file);
  }
}
console.log('\nTotal files cleaned:', count);
