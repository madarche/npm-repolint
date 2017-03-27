'use strict'
const https = require('https')

let token

let searchRepo = function(language, page, callback) {
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
let search = function(url, callback) {
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
let simpleGet = function(url, callback) {
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
let simpleGetRaw = function(url, callback) {
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
let setToken = function(userToken) {
    token = userToken
}

module.exports = {
    searchRepo: searchRepo,
    search: search,
    get: simpleGet,
    getRaw: simpleGetRaw,
    setToken: setToken
}
