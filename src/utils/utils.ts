import * as path from "path";
const mkdirp = require("mkdirp");

export const getCurrentProccesPath = () => {
  return process.cwd();
};

export const convertKebabToCamelCase = (kebabCaseString: string) => {
  return kebabCaseString
    .split("-")
    .map((name, index) => {
      if (index) {
        return `${name[0].toUpperCase()}${name.slice(1)}`;
      } else {
        return name;
      }
    })
    .join("");
};

export const createFolderStructure = (options: {
  rootPath: string;
  paths: string[];
}): Promise<void> => {
  return new Promise((res, rej) => {
    options.paths.map((innerPath) => {
      const endPath = path.resolve(options.rootPath, innerPath);
      mkdirp(endPath, (err: Error) => {
        if (err) {
          rej(err);
        } else {
          console.log(`-- mkdir for path ${endPath} done.`);
        }
      });
    });

    res();
  });
};
