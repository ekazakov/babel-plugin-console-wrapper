const path = require('path');
const pluginTester = require('babel-plugin-tester').default;
const plugin = require('../index');

pluginTester({
    plugin,
    snapshot: false,
    tests: {
        // "test one": {
        //   fixture: path.join(__dirname, "fixtures/test-one/code.js")
        // },
        // "test two": {
        //   fixture: path.join(__dirname, "fixtures/two/code.js")
        // },
        // "test three": {
        //   fixture: path.join(__dirname, "fixtures/no-console-calls/code.js")
        // },
        'conflicting identifiers': {
            snapshot: false,
            // only: true,
            pluginOptions: {
                wrapperImportPath: '../foo/bar/baz'
            },
            fixture: path.join(__dirname, 'fixtures/conflicting-identifiers/code.js'),
            outputFixture: path.join(
                __dirname,
                'fixtures/conflicting-identifiers/output.js'
            )
        }
    }
});
