const fs = require('fs');
const path = require('path');

exports.getLessTheme = function() {
  const pkgPath = path.resolve(__dirname, '../package.json')
  const pkg = fs.existsSync(pkgPath) ? require(pkgPath) : {}
  let theme = {}
  if (pkg.theme && typeof pkg.theme === 'string') {
    const cfgPath = path.resolve(pkg.theme)
    // relative path
    if (cfgPath.charAt(0) === '.') {
      cfgPath = path.resolve(__dirname, cfgPath)
    }
    const getThemeConfig = require(cfgPath)
    theme = getThemeConfig()
  } else if (pkg.theme && typeof pkg.theme === 'object') {
    theme = pkg.theme
  }
  return theme
}