module.exports = {
  onPreBuild: ({ netlifyConfig, utils: { git } }) => {
    netlifyConfig.build.command = `yarn add @latitudegames/thoth-core@canary && ${netlifyConfig.build.command}`
  },
}
