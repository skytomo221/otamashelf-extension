const config = {
  verbose: true,
  roots: ["<rootDir>/src"],
  moduleFileExtensions: ["js", "ts", "json"],
  transform: {
    "^.+\\.js$": "babel-jest",
    "^.+\\.ts$": "ts-jest",
  },
  transformIgnorePatterns: ["/node_modules/(?!n-gram).+\\.js"],
};

module.exports = config;
