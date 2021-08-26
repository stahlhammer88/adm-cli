#!/usr/bin/env node

import { Command } from "commander";
import { ModuleBuilder } from "../module-builder/ModuleBuilder";
const program = new Command();

program
  .command("add-module")
  .action((moduleName) => {
    const moduleBuilder = new ModuleBuilder();
    moduleBuilder.init();
  })
  .parse(process.argv);
