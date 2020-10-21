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
/* eslint-disable consistent-return */
const chalk = require('chalk');
const _ = require('lodash');
const os = require('os');
const prompts = require('./prompts');
const BaseBlueprintGenerator = require('../generator-base-blueprint');
const writeFiles = require('./files').writeFiles;
const packagejs = require('../../package.json');
const constants = require('../generator-constants');
const fuConstants = require('../fu/fu-constants');
const statistics = require('../statistics');
// const { getBase64Secret, getRandomHex } = require('../utils');
// const { defaultConfig } = require('../generator-defaults');
// const { printJHipsterFuLogo } = require('../fu/fu-generator-base');

let useBlueprints;

module.exports = class JHipsterFuServerGenerator extends BaseBlueprintGenerator {
    constructor(args, opts) {
        super(args, opts);

        if (this.options.help) {
            return;
        }

        this.loadStoredAppOptions();
        this.loadRuntimeOptions();

        // preserve old jhipsterVersion value for cleanup which occurs after new config is written into disk
        this.jhipsterOldVersion = this.jhipsterConfig.jhipsterVersion;

        useBlueprints = !this.fromBlueprint && this.instantiateBlueprints('fu-server');

        this.registerPrettierTransform();
    }

    // Public API method used by the getter and also by Blueprints
    _initializing() {
        return {
            validateFromCli() {
                this.checkInvocationFromCLI();
            },

            displayLogo() {
                if (this.logo) {
                    this.printJHipsterLogo();
                }
            },

            setupServerconsts() {
                // Make constants available in templates
                this.MAIN_DIR = constants.MAIN_DIR;
                this.TEST_DIR = constants.TEST_DIR;
                this.SERVER_MAIN_SRC_DIR = constants.SERVER_MAIN_SRC_DIR;
                this.SERVER_MAIN_RES_DIR = constants.SERVER_MAIN_RES_DIR;
                this.SERVER_TEST_SRC_DIR = constants.SERVER_TEST_SRC_DIR;
                this.SERVER_TEST_RES_DIR = constants.SERVER_TEST_RES_DIR;

                this.HUSKY_VERSION = constants.HUSKY_VERSION;
                this.LINT_STAGED_VERSION = constants.LINT_STAGED_VERSION;
                this.PRETTIER_VERSION = constants.PRETTIER_VERSION;
                this.PRETTIER_JAVA_VERSION = constants.PRETTIER_JAVA_VERSION;

                this.JAVA_VERSION = constants.JAVA_VERSION;

                this.GRADLE_VERSION = constants.GRADLE_VERSION;

                this.JACOCO_VERSION = constants.JACOCO_VERSION;

                this.JACKSON_DATABIND_NULLABLE_VERSION = constants.JACKSON_DATABIND_NULLABLE_VERSION;

                this.DOCKER_COMPOSE_FORMAT_VERSION = constants.DOCKER_COMPOSE_FORMAT_VERSION;
                this.DOCKER_MONGODB = constants.DOCKER_MONGODB;

                /* Fu constants */
                this.SPRING_BOOT_FU_VERSION = fuConstants.SPRING_BOOT_FU_VERSION;
                this.JAVA_GRADLE_VERSION = fuConstants.JAVA_GRADLE_VERSION;
                this.SPRING_BOOT_VERSION = fuConstants.SPRING_BOOT_VERSION;
                this.SPRING_BOOT_DM_VERSION = fuConstants.SPRING_BOOT_DM_VERSION;

                this.packagejs = packagejs;
            },

            setupRequiredConfig() {
                if (!this.jhipsterConfig.applicationType) {
                    /* TODO: Change this into default generator application type once we start supporting them */
                    this.jhipsterConfig.applicationType = 'fu';
                }
            },

            verifyExistingProject() {
                const serverConfigFound =
                    this.jhipsterConfig.packageName !== undefined &&
                    this.jhipsterConfig.databaseType !== undefined &&
                    this.jhipsterConfig.devDatabaseType !== undefined &&
                    this.jhipsterConfig.prodDatabaseType !== undefined &&
                    this.jhipsterConfig.buildTool !== undefined;

                if (this.jhipsterConfig.baseName !== undefined && serverConfigFound) {
                    this.log(
                        chalk.green(
                            'This is an existing project, using the configuration from your .yo-rc.json file \n' +
                                'to re-generate the project...\n'
                        )
                    );

                    this.existingProject = true;
                }
            },
        };
    }

    get initializing() {
        if (useBlueprints) return;
        return this._initializing();
    }

    // Public API method used by the getter and also by Blueprints
    _prompting() {
        return {
            askForModuleName: prompts.askForModuleName,
            askForServerSideOpts: prompts.askForServerSideOpts,

            setSharedConfigOptions() {
                // Make dist dir available in templates
                this.BUILD_DIR = this.getBuildDirectoryForBuildTool(this.jhipsterConfig.buildTool);
            },
        };
    }

    get prompting() {
        if (useBlueprints) return;
        return this._prompting();
    }

    // Public API method used by the getter and also by Blueprints
    _configuring() {
        return {
            validateConfig() {
                this._validateServerConfiguration();
            },
        };
    }

    get configuring() {
        if (useBlueprints) return;
        return this._configuring();
    }

    // Public API method used by the getter and also by Blueprints
    _composing() {
        return {};
    }

    get composing() {
        if (useBlueprints) return;
        return this._composing();
    }

    // Public API method used by the getter and also by Blueprints
    _loading() {
        return {
            loadSharedConfig() {
                this.loadAppConfig();
                this.loadServerConfig();
            },
        };
    }

    get loading() {
        if (useBlueprints) return;
        return this._loading();
    }

    // Public API method used by the getter and also by Blueprints
    _preparing() {
        return {
            prepareForTemplates() {
                // Application name modified, using each technology's conventions
                this.camelizedBaseName = _.camelCase(this.baseName);
                this.dasherizedBaseName = _.kebabCase(this.baseName);
                this.lowercaseBaseName = this.baseName.toLowerCase();
                this.humanizedBaseName = _.startCase(this.baseName);
                this.mainClass = this.getMainClassName();

                this.pkType = this.getPkType(this.databaseType);

                this.jhiTablePrefix = this.getTableName(this.jhiPrefix);
            },
        };
    }

    get preparing() {
        if (useBlueprints) return;
        return this._preparing();
    }

    // Public API method used by the getter and also by Blueprints
    _default() {
        return {
            ...super._missingPreDefault(),

            insight() {
                statistics.sendSubGenEvent('generator', 'server', {
                    app: {
                        databaseType: this.databaseType,
                        devDatabaseType: this.devDatabaseType,
                        prodDatabaseType: this.prodDatabaseType,
                        buildTool: this.buildTool,
                    },
                });
            },
        };
    }

    get default() {
        if (useBlueprints) return;
        return this._default();
    }

    // Public API method used by the getter and also by Blueprints
    _writing() {
        return { ...writeFiles(), ...super._missingPostWriting() };
    }

    get writing() {
        if (useBlueprints) return;
        return this._writing();
    }

    _postWriting() {
        return {};
    }

    get postWriting() {
        if (useBlueprints) return;
        return this._postWriting();
    }

    _install() {
        return {
            installing() {
                if (this.skipClient) {
                    if (!this.options.skipInstall) {
                        this.log(chalk.bold(`\nInstalling generator-jhipster@${this.jhipsterVersion} locally using npm`));
                        this.npmInstall();
                    }
                }
            },
        };
    }

    get install() {
        if (useBlueprints) return;
        return this._install();
    }

    // Public API method used by the getter and also by Blueprints
    _end() {
        return {
            end() {
                this.log(chalk.green.bold('\nServer application generated successfully.\n'));
                const executable = 'gradlew';
                let logMsgComment = '';
                if (os.platform() === 'win32') {
                    logMsgComment = ` (${chalk.yellow.bold(executable)} if using Windows Command Prompt)`;
                }
                this.log(chalk.green(`Run your Spring Boot application:\n${chalk.yellow.bold(`./${executable}`)}${logMsgComment}`));
            },
        };
    }

    get end() {
        if (useBlueprints) return;
        return this._end();
    }

    _validateServerConfiguration(config = this.jhipsterConfig) {
        if (!config.packageFolder) {
            config.packageFolder = config.packageName.replace(/\./g, '/');
        }

        if (!config.databaseType && config.prodDatabaseType) {
            config.databaseType = this.getDBTypeFromDBValue(config.prodDatabaseType);
        }
        if (!config.devDatabaseType && config.prodDatabaseType) {
            config.devDatabaseType = config.prodDatabaseType;
        }

        const databaseType = config.databaseType;
        config.devDatabaseType = databaseType;
        config.prodDatabaseType = databaseType;

    }
};
