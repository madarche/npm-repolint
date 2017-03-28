/* eslint-disable no-console */
'use strict'
const https = require('https')

let token

function searchRepo(language, page, callback) {
    let options
    if (token !== undefined) {
        options = {
            hostname: 'api.github.com',
            path: '/search/repositories?q=language:' + language + '&sort=pushed,stars&scope=public&order=desc&per_page=100&page=' + page,
            method: 'GET',
            headers: {
                'user-agent': 'npm-repolint',
                Authorization: 'token ' + token
            }
        }
    } else {
        options = {
            hostname: 'api.github.com',
            path: '/search/repositories?q=language:' + language + '&sort=pushed,stars&scope=public&order=desc&per_page=100&page=' + page,
            method: 'GET',
            headers: {
                'user-agent': 'npm-repolint'
            }
        }
    }
    https.get(options, (res) => {

        let body = ''
        res.on('data', (d) => {
            body += d
        })
        res.on('end', () => {
            let data = JSON.parse(body)
            callback(data)
        })
    })

}

function search(url, callback) {
    let options = {
        hostname: 'api.github.com',
        path: url,
        method: 'GET',
        headers: {
            'user-agent': 'npm-repolint',
            Authorization: 'token ' + token
        }
    }

    https.get(options, (res) => {

        let body = ''
        res.on('data', (d) => {
            body += d
        })
        res.on('end', () => {
            let data = JSON.parse(body)
            callback(data)
        })
    })

}

function simpleGet(url, callback) {
    https.get(url, (res) => {
        let body = ''
        res.on('data', (d) => {
            body += d
        })
        res.on('end', () => {
            let data = JSON.parse(body)
            callback(data)
        })
    })
}

function simpleGetRaw(url, callback) {
    https.get(url, (res) => {
        let body = ''
        res.on('data', (d) => {
            body += d
        })
        res.on('end', () => {

            callback(body)
        })
    })
}

function setToken(userToken) {
    token = userToken
}


module.exports = {
    searchRepo: searchRepo,
    search: search,
    get: simpleGet,
    getRaw: simpleGetRaw,
    setToken: setToken
}
