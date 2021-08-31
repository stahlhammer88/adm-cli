#!/usr/bin/env node

import { Command } from "commander";
import { ModuleBuilder } from "../module-builder/ModuleBuilder";
const program = new Command();
const moduleBuilder = new ModuleBuilder();

program
  .command("add-module")
  .action(() => {
    moduleBuilder.createModule();
  })

program
  .command("add-page")
  .action(() => {
    moduleBuilder.startPagesDialogue();
  })

program
  .command("add-short-page")
  .action(() => {
    moduleBuilder.createShortPage();
  })

program
  .command("add-service-provider")
  .action(() => {
    moduleBuilder.startServiceDialogue();
  })

program.parse(process.argv);
