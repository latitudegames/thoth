# THOTH

Thoth is a multishot system builder. It leverages a visual coding style interface to allows game designers and developers to rapidly create powerful natural language systems and prototype games.

## Client Setup

1. Generate a [Personal Access Token](https://github.com/settings/tokens) on Github which will allow you to install private latitude packages. Make sure you check the `write:packages` option. (`read:packages` will suffice as well if you aren't planning on publishing new versions of @latitudegames/thoth-core)
1. In your `~/.bashrc`, append the line `export NPM_TOKEN=YourTokenGoesHere`, and restart your terminal (you can run `source ~/.bashrc` to do so)
1. Clone the repository
1. Navigate to the project root by running `cd thoth`
1. Run `yarn install` to install project dependencies
1. Run `yarn start` to start the @latitudegames/thoth-client app

## Core Local Setup

1. Core the contents of `core/.env.default` to `core/.env` and modify the secrets as necessary
1. Step 2 in Monorepo Development Setup

## Monorepo Development

Within the yarn workspace we need to be mindful of which version of the shared package @latitudegames/thoth-core we are including in our local development setup and our deploys to Netlify.

You can either:

1. Target a published version of [@latitudegames/thoth-core](https://github.com/latitudegames/thoth/packages/983711) in client/package.json
2. Or actively develop against the current state of the repository. (By ensuring that client/package.json is targetting the same version of @latitudegames/thoth-core that is currently listed in core/package.json)

If you are testing with the Latitude API you can point the latitude api to your local thoth package by making the dependance `"@latitudegames/thoth-core": "../thoth/core",`

## @latitudegames/thoth-core CI

### Testing

On Pull Request, GitHub actions will first determine if the diff contains changes in the `core` directory. If so
and there isn't an active `thoth-core` labelled PR already open - it will proceed with building and deploying a Canary Release
to GitHub packages. There can only be one `thoth-core` labelled PR active at a time, so if one exists additional PR's will be labelled `thoth-core-draft` by the CI. This `thoth-core-draft` label can be removed, and the CI re-run to build a canary once the unique `thoth-core` label position has been vacated.

The latest canary release can be tested and installed locally with `yarn add @latitudegames/thoth-core@canary`. The Netlify Deploy Preview is configured to sense `thoth-core` PR's as well and targets the latest canary release, but it runs concurrently to the canary publishing process. You can test a canary release of `thoth-core` on your branch's Deploy Preview by re-deploying from the Netlify UI for your branch. It is important to note that `thoth-core-draft` PR's will still have a deploy preview on Netlify, but will be building with the latest canary release of `thoth-core` which may be unrelated to that PR's changes until it had it's own canary release and been re-deployed.

### Releases

When a `thoth-core` PR has been merged with main, the CI will create a prerelease based on the last commit, publish
@latitudegames/thoth-core to GitHub packages and take care of incrementing the patch version in core/package.json to prepare
for the next prerelease.

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs @latitudegames/thoth-client in the development mode.\
Open [http://localhost:3001](http://localhost:3001) to view it in the browser.

### `yarn build`

Builds the @latitudegames/thoth-client app for production to the `client/build` folder.

### `yarn build:core`

Builds the @thoth/core package for production to the `core/build` folder.

## Apache license information

Good example here for formatting apache license files for reference.
https://www.openntf.org/Internal/home.nsf/dx/Applying_Apache_License
