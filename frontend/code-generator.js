const { pascalCase, camelCase } = require("change-case");
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
const fs = require("fs-extra");

const argv = yargs(hideBin(process.argv)).argv;
const componentFoldername = argv.file.trim();
const componentFilename = `${componentFoldername}.tsx`;
const styleFilename = `${componentFoldername}.module.scss`;
const indexFilename = "index.ts";

const componentName = pascalCase(componentFoldername);
const styleClassName = camelCase(componentFoldername);

const componentFileContent = `import styles from "./${styleFilename}";

type Props = {};

function ${componentName}({}: Props) {
  return <div />;
}

export default ${componentName};
`;
const styleFileContent = `.${styleClassName} {}`;
const indexFileContent = `export { default } from "./${componentFoldername}";`;

const pathToFile = `./src/components/${componentFoldername}/`;

console.log("Creating files");

fs.outputFileSync(pathToFile + componentFilename, componentFileContent);
fs.outputFileSync(pathToFile + styleFilename, styleFileContent);
fs.outputFileSync(pathToFile + indexFilename, indexFileContent);

console.log("Done!");
