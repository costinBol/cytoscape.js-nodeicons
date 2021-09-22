const NodeIcons = require('./nodeicons');
const assign = require('./assign');

module.exports = function( options ){
  let cy = this;

  return new NodeIcons( assign({ cy }, options) );
};
