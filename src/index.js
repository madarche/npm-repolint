/* eslint-disable no-console */
'use strict'
const path = require('path')
const config = {
    DEBUG: false,
    root_dir_path: path.join(__dirname, '/result/')
}
const checker = require('./lib/tester')(config)
const requester = require('./lib/requester')
let page = 1
let done = 0
let limit = 0
let args = process.argv.slice(2)
if (args.length > 0) {
    if (args[0] === '--help') {
        printUsage()
        process.exit()
    } else if (!isNaN(args[0])) {
        limit = args[0]
        if (args.length > 1) {
            requester.setToken(args[1])
        }
    }


    while (done < limit) {
        if (done > 0) {
            page++
        }
        console.log('page : ' + page)
        requester.searchRepo('javascript', page, (result) => {
            if (result.total_count === undefined) {
                if (result.message !== undefined) {
                    console.log(result.message)
                } else {
                    console.log('unexpected error. please try again')
                }
                process.exit()
            } else {
                for (let i in result.items) {
                    //verification si package.json exite dans le repo
                    checker.existPackageJson(result.items[i], 'package.json', (resultat, repo) => {
                        if (config.DEBUG) {
                            console.log('current repo : ' + repo.full_name)
                            console.log('exist JSONfile : ' + resultat)
                        }
                        if (resultat) { //recuperation du fichier Package.json
                            checker.getPackageJSON(repo, (packageJson, repo) => {
                                //si le fichier contient les champs
                                checker.existField(packageJson, 'description', repo)
                                checker.existField(packageJson, 'license', repo)
                                checker.existField(packageJson, 'repository', repo)
                                checker.exisEsLint(packageJson, repo)
                            })
                            // verif des badges
                            checker.getReadme(repo, (res, repo) => {
                                checker.testString(repo, res, '[![NPM version]')
                                checker.testString(repo, res, '[![Dependency Status]')
                                checker.testString(repo, res, '[![devDependency Status]')
                            })
                        }

                    })
                }
            }
        })
        done += 100
    }
    console.log('Results are to be written in ' + config.root_dir_path)
} else {
    printUsage()
}


function printUsage() {
    console.log('usage :\n\
\t node npm-repolint limit [Oauth-token]\n\n\
limit :\t\t Number of repositories to be processed\n\
Oauth-token :\t Your personal API token (see https://github.com/blog/1509-personal-api-tokens)')
}
