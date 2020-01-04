import * as _foooo7 from '../foo';
import _foooo5, { _foooo6 } from '../foo';
import _foooo8 from '../../foooo';
const _foooo4 = 4;

function foo() {
    let _foooo = 1;

    _foooo8(_foooo, {
        line: 7,
        column: 4,
        filePath: './src/__tests__/fixtures/conflicting-identifiers/code.js'
    });
}

function foo1() {
    let _foooo3 = 3;

    function inner_foo() {
        let _foooo2 = 2;

        _foooo8(_foooo2, {
            line: 15,
            column: 8,
            filePath: './src/__tests__/fixtures/conflicting-identifiers/code.js'
        });

        _foooo8(_foooo5, {
            line: 16,
            column: 8,
            filePath: './src/__tests__/fixtures/conflicting-identifiers/code.js'
        });
    }
}
