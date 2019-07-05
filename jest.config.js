module.exports = {
    "roots": [
      "<rootDir>/src",
      "<rootDir>/test"
    ],
    "transform": {
        ".(ts|tsx)": "ts-jest"
      },
      "testRegex": "(/src/workout/power/.*|\\.(test|spec))\\.(ts|tsx)$",
      "moduleFileExtensions": ["ts", "tsx", "js"]
  }