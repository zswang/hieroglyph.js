global.btoa = function (str) {
  return new Buffer(String(str)).toString('base64');
};
global.atob = function (base64) {
  return new Buffer(String(base64), 'base64').toString();
};

var assert = require('should');
/*<jdists encoding="ejs" data="package.json">
var <%- name %> = require('../.');
</jdists>*/
var util = require('util');

var printValue;
function print(value) {
  if (typeof printValue !== 'undefined') {
    throw new Error('Test case does not match.');
  }
  printValue = value;
}
global.print = print;

/*<remove>*/
  // <!--jdists encoding="glob" pattern="./src/*.js" export="#files" /-->
/*</remove>*/

/*<jdists encoding="jhtmls,regex" pattern="/~/g" replacement="--" data="#files" export="#example">*/
forEach(function (item) {
!#{'describe("' + item + '", function () {'}
  !#{'printValue = undefined;'}
  <!~jdists import="#{item}?example*" /~>
!#{'});'}
});
/*</jdists>*/

/*<jdists export="#replacer">*/
function (content) {
  content = content.replace(/^\s*\*\s*@example\s*(.*)$/mg,
    '  it("$1", function () {');
  content = content.replace(/^\s*```js\s*$/mg, '');
  content = content.replace(/\/\/ -?>\s*(.*)/gm, function (all, output) {
    return 'assert.equal(printValue, ' + JSON.stringify(output) + '); printValue = undefined;'
  });
  content = content.replace(/console\.log/g, 'print');
  content = content.replace(/^\s*```\s*$/mg,
    '  });');
  return content;
}
/*</jdists>*/
/*<jdists encoding="#replacer" import="#example"/>*/
