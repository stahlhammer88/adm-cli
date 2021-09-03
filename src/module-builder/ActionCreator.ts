import { prompt } from "inquirer";

export class ActionCreator {
  public async createModuleAction(): Promise<{ moduleName: string }> {
    return await prompt([
      {
        name: "moduleName",
        type: "input",
        message: "Enter the new module name in kebab-case",
        validate: this.kebabValidation,
      },
    ]);
  }

  public async createSubModuleAction(): Promise<{ moduleName: string }> {
    return await prompt([
      {
        name: "moduleName",
        type: "input",
        message: "Enter the module name you want to place the sub-module in (in kebab-case)",
        validate: this.kebabValidation,
      },
    ]);
  }

  public async createPageAction(): Promise<{ pageName: string }> {
    return await prompt([
      {
        name: "pageName",
        type: "input",
        message: "Enter the page name in kebab-case",
        validate: this.kebabValidation,
      },
    ]);
  }

  public async createDataTypeAction(): Promise<{ dataType: string }> {
    return await prompt([
      {
        name: "dataType",
        type: "input",
        message: "Enter short page data type interface without I",
      },
    ]);
  }

  public async createServiceAction(): Promise<{ serviceName: string }> {
    return await prompt([
      {
        name: "serviceName",
        type: "input",
        message: "Enter the service provider name in kebab-case",
        validate: this.kebabValidation,
      },
    ]);
  }

  private kebabValidation(input: string) {
    const isKebabCase = /^([a-z][a-z0-9]*)(-[a-z0-9]+)*$/.test(input);

    if (isKebabCase) {
      return true;
    } else {
      return "Module name must only include letters, numbers, underscores and hashes. pAlso it should match to kebab-case.";
    }
  }
}
