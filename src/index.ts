#!/usr/bin/env node

import { Command } from 'commander';
import { main } from './pitot';

const program = new Command();

program
  .usage('[options]')
  .option('-d, --debug', 'output extra debugging')
  .option('-f, --files [files...]', 'files')
  .action(async (options) => {
    try {
      console.log(options);
      main(options.files);
    } catch (err) {
      console.error(err);
    }
  })
  .parse(process.argv);
