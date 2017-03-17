const fs = require('fs');
const path = require('path');
const parseCLIArgs = require('minimist');
const glob = require('glob');

const args = parseCLIArgs(process.argv.slice(2));
const defaultRootDir = path.resolve(__dirname, '..');

if (!args.pattern) {
  throw new Error('--pattern=glob-pattern parameter is required');
}

const list = glob.sync(args.pattern, {
  nodir: true,
  root: args.root || defaultRootDir,
  cwd: args.root || defaultRootDir
});

const result = list
  .map(item => item.substr(0, 1) !== '/' ? `/${item}` : item)
  .join('\n');

if (args.output) {
  const outPath = path.resolve(process.cwd(), args.output);
  fs.writeFileSync(outPath, result, 'utf-8');
  console.log(`${outPath} is successfully written`);
} else {
  console.log(result);
}