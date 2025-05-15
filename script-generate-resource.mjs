import { execSync } from 'child_process';

// create new module resource
// example command: yarn resource:generate user
// the user module will be placed in src/modules/user
const name = process.argv[2];
if (!name) {
  console.error('❌ Please provide a resource name');
  process.exit(1);
}

const basePath = `modules/${name}`;
const command = `nest g resource ${basePath}`;

console.log(`🚀 Generating resource at: src/${basePath}`);
try {
  execSync(command, { stdio: 'inherit', shell: true });
  console.log('✅ Resource generated at:', `src/${basePath}`);
} catch (err) {
  console.error('❌ Failed to generate resource:', err.message);
}
