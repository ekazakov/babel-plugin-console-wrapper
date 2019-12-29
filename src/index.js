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
          links.forEach(callPath => {
            const args = cloneArguments(callPath.get("arguments"));
            const id = path.scope.generateUidIdentifier("foooo");
            const call = t.callExpression(id, args);
            callPath.replaceWith(call);
          });

          if (links.size > 0) {
            const declaration = t.importDeclaration(
              [t.importDefaultSpecifier(t.identifier("foooo"))],
              t.stringLiteral("../../foooo")
            );
            path.unshiftContainer("body", declaration);
          }
        }
      },

      CallExpression(path) {
        if (isConsole(path)) {
          links.add(path);

          // const args = cloneArguments(path.get("arguments"));
          // const call = t.callExpression(t.identifier("foooo"), args);
          // path.replaceWith(call);
          // console.log('has biding for "fooo"', path.scope.hasBinding("fooo"));
          // console.log('has biding for "dooo"', path.scope.hasBinding("dooo"));
          // console.log('has biding for "bar"', path.scope.hasBinding("bar"));
        }
      }

      // FunctionDeclaration: {
      //   enter(path) {
      //     path
      //       .get("body")
      //       .unshiftContainer(
      //         "body",
      //         t.callExpression(
      //           t.memberExpression(
      //             t.identifier("console"),
      //             t.identifier("time")
      //           ),
      //           [t.stringLiteral(path.node.id.name)]
      //         )
      //       );
      //   }
      // }
    }
  };
}

module.exports = plugin;
