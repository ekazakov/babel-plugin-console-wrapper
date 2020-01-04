const t = require('babel-types');
const { map, findLast, isNumber } = require('lodash');
const { looksLike } = require('./utils/index');

const isConsole = looksLike({
    node: {
        callee: {
            type: 'MemberExpression',
            object: {
                name: 'console'
            },
            property: {
                name: 'log'
            }
        }
    }
});

const cloneArguments = args => {
    return map(args, path => path.node);
};

const links = new Set();
const bindings = {};

function plugin() {
    return {
        name: 'console-wrapper',
        visitor: {
            /*
     TODO:
     */
            Program: {
                enter(path) {
                    links.clear();
                },
                exit(path) {
                    const { filename, root } = path.hub.file.opts;
                    const filePath = filename.replace(root, '.');
                    // console.log('filePath:', filePath);
                    let id = path.scope.generateUid('foooo');
                    while (id.name in bindings) {
                        id = path.scope.generateUid('foooo');
                    }

                    links.forEach(callPath => {
                        const args = cloneArguments(callPath.get('arguments'));
                        const obj = { ...callPath.node.loc.start, filePath };
                        const props = map(obj, (value, key) => {
                            return t.objectProperty(
                                t.identifier(key),
                                isNumber(value)
                                    ? t.numericLiteral(value)
                                    : t.stringLiteral(value)
                            );
                        });
                        const tmp = t.objectExpression(props);
                        args.push(tmp);
                        const call = t.callExpression(t.identifier(id), args);
                        callPath.replaceWith(call);
                    });

                    if (links.size > 0) {
                        const declaration = t.importDeclaration(
                            [t.importDefaultSpecifier(t.identifier(id))],
                            t.stringLiteral('../../foooo')
                        );
                        const body = path.get('body');
                        const lastImportPath = findLast(body, {
                            type: 'ImportDeclaration'
                        });
                        lastImportPath.insertAfter(declaration);
                    }
                }
            },

            CallExpression(path) {
                if (isConsole(path)) {
                    links.add(path);
                    Object.assign(bindings, { ...path.scope.getAllBindings() });
                }
            }
        }
    };
}

module.exports = plugin;
