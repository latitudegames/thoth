///////// REQUIRED FOR LOCAL DEPLOYMENT (if you are referencing unpublished changes from the @latitudegames/thoth-core directory*):
///////// *You can also deploy to Netlify with these config settings, if your current local @latitudegames/thoth-core version matches the client dependency target in client/package.json
///////// in which case the deployment will use the code in this repository at build time, and not what has been published to GitHub packages

///////// Monorepo Symlink Config:

// const path = require("path");
// const { getLoader, loaderByName } = require("@craco/craco");

// const packages = [];
// packages.push(path.join(__dirname, "../core"));
// module.exports = {
//   webpack: {
//     configure: (webpackConfig, arg) => {
//       const { isFound, match } = getLoader(
//         webpackConfig,
//         loaderByName("babel-loader")
//       );
//       if (isFound) {
//         const include = Array.isArray(match.loader.include)
//           ? match.loader.include
//           : [match.loader.include];

//         match.loader.include = include.concat(packages);
//       }
//       return webpackConfig;
//     },
//   },
// };



///////// REQUIRED FOR NETLIFY DEPLOYMENT (If you are referencing publised versions of @latitudegames/thoth-core )
///////// https://github.com/latitudegames/thoth/packages/983711

///////// Client Build With Github Package Config:

const path = require("path");
const { getLoaders, removeLoaders, addAfterLoader, loaderByName, throwUnexpectedConfigError } = require("@craco/craco");

const packages = [];
packages.push(path.join(__dirname, "../core"));

const throwError = (message) =>
  throwUnexpectedConfigError({
    packageName: 'craco',
    githubRepo: 'gsoft-inc/craco',
    message,
    githubIssueQuery: 'webpack',
  });

module.exports = {
  babel: {
    presets: ["@babel/preset-react","@babel/preset-typescript"],
    plugins: ["babel-plugin-transform-class-properties"]
  },
  webpack: {
    configure: (webpackConfig, { paths }) => {
      const { hasFoundAny, matches } = getLoaders(webpackConfig, loaderByName('babel-loader'));
      if (!hasFoundAny) throwError('failed to find babel-loader');

      console.log('removing babel-loader');
      const { hasRemovedAny, removedCount } = removeLoaders(webpackConfig, loaderByName('babel-loader'));
      if (!hasRemovedAny) throwError('no babel-loader to remove');
      if (removedCount !== 2) throwError('had expected to remove 2 babel loader instances');

      console.log('adding ts-loader');

      const tsLoader = {
        test: /\.(js|mjs|jsx|ts|tsx)$/,
        include: paths.appSrc,
        loader: require.resolve('ts-loader'),
        options: { transpileOnly: true },
      };

      const { isAdded: tsLoaderIsAdded } = addAfterLoader(webpackConfig, loaderByName('url-loader'), tsLoader);
      if (!tsLoaderIsAdded) throwError('failed to add ts-loader');
      console.log('added ts-loader');

      console.log('adding non-application JS babel-loader back');
      const { isAdded: babelLoaderIsAdded } = addAfterLoader(
        webpackConfig,
        loaderByName('ts-loader'),
        matches[1].loader // babel-loader
      );
      if (!babelLoaderIsAdded) throwError('failed to add back babel-loader for non-application JS');
      console.log('added non-application JS babel-loader back');

        // ts-loader is required to reference external typescript projects/files (non-transpiled)
        webpackConfig.module.rules.push({
          test: /\.ts?$/,
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
            configFile: 'tsconfig.json',
          },
        })

      return webpackConfig;
    },
  },
};


