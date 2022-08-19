const fs = require('fs');
const path = require('path');
const {execSync} = require('child_process');

console.info(`Start generating Dokka's templates`);

walkTroughTemplates('dokka-templates');

/**
 * Use the next example to define ktl component in ftl templates: {% ktl_component "COMPONENT_NAME" %}
 */
function walkTroughTemplates(filePath) {
  fs.readdirSync(filePath, {withFileTypes: true}).forEach(item => {
    const currentPath = path.join(filePath, item.name);

    if (item.isDirectory()) {
      walkTroughTemplates(currentPath);
    } else if (item.isFile() && item.name.endsWith('.ftl')) {
      const fileContent = fs.readFileSync(currentPath).toString();
      let updatedContent = fileContent;
      const pattern = /\{%\s?ktl_component\s?["'](\w+)['"]\s?%}/g;
      const results = [...updatedContent.matchAll(pattern)];

      results.forEach(result => {
        const componentName = result[1];
        console.info(`Generating ${componentName}...`);
        const componentTemplate = compileComponent(componentName);
        console.log(componentTemplate);
        const componentPattern = new RegExp(`{%\\s?ktl_component\\s?["']${componentName}['"]\\s?%}`, 'g');

        updatedContent = updatedContent.replace(componentPattern, componentTemplate);

        console.info(`Generating ${componentName} is completed`);
      });

      if (fileContent !== updatedContent) {
        console.info(`Updating ${currentPath} file`);
        fs.writeFileSync(currentPath, updatedContent);
        console.info(`${currentPath} file is updated`);
      }
    }
  });
}

function compileComponent(name) {
  const stdout = execSync(`node scripts/react-renderer/compile.js ${name} {} dokka`);

  return `
    <!-- ktl_component: {"name": "${name}"} -->
    ${stdout}
  `
}
