exports.generateAppId = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let appId

  for (let i = 0; i < 10; i++) {
    const position = Math.floor(Math.random() * characters.length - 1);
    appId += characters[position]
  }

  return appId
}
