const { spawn } = require('node:child_process');

const assignments = [];
let index = 2;
while (index < process.argv.length && process.argv[index].includes('=')) {
  assignments.push(process.argv[index++]);
}
const [command, ...args] = process.argv.slice(index);
if (!command) {
  console.error('Usage: node scripts/run-with-env.cjs KEY=value command [args...]');
  process.exit(1);
}

const env = { ...process.env };
for (const assignment of assignments) {
  const separator = assignment.indexOf('=');
  env[assignment.slice(0, separator)] = assignment.slice(separator + 1);
}

const executable = process.platform === 'win32' ? `${command}.cmd` : command;
const child = spawn(executable, args, { env, stdio: 'inherit', shell: false });
child.on('close', code => process.exit(code ?? 1));
