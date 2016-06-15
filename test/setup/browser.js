const mochaGlobals = require('./.globals.json').globals;
const setup = require('./setup');

window.mocha.setup('bdd');
window.onload = function onload() {
  window.mocha.checkLeaks();
  window.mocha.globals(Object.keys(mochaGlobals));
  window.mocha.run();
  setup(window);
};
