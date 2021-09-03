import { findFolderPath } from './../utils/utils';
import { ActionCreator } from "./ActionCreator";
import {
  getCurrentProccesPath,
  createFolderStructure,
  convertKebabToCamelCase,
  uploadFileByTemplate,
  convertCamelToPascal,
} from "../utils/utils";
// import * as fs from "fs";
import * as path from "path";
import { makeAutoObservable } from "mobx";

export class ModuleBuilder {
  private moduleName: string = "";
  private pageName: string = "";
  private dataType: string = "";
  private serviceName: string = "";
  private currentPageDirPath: string = "";
  private currentStoreDirPath: string = "";
  private innerRootModule: string = "";
  private actionCreator: ActionCreator;

  constructor() {
    makeAutoObservable(this);
    this.actionCreator = new ActionCreator();
  }

  private get rootModuleFolder() {
    const currentProjectPath = getCurrentProccesPath();
    return path.resolve(currentProjectPath, "web", "src", "modules");
  }

  private get innerRootModuleFolder() {
    return findFolderPath(this.rootModuleFolder, this.innerRootModule)
  }

  private get moduleNameCamel() {
    return convertKebabToCamelCase(this.moduleName);
  }

  private get modulePath() {
    return path.resolve(this.rootModuleFolder, this.moduleName);
  }

  private get className() {
    return convertCamelToPascal(this.moduleNameCamel);
  }

  private get pageClassName() {
    return convertCamelToPascal(convertKebabToCamelCase(this.pageName));
  }

  private get dataTypePascal() {
    return convertCamelToPascal(convertKebabToCamelCase(this.dataType));
  }

  private get serviceNameCaps() {
    return this.serviceName.toUpperCase();
  }

  private get serviceClassName() {
    return convertCamelToPascal(convertKebabToCamelCase(this.serviceName));
  }

  private get serviceCamel() {
    return convertKebabToCamelCase(this.serviceName);
  }

  public async createModule() {
    const { moduleName } = await this.actionCreator.createModuleAction();
    this.moduleName = moduleName;

    const moduleMainPath = path.resolve(
      this.modulePath,
      `${this.moduleNameCamel}.module.ts`
    );
    const moduleRoutesPath = path.resolve(
      this.modulePath,
      `${this.moduleNameCamel}.routes.ts`
    );
    const moduleMenuPath = path.resolve(
      this.modulePath,
      `${this.moduleNameCamel}.menu.ts`
    );

    await createFolderStructure({
      rootPath: this.rootModuleFolder,
      paths: [this.moduleName],
    });

    uploadFileByTemplate({
      from: path.resolve(__dirname, "../templates/module.hbs"),
      to: moduleMainPath,
      data: {
        className: this.className,
        moduleNameCamel: this.moduleNameCamel,
      },
    });
    uploadFileByTemplate({
      from: path.resolve(__dirname, "../templates/menu.hbs"),
      to: moduleMenuPath,
      data: {
        moduleName: this.moduleName,
      },
    });
    uploadFileByTemplate({
      from: path.resolve(__dirname, "../templates/routes.hbs"),
      to: moduleRoutesPath,
      data: {
        moduleName: this.moduleName,
      },
    });
  }

  async createSubModule() {
    const { moduleName: rootModuleName } =
      await this.actionCreator.createSubModuleAction();
    const { moduleName: newModuleName } =
      await this.actionCreator.createModuleAction();

    this.innerRootModule = rootModuleName;
    this.moduleName = newModuleName;

    await createFolderStructure({
      rootPath: this.innerRootModuleFolder,
      paths: ['modules', `${this.moduleName}`, `${this.moduleName}->pages`, `${this.moduleName}->service-providers`],
    });

    const innerModulePath = path.resolve(this.innerRootModuleFolder, this.moduleName)

    const moduleMainPath = path.resolve(
      innerModulePath,
      `${this.moduleNameCamel}.module.ts`
    );
    const moduleRoutesPath = path.resolve(
      innerModulePath,
      `${this.moduleNameCamel}.routes.ts`
    );
    const moduleMenuPath = path.resolve(
      innerModulePath,
      `${this.moduleNameCamel}.menu.ts`
    );

    uploadFileByTemplate({
      from: path.resolve(__dirname, "../templates/module.hbs"),
      to: moduleMainPath,
      data: {
        className: this.className,
        moduleNameCamel: this.moduleNameCamel,
      },
    });
    uploadFileByTemplate({
      from: path.resolve(__dirname, "../templates/menu.hbs"),
      to: moduleMenuPath,
      data: {
        moduleName: this.moduleName,
      },
    });
    uploadFileByTemplate({
      from: path.resolve(__dirname, "../templates/routes.hbs"),
      to: moduleRoutesPath,
      data: {
        moduleName: this.moduleName,
      },
    });
  }

