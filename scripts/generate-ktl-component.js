const fs = require('fs');
const spawn = require('child_process').spawn;

try {
  const componentName = process.argv[2];
  output = spawn('node', ['compile.js', componentName], {cwd: 'scripts/react-renderer'});

  output.stdout.on('data', (data) => {
    const renderedHtml = data.toString();

    if (!fs.existsSync('generated')) {
      fs.mkdirSync('generated');
    }

    fs.writeFileSync(`./generated/${componentName}.html`, renderedHtml, (e) => {
      if (e) throw e;
    });

  });
} catch (e) {
  console.error(e);
  process.exit(1);
}
