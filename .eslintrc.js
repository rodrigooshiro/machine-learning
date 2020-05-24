module.exports = {
  "root": true,
  "env": {
    "browser": true
  },
  "extends": [ "standard" ],
  "plugins": [ "html", "promise", "standard" ],
  "parser": "babel-eslint",
  "parserOptions": {
    "parser": "babel-eslint",
    "sourceType": "module"
  },
  "rules": {
    "space-before-function-paren": 0,
    "arrow-parens": 0,
    "generator-star-spacing": 0
  }
}

