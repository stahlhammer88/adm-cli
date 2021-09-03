import * as path from "path";
import * as mkdirp from "mkdirp";
import * as fs from "fs";
import handlebars from "handlebars";

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

export const convertCamelToPascal = (camelCaseString: string) => {
  return `${camelCaseString[0].toUpperCase()}${camelCaseString.slice(1)}`;
};

export const createFolderStructure = (options: {
  rootPath: string;
  paths: string[];
}): Promise<string[]> => {
  return Promise.all(
    options.paths.map((innerPath) => {
      let endPath = "";
      if (innerPath.includes("->")) {
        const [...paths] = innerPath.split("->");
        endPath = path.resolve(options.rootPath, ...paths);
      } else {
        endPath = path.resolve(options.rootPath, innerPath);
      }

      return new Promise<string>((resolve, reject) => {
        mkdirp(endPath)
          .then(() => {
            console.log(`-- mkdir for path ${endPath} done.`);
            resolve(endPath);
          })
          .catch((err) => {
            console.error(err);
            reject();
          });
      });
    })
  );
};

export const findFolderPath = (
  rootPath: string,
  folderName: string,
  resultPath: string = ""
) => {
  const folders: string[] = fs.readdirSync(rootPath);

  for (let i = 0; i < folders.length; i++) {
    const folder = folders[i];
    const currentPath = path.resolve(rootPath, folderName);

    if (folder === folderName) {
      resultPath = currentPath;
      break;
    } else {
      findFolderPath(currentPath, folderName, resultPath);
    }
  }

  return resultPath;
};

export const uploadFileByTemplate = (options: {
  from: string;
  to: string;
  data: any;
}) => {
  const { from, to, data } = options;
  fs.readFile(from, "utf-8", (error: Error, source: any) => {
    if (error) {
      return error;
    }

    var template = handlebars.compile(source);
    var text = template(data);
    fs.writeFileSync(to, text);

    return;
  });
};
