# npm-repolint

[![NPM version](http://img.shields.io/npm/v/repolint.svg)](https://www.npmjs.org/package/repolint)

usage :
    node src/index.js limit [Oauth-token]

limit :		 Number of repositories to be processed
Oauth-token :	 Your personal API token (see https://github.com/blog/1509-personal-api-tokens)

#### Oauth-token
Token needed for authenticated API requests
Github API request are limited to 30 for unauthenticated requests
so this application will only compute 15 repositories if no token is provided

###### Todo
Improve the precision of the limit
