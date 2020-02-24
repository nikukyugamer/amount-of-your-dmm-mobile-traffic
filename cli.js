#!/usr/bin/env node

const dmmMobileClient = require('./src/amountOfYourDmmMobileTraffic');
const program = require('commander');

class AmountOfYourDmmMobileTraffic {
  constructor() {
    program.option(
      '-n, --number <number>',
      'A Nth number which indicates the Nth telepone number in "My Page"',
      '1'
    );

    program.parse(process.argv);
    this.options = program.opts();
  }

  execute() {
    dmmMobileClient(this.options.number);
  }
}

const amountOfYourDmmMobileTraffic = new AmountOfYourDmmMobileTraffic();
amountOfYourDmmMobileTraffic.execute();
