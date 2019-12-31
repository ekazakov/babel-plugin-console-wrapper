const t = require("babel-types");
const { map } = require("lodash");
const { looksLike } = require("./utils/index");

const isConsole = looksLike({
  node: {
    callee: {
      type: "MemberExpression",
      object: {
        name: "console"
      },
      property: {
        name: "log"
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
    name: "console-wrapper",
    visitor: {
      /*
     TODO:
     - Check for scope conflicts and generate unique identifier
     - Add import only if required
     */
      Program: {
        enter(path) {
          links.clear();
        },
        exit(path) {
          console.log("bindings:", Object.keys(bindings));
          let id = path.scope.generateUidIdentifier("foooo");
          while (id.name in bindings) {
            id = path.scope.generateUidIdentifier("foooo");
          }
          console.log("Final id:", id);
          links.forEach(callPath => {
            const args = cloneArguments(callPath.get("arguments"));
            // const id = path.scope.generateUidIdentifier("foooo");
            const call = t.callExpression(id, args);
            callPath.replaceWith(call);
          });

          // if (links.size > 0) {
          //   const declaration = t.importDeclaration(
          //     [t.importDefaultSpecifier(t.identifier("foooo"))],
          //     t.stringLiteral("../../foooo")
          //   );
          //   path.unshiftContainer("body", declaration);
          // }
        }
      },

      CallExpression(path) {
        if (isConsole(path)) {
          links.add(path);
          Object.assign(bindings, { ...path.scope.getAllBindings() });
          // console.log("bindings:", Object.keys(path.scope.getAllBindings()));
          // console.log('has biding for "_foooo7"', path.scope.hasBinding("_foooo7"));
          // console.log('has biding for "_foooo6"', path.scope.hasBinding("_foooo6"));
          // console.log('has biding for "_foooo5"', path.scope.hasBinding("_foooo5"));
        }
      }
    }
  };
}

module.exports = plugin;
