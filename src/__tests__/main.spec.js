const path = require('path');
const babel = require('babel-core');
const plugin = require('../');

const transform = (fixtureName, options = {}) => {
    const fixture = `./src/__tests__/fixtures/${fixtureName}`;
    const { code } = babel.transformFileSync(fixture, {
        plugins: [[plugin, options]]
    });

    return code;
};

describe('Babel plugin console wrapper', () => {
    it('should transform with options', () => {
        const code = transform('simple.js', {
            fnName: 'testWrapper',
            fnImportPath: 'src/foo/bar/testWrapper',
            srcRoot: 'src'
        });
        expect(code).toMatchSnapshot();
    });

    it.todo('shouldn`t change code if found nothing');

    it.todo('should throw error if `fnName` option is not specified');
    it.todo('should throw error if `fnImportPath` option is not specified');
});
