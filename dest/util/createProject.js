"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Path = require("path");
const fs = require("fs");
const mkdirp = require("mkdirp");
const Execa = require("execa");
const chalk_1 = require("chalk");
const spinner_1 = require("../util/spinner");
const Log = require("../util/log");
var EError;
(function (EError) {
    EError["projectNotExist"] = "project not exist";
    EError["createNpmProjectFailed"] = "create npm project failed";
    EError["crnCliNotExist"] = "crn-cli not exist";
    EError["createCrnProjectFailed"] = "create crn project failed";
})(EError = exports.EError || (exports.EError = {}));
/**
 * projectName 项目名
 * shouldExist 目标项目是否已存在
 * isNpm 是否创建npm项目
 */
function createProject(projectName, shouldExist, isNpm) {
    return __awaiter(this, void 0, void 0, function* () {
        if (shouldExist) {
            if (!isProjectExist(projectName)) {
                throw new Error(EError.projectNotExist);
            }
            else {
                return;
            }
        }
        else {
            if (isProjectExist(projectName)) {
                // 询问用户是否希望覆盖
            }
            if (isNpm) {
                yield createNpmProject(projectName);
            }
            else {
                yield checkCrnCliExist();
                yield createCrnProject(projectName);
            }
        }
    });
}
exports.default = createProject;
function isProjectExist(projectName) {
    const projectPath = Path.resolve(projectName);
    return fs.existsSync(projectPath);
}
function overrideExistProject() {
}
function createNpmProject(projectName) {
    return __awaiter(this, void 0, void 0, function* () {
        const spinner = spinner_1.default('创建nodejs项目中');
        const projectPath = Path.resolve(projectName);
        try {
            mkdirp.sync(projectPath);
            process.chdir(projectPath);
            yield Execa('npm', ['init', '--yes']);
            process.chdir(Path.resolve('../'));
            spinner.hide();
            Log.info('创建nodejs项目成功');
        }
        catch (e) {
            spinner.hide();
            ;
            const err = e;
            Log.error(err.message);
            Log.error(err.stack);
            Log.error('创建nodejs项目失败');
            throw new Error(EError.createNpmProjectFailed);
        }
    });
}
function checkCrnCliExist() {
    return __awaiter(this, void 0, void 0, function* () {
        const crnCliUrl = 'http://crn.site.ctripcorp.com/';
        try {
            yield Execa('which', ['crn-cli']);
        }
        catch (e) {
            Log.error(`请先安装${chalk_1.default.red('crn-cli')}，安装教程：${chalk_1.default.blueBright.underline(crnCliUrl)}`);
            throw new Error(EError.crnCliNotExist);
        }
    });
}
function createCrnProject(projectName) {
    return __awaiter(this, void 0, void 0, function* () {
        const spinner = spinner_1.default('创建crn项目中');
        try {
            yield Execa('crn-cli', ['init', projectName]);
            spinner.hide();
            Log.info('创建crn项目成功');
        }
        catch (e) {
            spinner.hide();
            const err = e;
            Log.error(err.message);
            Log.error(err.stack);
            Log.error('创建crn项目失败');
            throw new Error(EError.createCrnProjectFailed);
        }
    });
}
