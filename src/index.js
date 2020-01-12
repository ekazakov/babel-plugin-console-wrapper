const t = require('babel-types');
const { map, findLast, isNumber, head, get } = require('lodash');
const pathModule = require('path');
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

function assertOption(opts, name) {
    if (!get(opts, name)) {
        throw Error(`babel-plugin-console-wrapper: '${name}' option is not specified`);
    }
}

function plugin() {
    return {
        name: 'console-wrapper',
        visitor: {
            Program: {
                enter(path) {
                    links.clear();
                },
                exit(path, state) {
                    assertOption(state.opts, 'fnName');
                    assertOption(state.opts, 'fnImportPath');
                    assertOption(state.opts, 'srcRoot');

                    const { fnName, fnImportPath, srcRoot } = state.opts;

                    const { filename, root } = path.hub.file.opts;
                    const filePath = filename.replace(root, '.');
                    // console.log('filePath:', filePath);
                    let id = path.scope.generateUid(fnName);
                    while (id.name in bindings) {
                        id = path.scope.generateUid(fnName);
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
                        const importPath = pathModule.join(
                            srcRoot,
                            pathModule.relative(filePath, fnImportPath)
                        );
                        const declaration = t.importDeclaration(
                            [t.importDefaultSpecifier(t.identifier(id))],
                            t.stringLiteral(importPath)
                        );
                        const body = path.get('body');
                        const lastImportPath = findLast(body, {
                            type: 'ImportDeclaration'
                        });
                        if (lastImportPath) {
                            lastImportPath.insertAfter(declaration);
                        } else {
                            head(body).insertBefore(declaration);
                        }
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
