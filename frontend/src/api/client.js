const TOKEN_KEY = 'amazone_token'

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token)
  else localStorage.removeItem(TOKEN_KEY)
}

export async function api(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  }
  const token = getToken()
  if (token) headers.Authorization = `Token ${token}`

  const res = await fetch(`/api${path}`, {
    ...options,
    headers,
  })

  const text = await res.text()
  let data = null
  if (text) {
    try {
      data = JSON.parse(text)
    } catch {
      data = { detail: text }
    }
  }

  if (!res.ok) {
    const err = new Error(data?.detail || res.statusText || 'Request failed')
    err.status = res.status
    err.data = data
    throw err
  }
  return data
}
