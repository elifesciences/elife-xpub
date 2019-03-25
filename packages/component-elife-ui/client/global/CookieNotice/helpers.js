const getCookieValue = (cookieSought, cookies) => {
  let found = ''
  cookies.split('; ').forEach(cookie => {
    if (cookie.indexOf(cookieSought) === 0) {
      const re = new RegExp(`${cookieSought}=([^;]*)`)
      const cookieMatch = cookie.match(re)[1]
      found = decodeURIComponent(cookieMatch)
    }
  })

  return found
}

export default {
  getCookieValue,
}
