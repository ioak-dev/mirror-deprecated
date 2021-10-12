# mirror

## to have a parent application connect to mirror in local development environment

mirror: npm link
parent: npm link mirror
mirror: npm link ..\oneauth\node_modules\react
mirror: npm link ..\oneauth\node_modules\react-router
