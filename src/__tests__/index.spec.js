const path = require("path");
const pluginTester = require("babel-plugin-tester").default;
const plugin = require("../index");

pluginTester({
  plugin,
  snapshot: true,
  tests: {
    "test one": {
      // skip: true,
      fixture: path.join(__dirname, "fixtures/test-one/code.js")
    },
    "test two": {
      fixture: path.join(__dirname, "fixtures/two/code.js")
    },
    "test three": {
      // only: true,
      fixture: path.join(__dirname, "fixtures/no-console-calls/code.js")
    },
    "test four": {
      snapshot: false,
      only: true,
      fixture: path.join(__dirname, "fixtures/conflicting-identifiers/code.js"),
      fixtureOutput: path.join(
        __dirname,
        "fixtures/conflicting-identifiers/output.js"
      )
    }
  }
});
