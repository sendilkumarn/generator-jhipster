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
const cleanup = require('../cleanup');
const constants = require('../generator-constants');

/* Constants use throughout */
// const INTERPOLATE_REGEX = constants.INTERPOLATE_REGEX;
const DOCKER_DIR = constants.DOCKER_DIR;
const SERVER_MAIN_SRC_DIR = constants.SERVER_MAIN_SRC_DIR;
const SERVER_MAIN_RES_DIR = constants.SERVER_MAIN_RES_DIR;
const SERVER_TEST_SRC_DIR = constants.SERVER_TEST_SRC_DIR;
const SERVER_TEST_RES_DIR = constants.SERVER_TEST_RES_DIR;

/**
 * The default is to use a file path string. It implies use of the template method.
 * For any other config an object { file:.., method:.., template:.. } can be used
 */
const serverFiles = {
    serverBuild: [
        {
            templates: [
                'build.gradle.kts',
                'settings.gradle.kts',
                { file: 'gradlew', method: 'copy', noEjs: true },
                { file: 'gradlew.bat', method: 'copy', noEjs: true },
                { file: 'gradle/wrapper/gradle-wrapper.jar', method: 'copy', noEjs: true },
                'gradle/wrapper/gradle-wrapper.properties',
            ],
        },
    ],
    docker: [
        {
            path: DOCKER_DIR,
            templates: ['app.yml'],
        },
        {
            condition: generator => generator.prodDatabaseType === 'mongodb',
            path: DOCKER_DIR,
            templates: ['mongodb-cluster.yml', 'mongodb/MongoDB.Dockerfile', 'mongodb/scripts/init_replicaset.js'],
        },
    ],
    serverResource: [
        {
            path: SERVER_MAIN_RES_DIR,
            templates: ['application.properties', 'data/users.json', 'data/tables.sql'],
        },
    ],
    serverJavaApp: [
        {
            path: SERVER_MAIN_SRC_DIR,
            templates: [{ file: 'package/Application.java', renameTo: generator => `${generator.javaDir}${generator.mainClass}.java` }],
        },
    ],
    serverJavaConfig: [
        {
            path: SERVER_MAIN_SRC_DIR,
            templates: [
                { file: 'package/config/Database.java', renameTo: generator => `${generator.javaDir}config/Database.java` },
                { file: 'package/config/Web.java', renameTo: generator => `${generator.javaDir}config/Web.java` },
                {
                    file: 'package/config/JHipsterFuProperties.java',
                    renameTo: generator => `${generator.javaDir}config/JHipsterFuProperties.java`,
                },
            ],
        },
    ],
    serverJavaEntity: [
        {
            path: SERVER_MAIN_SRC_DIR,
            templates: [{ file: 'package/domain/User.java', renameTo: generator => `${generator.javaDir}domain/User.java` }],
        },
    ],
    serverJavaHandler: [
        {
            path: SERVER_MAIN_SRC_DIR,
            templates: [
                { file: 'package/handler/UserHandler.java', renameTo: generator => `${generator.javaDir}handler/UserHandler.java` },
            ],
        },
    ],
    serverJavaRepository: [
        {
            path: SERVER_MAIN_SRC_DIR,
            templates: [
                {
                    file: 'package/repository/UserRepository.java',
                    renameTo: generator => `${generator.javaDir}repository/UserRepository.java`,
                },
            ],
        },
    ],
};

function writeFiles() {
    return {
        setUp() {
            this.javaDir = `${this.packageFolder}/`;
            this.testDir = `${this.packageFolder}/`;

            this.generateKeyStore();
        },

        cleanupOldServerFiles() {
            cleanup.cleanupOldServerFiles(
                this,
                `${SERVER_MAIN_SRC_DIR}/${this.javaDir}`,
                `${SERVER_TEST_SRC_DIR}/${this.testDir}`,
                SERVER_MAIN_RES_DIR,
                SERVER_TEST_RES_DIR
            );
        },

        writeFiles() {
            this.writeFilesToDisk(serverFiles);
        },
    };
}

module.exports = {
    writeFiles,
    serverFiles,
};
