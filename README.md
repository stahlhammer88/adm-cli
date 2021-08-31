## Installation
1. Clone the repo
2. run `yarn install`
3. run `yarn build:ts`
4. `cd build`
5. `npm link`
6. if it doesn't work, copy `package.json` into the `build` folder and run `npm link` again
7. `cd ../`
8. switch to your qlean-admins project and run `adm-cli` to access commands

## Commands
```adm-cli add-module```
* Requires a **module name** entered in kebab-case
* Creates a new module in web/src

```adm-cli add-page```
* Requires a **module name** entered in kebab-case
* Requires a **page name** entered in kebab-case
* Creates a new page in the given module

```add-short-page```
* Requires a **module name** entered in kebab-case
* Requires a **page name** entered in kebab-case
* Requires a **data type** entered in kebab-case (should be simialar to the one in PlatformAdminApi excluding the **I**)
* Requires a **service provider name** entered in kebab-case
* Creates a new page in the given module based on `ShortPage` component

```add-service-provider```
* Requires a **module name** entered in kebab-case
* Requires a **service provider name** entered in kebab-case
* Creates a new service provider in the given module