module.exports = {
    "roots": [
      "<rootDir>/src",
      "<rootDir>/test"
    ],
    "transform": {
        ".(ts|tsx)": "ts-jest"
      },
      "testRegex": "(/test/.*|\\.(test|spec))\\.(ts|tsx)$",
      "moduleFileExtensions": ["ts", "tsx", "js"]
  }