# THOTH

Thoth is a multishot system builder. It leverages a visual coding style interface to allows game designers and developers to rapidly create powerful natural language systems and prototype games.

## Setup


1. Generate a [Personal Access Token](https://github.com/settings/tokens) on Github which will allow you to install private latitude packages. Make sure you check the `write:packages` option. (`read:packages` will suffice as well if you aren't planning on publishing new versions of @latitudegames/thoth-core)
1. In your `~/.bashrc`, append the line `export NPM_TOKEN=YourTokenGoesHere`, and restart your terminal (you can run `source ~/.bashrc` to do so)
1. Clone the repository
1. Navigate to the project root by running `cd thoth`
1. Run `yarn install` to install project dependencies
1. Run `yarn start` to start the @thoth/client app


## Monorepo Development

Within the yarn workspace we need to be mindful of which version of the shared package @latitudegames/thoth-core we are including in our local development setup and our deploys to Netlify.

We can either:

1. Target a published version of [@latitudegames/thoth-core](https://github.com/latitudegames/thoth/packages/983711)
2. Or actively develop against the current state of the repository. (By ensuring that client/package.json is targetting the same version of @latitudegames/thoth-core that is currently listed in core/package.json)

These two methods of compiling the application can be used for either local development or deployment, and require a separate configuration for [CRACO](https://github.com/gsoft-inc/craco). 

These two distinct code blocks are in `client/craco.config.js` with further instructions as to their use. 

**It is important to note that:**  `only one of the two configuration code blocks can be uncommented at a time for the build to be valid.` We hope to streamline this further soon.

## Publishing @latitudegames/thoth-core

In order to support code sharing with the Latitude API, any changes we make to the `core` directory need to be periodically published to GitHub Packages once tested and considered stable for use.

Assuming your `NPM_TOKEN` is configured with `write:packages` permissions as described in the setup section above:

1. Ensure the version in `core/package.json` is at least one minor version higher than the [last published version](https://github.com/latitudegames/thoth/packages/983711)
2. run `cd core`
3. run `npm publish`
4. If the package is published successfully, increment the version in `core/package.json` at least one minor version and commit the changes


## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs @thoth/client in the development mode.\
Open [http://localhost:3001](http://localhost:3001) to view it in the browser.

### `yarn build`

Builds the @thoth/client app for production to the `client/build` folder.

### `yarn build:core`

Builds the @thoth/core package for production to the `core/build` folder.

