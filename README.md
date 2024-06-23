# Server Chassis: TypeScript + Node.js + Express.js + MongoDB + Redis + Mocha

Chassis for a REST API using TypeScript, Node.js, Express.js, MongoDB and Redis. Tests are run using Mocha.

## Requirements

- `node` v22.1.0
- `npm` v10.7.0
- MongoDB running locally

## Basic Usage

- use `node --run start:dev` to run the service in development mode (with `NODE_ENV=dev`).
- use `node --run nodemon` to run the service in development mode (with `NODE_ENV=dev`) using nodemon.
- use `node --run lint` for code linting.
- use `node --run test` for executing tests.

I also recommend to use `ncu` to find outdated dependencies (and run `ncu -u` to upgrade `package.json`).

App is launched listening on ***8080*** port by default, set the environment variable ***PORT*** to change it.

## Content Description

### src/

This folder contains the app source code:

- `server.js`: functions to start (and stop) app environment: load environment variables, bootstrap app services, set middlewares and when done, init express
- `middlewares`: middlewares to be added to express (i.e. cache, authentication, async error and custom error handlers)
- `routes`: routes definition
- `controllers`: mvc controllers
- `services`: application services
- `models`: app models (i.e. mongoose models)
- `dtos`: schemas to validate data received with joi

### test/

