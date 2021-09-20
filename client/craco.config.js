const path = require("path");
const {
  getLoaders,
  removeLoaders,
  addAfterLoader,
  loaderByName,
  throwUnexpectedConfigError,
} = require("@craco/craco");

const packages = [];
packages.push(path.join(__dirname, "../core"));

const throwError = (message) =>
  throwUnexpectedConfigError({
    packageName: "craco",
    githubRepo: "gsoft-inc/craco",
    message,
    githubIssueQuery: "webpack",
  });

module.exports = {
  babel: {
    presets: ["@babel/preset-react", "@babel/preset-typescript"],
    plugins: ["babel-plugin-transform-class-properties"],
  },
  webpack: {
    configure: (webpackConfig, { paths }) => {
      const { hasFoundAny, matches } = getLoaders(
        webpackConfig,
        loaderByName("babel-loader")
      );
      if (!hasFoundAny) throwError("failed to find babel-loader");

      console.log("removing babel-loader");
      const { hasRemovedAny, removedCount } = removeLoaders(
        webpackConfig,
        loaderByName("babel-loader")
      );
      if (!hasRemovedAny) throwError("no babel-loader to remove");
      if (removedCount !== 2)
        throwError("had expected to remove 2 babel loader instances");

      console.log("adding ts-loader");

      const tsLoader = {
        test: /\.(js|mjs|jsx|ts|tsx)$/,
        include: paths.appSrc,
        loader: require.resolve("ts-loader"),
        options: { transpileOnly: true },
      };

      const { isAdded: tsLoaderIsAdded } = addAfterLoader(
        webpackConfig,
        loaderByName("url-loader"),
        tsLoader
      );
      if (!tsLoaderIsAdded) throwError("failed to add ts-loader");
      console.log("added ts-loader");

      // Disable symlink for netlify deploy to encourage only using published packages for deployed clients
      const include = Array.isArray(matches[1].loader.include)
        ? matches[1].loader.include
        : [matches[1].loaderinclude];

      matches[1].loader.loader.include = include.concat(packages);

      console.log("adding non-application JS babel-loader back");
      const { isAdded: babelLoaderIsAdded } = addAfterLoader(
        webpackConfig,
        loaderByName("ts-loader"),
        matches[1].loader // babel-loader
      );

      if (!babelLoaderIsAdded)
        throwError("failed to add back babel-loader for non-application JS");
      console.log("added non-application JS babel-loader back");

      // ts-loader is required to reference external typescript projects/files (non-transpiled)
      webpackConfig.module.rules.push({
        test: /\.ts?$/,
        loader: "ts-loader",
        options: {
          transpileOnly: true,
          configFile: "tsconfig.json",
        },
      });

      return webpackConfig;
    },
  },
};
