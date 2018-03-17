# npm-repolint

[![NPM version](http://img.shields.io/npm/v/repolint.svg)](https://www.npmjs.org/package/repolint)

## Project Objectives:

This program generates a quality report on several NPM package projects.
It uses the GitHub API to find those projects which do not have:

* a description in their **package.json** file

* a license in their **package.json** file

* a **LICENSE** file at the root of the project

* a **.editorconfig** file at the root of the project

* a **repository** field in the **package.json** file

* a NPM badge in the **README.md** file

* a badge dependencies in the **README.md** file

* a devDependencies badge in the **README.md** file

* an ESLint test

## List of parameters

* usage :
    ```javascript
    node src/index.js limit [Oauth-token]
    ```
* limit :         Number of repositories to be processed
* Oauth-token :     Your personal API token (see       https://github.com/blog/1509-personal-api-tokens)

### Oauth-token

Token needed for authenticated API requests
Github API request are limited to 30 for unauthenticated requests
so this application will only compute 15 repositories if no token is provided

## Todo

Improve the precision of the limit