This folder contains the tests (and the `_setup.js` file to start app environment because it's not automatically started when importing `server.js` in test files).

## Environment variables

This project depends on some environment variables (from `.env.[environment]` files):

- `MONGODB_URI`: MongoDB connection URI used to connect to a MongoDB database server. This environment variable is not needed in test environment (in `env.test` file) because in this environment an in-memory MongoDB instance (using `mongodb-memory-server`) is started in order to use it during testing and automatically shut down when testing is complete.
- `REDIS_URI`: Redis connection URI used to store cached data returned by the API endpoints.
- `JWT_SECRET`: The secret to [sign and verify JWTs](https://www.npmjs.com/package/jsonwebtoken).
- `UUID_NAMESPACE`: Namespace for auto-generating UUIDs to use as [JWT](https://en.wikipedia.org/wiki/JSON_Web_Token)'s JTI.

## How was this chassis created?

### Setup steps

1. Create a `package.json` file using `npm init`. Add Node.js and npm versions used:

    ```json
    "engines": {
      "node": ">=22.1.0",
      "npm": ">=10.7.0"
    }
    ```

    Also add `"type": "module"` in order to use `import` ([ECMAScript modules](https://nodejs.org/api/esm.html)) instead of `require` ([CommonJS modules](https://nodejs.org/api/modules.html)).
2. Install express and mongoose: `npm install express mongoose`. Install also ioredis for caching purposes, and jsonwebtoken and uuid to create an authentication middleware for securing endpoints: `npm install ioredis jsonwebtoken uuid`.
3. Install dev dependencies such as testing ones (supertest, c8, mocha, chai), linter (eslint, eslint-plugin-json-format) and nodemon:
    - `npm install --save-dev supertest c8 mocha chai`
    - `npm install --save-dev eslint eslint-plugin-json-format`
    - `npm install --save-dev nodemon`
4. Configure eslint: `npx eslint --init`.
5. Check the eslint configuration, `.eslintrc.json` file should have:

    ```json
    "env": {
      "node": true,
      "es2021": true,
      "mocha": true
    }
    ```

    Also add `json-format` plugin (the one installed with the dependency `eslint-plugin-json-format`)

    ```json
    "plugins": [
      "json-format"
    ]
    ```

    Add `.eslintignore` file.

6. Create Mocha configuration file `.mocharc.json`. With `exit: true` the server is stopped after executing tests (without the need to click Ctrl+C).
7. Create test coverage configuration file `.c8rc.json`. The params set will be needed for the tests to pass successfully.
8. Create nodemon configuration file `nodemon.json` including the files that should be ignored when being updated.
9. Create npm configuration file `.npmrc` with `engine-strict=true` in order to notify with an error alert when trying to install/test/start something without the correct Node.js and npm versions.
10. Initialize git repository: `git init`. Add `.gitignore` file.
11. Install [Husky](https://typicode.github.io/husky/how-to.html) to execute linter fixes and check tests before a commit is created or pushed: `npm install --save-dev husky`. Install husky git hooks (only once): `npx husky init` and add it to `package.json` script called `prepare`. If you want to make a commit skipping husky pre-commit git hooks you can use `git commit -m "..." -n`; the same occurs when you want to skip pre-push hooks: `git push --no-verify`.
12. Install `lint-staged` to check linting only in staged files before making a commit: `npm install --save-dev lint-staged`. Add configuration file `.lintstagedrc`.
13. Install [CommitLint](https://github.com/conventional-changelog/commitlint) dev dependencies to apply Conventional Commits: `npm install --save-dev @commitlint/cli @commitlint/config-conventional` and create its configuration file `.commitlintrc.json`:

    ```json
    {
      "extends": [
        "@commitlint/config-conventional"
      ]
    }
    ```

14. Add `pre-commit`, `pre-push` and `pre-commit-msg` scripts to be run with husky git hooks:

    ```json
    "pre-commit": "npx lint-staged",
    "pre-commit-msg": "npx --no -- commitlint --edit ${1}",
    "pre-push": "npx NODE_ENV=test c8 --all mocha",
    ```

15. Create `.husky/pre-commit` file to insert command that should be executed before making a commit. This file looks like this:

    ```bash
    node --run pre-commit
    ```

16. Create `.husky/pre-commit-msg` file to insert command that should be executed to check the commit message. This file looks like this:

    ```bash
    node --run pre-commit-msg
    ```

17. Create `.husky/pre-push` file to insert command that should be executed before pushing a commit. This file looks like this:

    ```bash
    node --run pre-push
    ```

    If tests fail, commit won't be pushed.

### Development steps

1. Create `index.js`, `src/server.js` and the necessary middlewares for authentication, caching and error handling.
2. Add routes folder and `routes.js`. Add routing middleware in `server.js`: `app.use("/", routes);`. Document routes with [OpenAPI Specification](https://spec.openapis.org/oas/latest.html).
3. Add controllers folder and `controller.js`.
4. Add services folder and `service.js` file.
5. Add mongoose models in folder models.
6. Add `Dockerfile` and `.dockerignore`. After that, you can create de docker image and run the docker container with the following commands:

    ```bash
    docker build -t [IMAGE_NAME] .
    docker run --name [CONTAINER_NAME] -p 8080:8080 -t -d [IMAGE_NAME]
    ```

7. Configure GitHub Action in `.github/workflows/main.yaml`. This action executes linter and tests and reads the [GitHub secrets](https://docs.github.com/en/actions/security-guides/using-secrets-in-github-actions#creating-secrets-for-a-repository) of the repository to fill the .env file with the secret called `ENV_FILE` and use the `GITHUB_TOKEN` secret to build and push a Docker image to [GitHub Packages](https://github.com/features/packages).

8. Migrate project to TypeScript:

    8.1. Install needed dev-dependencies: `npm install typescript tsx @types/node @types/express @types/cors @types/cookie-parser @types/mocha @types/chai @types/supertest --save-dev`.

    8.2. Add build script to `package.json`: `"build": "npx tsc"`

    8.3. Initialize TypeScript configuration file `tsconfig.json` by running `node --run build -- --init`.

    8.4. Migrate `.js` files to `.ts`.

    8.5. Use TypeScript in your database models [to define both a document interface and a schema or rely on Mongoose to automatically infer the type from the schema definition](https://mongoosejs.com/docs/typescript/schemas.html).

    8.6. Configure eslint: `npm install @typescript-eslint/eslint-plugin @typescript-eslint/parser --save-dev`.

    ```json
    "extends": [
      "eslint:recommended",
      "plugin:@typescript-eslint/recommended"
    ],
    "parser": "@typescript-eslint/parser",
    "plugins": [
      "@typescript-eslint",
      "json-format"
    ],
    ```
