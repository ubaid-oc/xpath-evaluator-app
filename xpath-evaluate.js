#!/usr/bin/env node

'use strict';

let program = require('commander');
const pkg = require('./package');
const evaluateXPath = require('./src/evaluate');
const utils = require('./src/utils');

const _output = (issues = [], error = false) => {
    if (issues.length) {
        console[error ? 'error' : 'log'](`\n\n${issues.join( '\n\n' )}`);
    }
};

program
    .usage(' <XML file> <expression>')
    .version(pkg.version)
    .parse(process.argv);

const xmlFile = program.args[0];
const xPathExpr = program.args[1];

if (xmlFile && xPathExpr) {
    console.log(`Evaluating "${xPathExpr}" on ${xmlFile}`);

    utils.getFileContents(xmlFile)
        .then(xmlFile => evaluateXPath(xmlFile, xPathExpr))
        .catch((errors = []) => {
            errors = Array.isArray(errors) ? errors : [errors];
            _output(errors, true);
            process.exit(1);
        })
        .then((result = '') => {
            console.log(result);
            process.exit(0);
        });

} else {
    console.error('Nothing to do. Missing argument(s). Use --help flag to see manual.');
    process.exit(1);
}