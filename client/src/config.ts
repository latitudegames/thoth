export const latitudeApiRootUrl =
  process.env.NODE_ENV === 'production'
    ? (process.env.REACT_APP_LAPI_ROOT_URL_PROD as string)
    : (process.env.REACT_APP_LAPI_ROOT_URL as string)

<<<<<<< HEAD
=======
export const thothApiRootUrl =
  process.env.NODE_ENV === 'production'
    ? (process.env.REACT_APP_API_ROOT_URL_PROD as string)
    : (process.env.REACT_APP_API_ROOT_URL as string)

>>>>>>> Downstream merge with main branch, fix some things
export const oAuthClientId = process.env.REACT_APP_OAUTH_CLIENT_ID

export const appRootUrl =
  process.env.NODE_ENV === 'production'
    ? process.env.REACT_APP_SITE_ROOT_URL_PROD
    : process.env.REACT_APP_SITE_ROOT_URL
<<<<<<< HEAD
=======

export const useLatitude = process.env.REACT_APP_USE_LATITUDE === 'true';
>>>>>>> Downstream merge with main branch, fix some things
