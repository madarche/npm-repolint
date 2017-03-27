'use strict'
const requester = require('./requester')
const fs = require('fs')
const os = require('os')

let existPackageJson = function(repo, file, done) {
    let url = 'https://api.github.com/search/code?q=repo:' + repo.full_name + '+filename:' + file
    requester.search(url, (result) => {

        if (result.total_count === 0) {
            done(false, repo)
        } else if (result.total_count === 1) {
            done(true, repo)
        }
    })
}
let getPackageJSON = function(repo, done) {
    //let url = 'https://api.github.com/search/code?q=' + code + '+repo:' + repo + '+filename:' + file
    let url = 'https://api.github.com/repos/' + repo.full_name + '/contents/package.json'
    requester.search(url, (result) => {
        if (global.DEBUG) {
            console.log('getPackageJSON ' + repo.full_name + ' : ' + result)
            console.log('getPackageJSON ' + repo.full_name + ' : ' + result.download_url)
        }

        if (result.download_url !== undefined) {
            requester.get(result.download_url, (res) => {
                done(res, repo)
            })
        }
    })
}
let getReadme = function(repo, done) {

    let url = 'https://api.github.com/repos/' + repo.full_name + '/contents/README.md'
    requester.search(url, (result) => {
        if (global.DEBUG) {
            console.log('getREADME ' + repo.full_name + ' : ' + result)
            console.log('getReadmeURL ' + repo.full_name + ' : ' + result.download_url)
        }
        if (result.download_url !== undefined) {
            requester.getRaw(result.download_url, (res) => {
                done(res, repo)
            })
        }
    })
}
let testString = function(repo, readme, string) {
    let file = ('' + string)

    file = file.substring(file.lastIndexOf('[') + 1, file.lastIndexOf(']'))
    if (!(readme.indexOf(string) > -1)) {
        write(file, repo.html_url)
    }
}

let existField = function(json, field, repo) {
    if (global.DEBUG) {
        console.log('exist ' + field + ' : ' + json[field])
    }
    if (json[field] === undefined) {
        write(field, repo.html_url)
    }
}

let exisEsLint = function(json, repo) {
    if (global.DEBUG) {
        console.log('exist EsLint : ' + json.devDependencies)
    }
    if (json.devDependencies === undefined || json.devDependencies.eslint === undefined) {
        write('EsLint', repo.html_url)
    }
}

let write = function(file, text) {
    if (!fs.existsSync(global.ROOT_DIR)) {
        fs.mkdirSync(global.ROOT_DIR)
    }
    if (global.DEBUG) {
        console.log('Write to : ' + file)
    }
    fs.writeFileSync(global.ROOT_DIR + file, text + os.EOL, {
        flag: 'a'
    }, (err) => {
        if (err) {
            return console.error(err)
        }
    })
}
module.exports = {
    existPackageJson: existPackageJson,
    getPackageJSON: getPackageJSON,
    getReadme: getReadme,
    testString: testString,
    existField: existField,
    exisEsLint: exisEsLint
}
