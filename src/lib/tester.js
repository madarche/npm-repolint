/* eslint-disable no-console */
/* eslint-disable no-sync */
'use strict'
const requester = require('./requester')
const fs = require('fs')
const os = require('os')

function existFile(repo, file, done) {
    let url = 'https://api.github.com/search/code?q=repo:' + repo.full_name + '+filename:' + file
    requester.search(url, (result) => {

        if (result.total_count === 0) {
            done(false, repo)
        } else if (result.total_count === 1) {
            done(true, repo)
        }
    })
}

function getPackageJSON(repo, done) {
    //let url = 'https://api.github.com/search/code?q=' + code + '+repo:' + repo + '+filename:' + file
    let url = 'https://api.github.com/repos/' + repo.full_name + '/contents/package.json'
    requester.search(url, (result) => {
        if (config.DEBUG) {
            console.log('getPackageJSON ' + repo.full_name + ' : ' + result)
            console.log('getPackageJSON ' + repo.full_name + ' : ' + result.download_url)
        }

        if (result.download_url !== undefined) {
            requester.get(result.download_url, (res) => {
                result = JSON.parse(res)
                done(result, repo)
            })
        }
    })
}

//TODO factorize with getPackageJSON
function getReadme(repo, done) {

    let url = 'https://api.github.com/repos/' + repo.full_name + '/contents/README.md'
    requester.search(url, (result) => {
        if (config.DEBUG) {
            console.log('getREADME ' + repo.full_name + ' : ' + result)
            console.log('getReadmeURL ' + repo.full_name + ' : ' + result.download_url)
        }
        if (result.download_url !== undefined) {
            requester.get(result.download_url, (res) => {
                done(res, repo)
            })
        }
    })
}

function testString(repo, readme, string) {
    let file = ('' + string)

    file = file.substring(file.lastIndexOf('[') + 1, file.lastIndexOf(']'))
    if (!(readme.indexOf(string) > -1)) {
        write(file, repo.html_url)
    }
}

function existField(json, field, repo) {
    if (config.DEBUG) {
        console.log('exist ' + field + ' : ' + json[field])
    }
    if (json[field] === undefined) {
        write(field, repo.html_url)
    }
}

function existEsLint(json, repo) {
    if (config.DEBUG) {
        console.log('exist EsLint : ' + json.devDependencies)
    }
    if (json.devDependencies === undefined || json.devDependencies.eslint === undefined) {
        write('EsLint', repo.html_url)
    }
}

function write(file, text) {
    if (!fs.existsSync(config.root_dir_path)) {
        fs.mkdirSync(config.root_dir_path)
    }
    if (config.DEBUG) {
        console.log('Write to : ' + file)
    }
    fs.writeFileSync(config.root_dir_path + file, text + os.EOL, {
        flag: 'a'
    }, (err) => {
        if (err) {
            return console.error(err)
        }
    })
}
let config
module.exports = function(a_config) {
    config = a_config
    return {
        existFile,
        getPackageJSON,
        getReadme,
        testString,
        existField,
        existEsLint,
        write
    }
}
