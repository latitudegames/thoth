export const latitudeApiRootUrl =
  process.env.NODE_ENV === 'production'
    ? (process.env.REACT_APP_LAPI_ROOT_URL_PROD as string)
    : (process.env.REACT_APP_LAPI_ROOT_URL as string)

export const redirectUri =
  process.env.NODE_ENV === 'production'
    ? (process.env.REACT_APP_SITE_ROOT_URL_PROD as string)
    : (process.env.REACT_APP_SITE_ROOT_URL as string)

export const oAuthClientId = process.env.REACT_APP_OAUTH_CLIENT_ID

export const appRootUrl =
  process.env.NODE_ENV === 'production'
    ? window.location.origin.includes('deploy-preview')
      ? 'https://deploy-preview-148--optimistic-turing-def916.netlify.app/'
      : process.env.REACT_APP_SITE_ROOT_URL_PROD
    : process.env.REACT_APP_SITE_ROOT_URL
