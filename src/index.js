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

function plugin({ types: t }) {
  return {
    name: "console-wrapper",
    visitor: {
      CallExpression(path) {
        if (isConsole(path)) {
          console.log("file", path.hub.file.opts.filename);
          // console.dir(path);
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
