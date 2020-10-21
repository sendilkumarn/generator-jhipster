/**
 * Copyright 2013-2020 the original author or authors from the JHipster project.
 *
 * This file is part of the JHipster project, see https://www.jhipster.tech/
 * for more information.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const chalk = require('chalk');

const { serverDefaultConfig } = require('../generator-defaults');

module.exports = {
    askForModuleName,
    askForServerSideOpts,
};

function askForModuleName() {
    if (this.jhipsterConfig.baseName) return undefined;

    return this.askModuleName(this);
}

function askForServerSideOpts() {
    if (this.existingProject) return undefined;

    const applicationType = this.jhipsterConfig.applicationType;
    let defaultPort = '8080';
    if (applicationType === 'uaa') {
        defaultPort = '9999';
    }
    const prompts = [
        {
            type: 'input',
            name: 'serverPort',
            validate: input => (/^([0-9]*)$/.test(input) ? true : 'This is not a valid port number.'),
            message: 'On which port would like your server to run? It should be unique to avoid port conflicts.',
            default: defaultPort,
        },
        {
            type: 'input',
            name: 'packageName',
            validate: input =>
                /^([a-z_]{1}[a-z0-9_]*(\.[a-z_]{1}[a-z0-9_]*)*)$/.test(input)
                    ? true
                    : 'The package name you have provided is not a valid Java package name.',
            message: 'What is your default Java package name?',
            default: serverDefaultConfig.packageName,
            store: true,
        },
        {
            type: 'list',
            name: 'databaseType',
            message: `Which ${chalk.yellow('*type*')} of database would you like to use?`,
            choices: response => {
                const opts = [];
                opts.push({
                    value: 'mongodb',
                    name: 'MongoDB',
                });
                opts.push({
                    value: 'r2dbc',
                    name: 'R2dbc',
                });
                return opts;
            },
            default: 'mongodb',
        },
    ];

    return this.prompt(prompts).then(props => {
        this.packageName = this.jhipsterConfig.packageName = props.packageName;
        this.serverPort = this.jhipsterConfig.serverPort = props.serverPort || '8080';
        this.databaseType = this.jhipsterConfig.databaseType = props.databaseType;
        this.devDatabaseType = this.jhipsterConfig.devDatabaseType = props.devDatabaseType;
        this.prodDatabaseType = this.jhipsterConfig.prodDatabaseType = props.prodDatabaseType;
        this.buildTool = 'gradle';
    });
}
