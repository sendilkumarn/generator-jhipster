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
const path = require('path');
const chalk = require('chalk');
const statistics = require('../statistics');

module.exports = {
    askForInsightOptIn,
    askForModuleName,
};

async function askForInsightOptIn() {
    const answers = await this.prompt({
        when: () => statistics.shouldWeAskForOptIn(),
        type: 'confirm',
        name: 'insight',
        message: `May ${chalk.cyan('JHipster')} anonymously report usage statistics to improve the tool over time?`,
        default: true,
    });
    if (answers.insight !== undefined) {
        statistics.setOptOutStatus(!answers.insight);
    }
}

async function askForModuleName() {
    if (this.existingProject) return undefined;
    return askModuleName(this);
}

function getDefaultAppName() {
    return /^[a-zA-Z0-9_]+$/.test(path.basename(process.cwd())) ? path.basename(process.cwd()) : 'jhipster';
}

async function askModuleName(generator) {
    const defaultAppBaseName = getDefaultAppName();
    const prompt = await generator.prompt({
        type: 'input',
        name: 'baseName',
        validate: input => {
            if (!/^([a-zA-Z0-9_]*)$/.test(input)) {
                return 'Your base name cannot contain special characters or a blank space';
            }
            return true;
        },
        message: 'What is the base name of your application?',
        default: defaultAppBaseName,
    });

    generator.baseName = generator.jhipsterConfig.baseName = prompt.baseName;
}
