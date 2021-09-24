module.exports = {
  onPreBuild: ({ utils: { netlifyConfig, git } }) => {
    console.log('conditional-canary plugin')
    const coreChanges = git.fileMatch('core/**/*')
    const coreChanged = coreChanges.edited.length !== 0
    const installCanary = 'yarn add @latitudegames/thoth-core@canary'
    netlifyConfig.build.command = coreChanged
      ? `${installCanary} && ${netlifyConfig.build.command}`
      : netlifyConfig.build.command
  },
}
