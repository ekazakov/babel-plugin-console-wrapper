const _fooo4 = 4;

function foo() {
  let _fooo = 1;
  console.log(_fooo);
}

function foo1() {
  let _fooo3 = 3;

  function inner_foo() {
    let _fooo2 = 2;
    console.log(_fooo2);
  }
}
