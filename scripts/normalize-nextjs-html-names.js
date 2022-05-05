const { promises } = require('fs');

iterateOver('out');

async function iterateOver(dirName) {
  let errorCode = 0;
  const files = await promises.readdir(dirName, {withFileTypes: true});

  for (const file of files) {
    if (file.isDirectory()) {
      await iterateOver(`${dirName}/${file.name}`);
    } else if (file.name.endsWith('html.html')) {
      try {
        const name = file.name.replace('html.html', 'html');
        await promises.rename(`${dirName}/${file.name}`, `${dirName}/${name}`);
        console.info(`${file.name} renamed to ${name}`);
      } catch (e) {
        console.error(`\nMESSAGE: \n${e.stdout || e.message}\n`);
        console.error(`STACK: \n${e.stack}\n`);
        errorCode = typeof e.code === 'number' ? e.code : -1;
      } finally {
        if(errorCode){
          process.exit(errorCode);
        }
      }
    }
  }
}
