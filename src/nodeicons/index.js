const defaults = require('./defaults');
const assign = require('../assign');
const setupPopper = require('./cypopper'); 
const {LOG_OPTIONS} = require("./logging");

function NodeIcons( options ){
  let cy = options.cy;

  this.cy = cy;
  this.listeners = [];

  this.options = assign( {}, defaults, options );

  LOG_OPTIONS.enabled = this.options.showLogs;
  
  this.preventDefault = e => e.preventDefault();
  this.setupPopper();
     
}

let proto = NodeIcons.prototype = {};
let extend = obj => assign( proto, obj );
 
proto.setOptions = function( options ){
  assign( this.options, options );
};
 
[
  setupPopper
].forEach( extend );

module.exports = NodeIcons;