  async startPagesDialogue() {
    const { moduleName } = await this.actionCreator.createModuleAction();
    const { pageName } = await this.actionCreator.createPageAction();

    this.moduleName = moduleName;
    this.pageName = pageName;

    this.createInnerPages();
  }

  async startServiceDialogue() {
    const { moduleName } = await this.actionCreator.createModuleAction();
    const { serviceName } = await this.actionCreator.createServiceAction();

    this.serviceName = serviceName;
    this.moduleName = moduleName;

    const serviceProvidersDirPath = path.resolve(
      this.modulePath,
      "service-providers"
    );

    const serviceProviderPath = path.resolve(
      serviceProvidersDirPath,
      `${this.serviceClassName}Service.provider.ts`
    );

    uploadFileByTemplate({
      from: path.resolve(
        __dirname,
        "../templates/serviceProviders/serviceProvider.hbs"
      ),
      to: serviceProviderPath,
      data: {
        serviceClassName: this.serviceClassName,
        serviceCamel: this.serviceCamel,
      },
    });
  }

  async createInnerPages(isShort?: boolean) {
    const innerPaths = await createFolderStructure({
      rootPath: this.modulePath,
      paths: [
        "pages",
        `pages->${this.pageName}`,
        `pages->${this.pageName}->stores`,
      ],
    });
    const [, currentPageDirPath, currentStoreDirPath] = innerPaths;
    this.currentPageDirPath = currentPageDirPath;
    this.currentStoreDirPath = currentStoreDirPath;

    const pagePath = path.resolve(
      this.currentPageDirPath,
      `${this.pageClassName}.page.tsx`
    );

    const storePath = path.resolve(
      this.currentStoreDirPath,
      `${this.pageClassName}Store.ts`
    );

    const pageTemplatePath = isShort
      ? "../templates/baseShortPageFiles/shortPage.hbs"
      : "../templates/baseInnerFiles/page.hbs";
    const storeTemplatePath = isShort
      ? "../templates/baseShortPageFiles/shortPageStore.hbs"
      : "../templates/baseInnerFiles/store.hbs";

    uploadFileByTemplate({
      from: path.resolve(__dirname, pageTemplatePath),
      to: pagePath,
      data: {
        pageClassName: this.pageClassName,
      },
    });

    uploadFileByTemplate({
      from: path.resolve(__dirname, storeTemplatePath),
      to: storePath,
      data: {
        pageClassName: this.pageClassName,
        dataType: this.dataTypePascal,
        serviceClassName: this.serviceClassName,
        serviceName: this.serviceName,
        serviceNameCaps: this.serviceNameCaps,
      },
    });
  }

  public async createShortPage() {
    const { moduleName } = await this.actionCreator.createModuleAction();
    const { pageName } = await this.actionCreator.createPageAction();
    const { dataType } = await this.actionCreator.createDataTypeAction();
    const { serviceName } = await this.actionCreator.createServiceAction();

    this.moduleName = moduleName;
    this.pageName = pageName;
    this.dataType = dataType;
    this.serviceName = serviceName;

    await this.createInnerPages(true);

    const configPath = path.resolve(this.currentPageDirPath, `config.ts`);

    uploadFileByTemplate({
      from: path.resolve(
        __dirname,
        "../templates/baseShortPageFiles/config.hbs"
      ),
      to: configPath,
      data: {
        pageClassName: this.pageClassName,
      },
    });
  }
}
