module.exports = (cookieName) => {
  const matches = document.cookie.match('(^|;)\\s*' + cookieName + '\\s*=\\s*([^;]+)')
  return matches ? matches.pop() : ''
}
