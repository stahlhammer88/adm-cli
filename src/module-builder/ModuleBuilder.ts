import { prompt } from "inquirer";
import { getCurrentProccesPath, createFolderStructure } from "../utils/utils";
// import * as fs from "fs";
import * as path from "path";

export class ModuleBuilder {
  init() {
    const currentProjectPath = getCurrentProccesPath();
    const modulesFolder = path.resolve(
      currentProjectPath,
      "web",
      "src",
      "modules"
    );

    // const projectFolders: string[] = fs.readdirSync(
    //   path.resolve(modulesFolder)
    // );

    prompt([
      {
        name: "moduleName",
        type: "input",
        message: "Enter the module name in kebab-case",
        validate: (input: string) => {
          const isKebabCase = /^([a-z][a-z0-9]*)(-[a-z0-9]+)*$/.test(input);

          if (isKebabCase) {
            return true;
          } else {
            return "Module name must only include letters, numbers, underscores and hashes. Also it should match to kebab-case.";
          }
        },
      },
    ]).then((action: { moduleName: string }) => {
      const { moduleName } = action;
    //   const moduleNameCamel = convertKebabToCamelCase(moduleName);
      const modulePath = path.resolve(modulesFolder, moduleName)
    //   const className = `${name[0].toUpperCase()}${moduleNameCamel.slice(1)}`

      createFolderStructure({rootPath: modulePath, paths: ['stores', 'pages']})
    });
  }
}
