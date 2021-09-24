const url = process.env.REACT_APP_API_URL

export const login = async (email, password) => {
  const response = await fetch(url + `/auth/login.json`, {
    method: 'POST',
    mode: 'cors',
    body: JSON.stringify({
      usernameOrEmail: email,
      password: password,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  })

  const parsed = await response.json()

  return parsed
}
