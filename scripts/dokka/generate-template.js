const fs = require('fs');
const {exec} = require('child_process');

const componentName = process.argv[2];

const componentCssFile = {
  footer: 'node_modules/@jetbrains/kotlin-web-site-ui/out/components/footer/index.css',
  header: 'node_modules/@jetbrains/kotlin-web-site-ui/out/components/header/index.css',
}

console.info(`Start generating ${componentName}`);

exec(`node scripts/react-renderer/compile.js ${componentName}`, (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    process.exit(1);
  }

  const cssPath = componentCssFile[componentName];

  if (!cssPath) {
    console.error(`CSS file for ${componentName} is not defined. Please provide it.`);
    process.exit(1);
  }

  const cssContent = fs.readFileSync(cssPath);
  const templateContent = `
    <style>${cssContent}</style>
    ${stdout}
  `;

  const componentContent = fs.readFileSync(`./dokka-templates/includes/${componentName}.ftl`);

  const replaced = componentContent.toString().replace(/<!--\s?KTL\sstart\s?-->[.\s\S]*<!--\s?KTL\send\s?-->/gi, templateContent);

  fs.writeFileSync(`./dokka-templates/includes/${componentName}.ftl`, replaced);

  console.info(`Generating ${componentName} is completed`);
});
