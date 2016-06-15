/* eslint-disable */

module.exports = function(root) {
  root = root ? root : global;
  root.expect = root.chai.expect;
};
