module.exports = {
    "roots": [
      "<rootDir>/src"
    ],
    "transform": {
        ".(ts|tsx)": "ts-jest"
      },
      "testRegex": "(.*\\.(test|spec))\\.(ts|tsx)$",
      "moduleFileExtensions": ["ts", "tsx", "js"]
  }