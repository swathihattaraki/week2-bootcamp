import fs from 'node:fs/promises';

const file = process.argv[2];
if (!file) {
  console.error('Usage: npm run cli -- <file.json>');
  process.exit(1);
}

try {
  const data = JSON.parse(await fs.readFile(file, 'utf-8'));
  if (!Array.isArray(data) || !data.every(x => typeof x?.name === 'string' && typeof x?.role === 'string')) {
    throw new Error('INVALID_SHAPE');
  }
  const roles = [...new Set(data.map(x => x.role))].join(', ');
  console.log(`Valid JSON | Records: ${data.length} | Roles: ${roles}`);
} catch (err) {
  const messages = {
    ENOENT: `File not found: ${file}`,
    SyntaxError: 'Malformed JSON format',
    INVALID_SHAPE: 'JSON must be an array of { name, role } strings'
  };
  console.error('Error:', messages[err.code] || messages[err.name] || messages[err.message] || 'Unexpected error');
  process.exit(1);
}