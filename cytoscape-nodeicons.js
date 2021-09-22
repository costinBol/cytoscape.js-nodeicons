(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["cytoscapeNodeicons"] = factory();
	else
		root["cytoscapeNodeicons"] = factory();
})(self, function() {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/assign.js":
/*!***********************!*\
  !*** ./src/assign.js ***!
  \***********************/
/***/ ((module) => {



// Simple, internal Object.assign() polyfill for options objects etc.

module.exports = Object.assign != null ? Object.assign.bind(Object) : function (tgt) {
  for (var _len = arguments.length, srcs = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    srcs[_key - 1] = arguments[_key];
  }

  srcs.filter(function (src) {
    return src != null;
  }).forEach(function (src) {
    Object.keys(src).forEach(function (k) {
      return tgt[k] = src[k];
    });
  });

  return tgt;
};

/***/ }),

/***/ "./src/core.js":
/*!*********************!*\
  !*** ./src/core.js ***!
  \*********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var NodeIcons = __webpack_require__(/*! ./nodeicons */ "./src/nodeicons/index.js");
var assign = __webpack_require__(/*! ./assign */ "./src/assign.js");

module.exports = function (options) {
  var cy = this;

  return new NodeIcons(assign({ cy: cy }, options));
};

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var impl = __webpack_require__(/*! ./core */ "./src/core.js");

// registers the extension on a cytoscape lib ref
var register = function register(cytoscape) {
  if (!cytoscape) {
    return;
  } // can't register if cytoscape unspecified

  cytoscape('core', 'nodeicons', impl); // register with cytoscape.js
};

if (typeof cytoscape !== 'undefined') {
  // expose to global cytoscape (i.e. window.cytoscape)
  register(cytoscape); // eslint-disable-line no-undef
}

module.exports = register;

/***/ }),

/***/ "./src/nodeicons/cypopper.js":
/*!***********************************!*\
  !*** ./src/nodeicons/cypopper.js ***!
  \***********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var _require = __webpack_require__(/*! ./logging */ "./src/nodeicons/logging.js"),
    log = _require.log;

var popperEnabled = false;

function setupPopper() {
  var cy = this.cy,
      options = this.options;

  log("Seting up Popper", this);
  if (popperEnabled) {
    return;
  }

  popperEnabled = true;

  // example code for making your own handles -- customise events and presentation where fitting
  // var popper;
  var popperNode;
  var popper;
  var popperDiv;

  function setHandleOn(node) {

    if (node.classes().includes("eh-handle")) {
      // Don't add edit box for cytoscape-edgehandles handles
      return;
    }
    removeHandle(); // rm old handle

    var icons = node.data('icons');
    if (!icons || icons.length == 0) {
      log("Node with no icons in data");
      return;
    }
    popperNode = node;

    popperDiv = document.createElement('div');
    popperDiv.classList.add('cy-nodeicons-popper-handle');

    icons.forEach(function (icon) {
      var iconDiv = document.createElement('div');
      iconDiv.classList.add('cy-nodeicons-popper-nodeicon');
      if (icon.style) {
        iconDiv.style = icon.style;
      }
      iconDiv.innerHTML = icon.innerHTML;
      if (icon.tooltip) {
        iconDiv.title = icon.tooltip;
      }
      popperDiv.appendChild(iconDiv);
      iconDiv.addEventListener("click", function () {
        log("Clicked on: ", icon);
        if (icon.onclick) {
          icon.onclick();
        }
      });
    });

    document.body.appendChild(popperDiv);

    popper = node.popper({
      content: popperDiv,
      popper: {
        placement: options.iconsPlacement,
        interactive: true,
        modifiers: [{
          name: 'offset',
          options: {
            offset: [0, options.verticalOffset]
          }
        }]

      }
    });
  }

  function removeHandle() {
    if (popper) {
      popper.destroy();
      popper = null;
    }

    if (popperDiv) {
      document.body.removeChild(popperDiv);
      popperDiv = null;
    }

    popperNode = null;
  }

  cy.on('mouseover', 'node', function (e) {
    setHandleOn(e.target);
  });

  cy.on('grab', 'node', function () {
    removeHandle();
  });

  cy.on('tap', function (e) {
    console.log("cypopper - tap");
    if (e.target === cy) {
      removeHandle();
    }
  });

  cy.on('zoom pan', function () {
    removeHandle();
  });
  cy.on('mouseout', 'node', function (e) {
    removeHandle();
  });

  cy.on('tap', 'node', function (e) {
    console.log("cypopper - tap", e);
    setHandleOn(e.target);
  });

  cy.on('tapend', 'node', function (e) {
    console.log("cypopper - tapend");
    removeHandle();
  });
  return this;
}

module.exports = { setupPopper: setupPopper };

/***/ }),

/***/ "./src/nodeicons/defaults.js":
/*!***********************************!*\
  !*** ./src/nodeicons/defaults.js ***!
  \***********************************/
/***/ ((module) => {



/* eslint-disable no-unused-vars */
var defaults = {
  verticalOffset: 0,
  showLogs: false,
  alwaysOn: false,
  iconsPlacement: 'bottom',
  icons: [] // Sample: [{innerHTML: '<i class="fa fa-paperclip"/>', style: 'color:red'}, {}]
};
/* eslint-enable */

module.exports = defaults;

/***/ }),

/***/ "./src/nodeicons/index.js":
/*!********************************!*\
  !*** ./src/nodeicons/index.js ***!
  \********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var defaults = __webpack_require__(/*! ./defaults */ "./src/nodeicons/defaults.js");
var assign = __webpack_require__(/*! ../assign */ "./src/assign.js");
var setupPopper = __webpack_require__(/*! ./cypopper */ "./src/nodeicons/cypopper.js");

var _require = __webpack_require__(/*! ./logging */ "./src/nodeicons/logging.js"),
    LOG_OPTIONS = _require.LOG_OPTIONS;

function NodeIcons(options) {
  var cy = options.cy;

  this.cy = cy;
  this.listeners = [];

  this.options = assign({}, defaults, options);

  LOG_OPTIONS.enabled = this.options.showLogs;

  this.preventDefault = function (e) {
    return e.preventDefault();
  };
  this.setupPopper();
}

var proto = NodeIcons.prototype = {};
var extend = function extend(obj) {
  return assign(proto, obj);
};

proto.setOptions = function (options) {
  assign(this.options, options);
};

[setupPopper].forEach(extend);

module.exports = NodeIcons;

/***/ }),

/***/ "./src/nodeicons/logging.js":
/*!**********************************!*\
  !*** ./src/nodeicons/logging.js ***!
  \**********************************/
/***/ ((module) => {



var LOG_OPTIONS = {
  enabled: true
};

function log(msg) {
  if (LOG_OPTIONS.enabled) {
    for (var _len = arguments.length, parameters = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      parameters[_key - 1] = arguments[_key];
    }

    console.log("[cytoscape-nodeicons] " + msg, parameters);
  }
}

module.exports = { log: log, LOG_OPTIONS: LOG_OPTIONS };

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.js");
/******/ 	
/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUlULFlBQVlFLE9BQWhCLEVBQXlCO0FBQUEsc0NBRFJRLFVBQ1E7QUFEUkEsZ0JBQ1E7QUFBQTs7QUFDdkJkLFlBQVF6QyxHQUFSLDRCQUFxQ3NELEdBQXJDLEVBQTRDQyxVQUE1QztBQUNEO0FBQ0o7O0FBRUQxRSxPQUFPQyxPQUFQLEdBQWlCLEVBQUVrQixRQUFGLEVBQU82Qyx3QkFBUCxFQUFqQjs7Ozs7O1VDVkE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7OztVRXRCQTtVQUNBO1VBQ0E7VUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL2N5dG9zY2FwZU5vZGVpY29ucy93ZWJwYWNrL3VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24iLCJ3ZWJwYWNrOi8vY3l0b3NjYXBlTm9kZWljb25zLy4vc3JjL2Fzc2lnbi5qcyIsIndlYnBhY2s6Ly9jeXRvc2NhcGVOb2RlaWNvbnMvLi9zcmMvY29yZS5qcyIsIndlYnBhY2s6Ly9jeXRvc2NhcGVOb2RlaWNvbnMvLi9zcmMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vY3l0b3NjYXBlTm9kZWljb25zLy4vc3JjL25vZGVpY29ucy9jeXBvcHBlci5qcyIsIndlYnBhY2s6Ly9jeXRvc2NhcGVOb2RlaWNvbnMvLi9zcmMvbm9kZWljb25zL2RlZmF1bHRzLmpzIiwid2VicGFjazovL2N5dG9zY2FwZU5vZGVpY29ucy8uL3NyYy9ub2RlaWNvbnMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vY3l0b3NjYXBlTm9kZWljb25zLy4vc3JjL25vZGVpY29ucy9sb2dnaW5nLmpzIiwid2VicGFjazovL2N5dG9zY2FwZU5vZGVpY29ucy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9jeXRvc2NhcGVOb2RlaWNvbnMvd2VicGFjay9iZWZvcmUtc3RhcnR1cCIsIndlYnBhY2s6Ly9jeXRvc2NhcGVOb2RlaWNvbnMvd2VicGFjay9zdGFydHVwIiwid2VicGFjazovL2N5dG9zY2FwZU5vZGVpY29ucy93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoW10sIGZhY3RvcnkpO1xuXHRlbHNlIGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jylcblx0XHRleHBvcnRzW1wiY3l0b3NjYXBlTm9kZWljb25zXCJdID0gZmFjdG9yeSgpO1xuXHRlbHNlXG5cdFx0cm9vdFtcImN5dG9zY2FwZU5vZGVpY29uc1wiXSA9IGZhY3RvcnkoKTtcbn0pKHNlbGYsIGZ1bmN0aW9uKCkge1xucmV0dXJuICIsIi8vIFNpbXBsZSwgaW50ZXJuYWwgT2JqZWN0LmFzc2lnbigpIHBvbHlmaWxsIGZvciBvcHRpb25zIG9iamVjdHMgZXRjLlxuXG5tb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5hc3NpZ24gIT0gbnVsbCA/IE9iamVjdC5hc3NpZ24uYmluZCggT2JqZWN0ICkgOiBmdW5jdGlvbiggdGd0LCAuLi5zcmNzICl7XG4gIHNyY3MuZmlsdGVyKCBzcmMgPT4gc3JjICE9IG51bGwgKS5mb3JFYWNoKCBzcmMgPT4ge1xuICAgIE9iamVjdC5rZXlzKCBzcmMgKS5mb3JFYWNoKCBrID0+IHRndFtrXSA9IHNyY1trXSApO1xuICB9ICk7XG5cbiAgcmV0dXJuIHRndDtcbn07XG4iLCJjb25zdCBOb2RlSWNvbnMgPSByZXF1aXJlKCcuL25vZGVpY29ucycpO1xuY29uc3QgYXNzaWduID0gcmVxdWlyZSgnLi9hc3NpZ24nKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiggb3B0aW9ucyApe1xuICBsZXQgY3kgPSB0aGlzO1xuXG4gIHJldHVybiBuZXcgTm9kZUljb25zKCBhc3NpZ24oeyBjeSB9LCBvcHRpb25zKSApO1xufTtcbiIsImNvbnN0IGltcGwgPSByZXF1aXJlKCcuL2NvcmUnKTtcblxuLy8gcmVnaXN0ZXJzIHRoZSBleHRlbnNpb24gb24gYSBjeXRvc2NhcGUgbGliIHJlZlxubGV0IHJlZ2lzdGVyID0gZnVuY3Rpb24oIGN5dG9zY2FwZSApe1xuICBpZiggIWN5dG9zY2FwZSApeyByZXR1cm47IH0gLy8gY2FuJ3QgcmVnaXN0ZXIgaWYgY3l0b3NjYXBlIHVuc3BlY2lmaWVkXG5cbiAgY3l0b3NjYXBlKCAnY29yZScsICdub2RlaWNvbnMnLCBpbXBsICk7IC8vIHJlZ2lzdGVyIHdpdGggY3l0b3NjYXBlLmpzXG59O1xuXG5pZiggdHlwZW9mIGN5dG9zY2FwZSAhPT0gJ3VuZGVmaW5lZCcgKXsgLy8gZXhwb3NlIHRvIGdsb2JhbCBjeXRvc2NhcGUgKGkuZS4gd2luZG93LmN5dG9zY2FwZSlcbiAgcmVnaXN0ZXIoIGN5dG9zY2FwZSApOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVuZGVmXG59XG5cbm1vZHVsZS5leHBvcnRzID0gcmVnaXN0ZXI7XG4iLCJjb25zdCB7IGxvZyB9ID0gcmVxdWlyZShcIi4vbG9nZ2luZ1wiKTtcbmxldCBwb3BwZXJFbmFibGVkID0gZmFsc2U7XG5cbmZ1bmN0aW9uIHNldHVwUG9wcGVyKCkge1xuICBsZXQgeyBjeSwgb3B0aW9ucyB9ID0gdGhpcztcbiAgbG9nKFwiU2V0aW5nIHVwIFBvcHBlclwiLCB0aGlzKTtcbiAgaWYgKHBvcHBlckVuYWJsZWQpIHsgcmV0dXJuOyB9XG4gIFxuXG4gIHBvcHBlckVuYWJsZWQgPSB0cnVlO1xuXG4gIC8vIGV4YW1wbGUgY29kZSBmb3IgbWFraW5nIHlvdXIgb3duIGhhbmRsZXMgLS0gY3VzdG9taXNlIGV2ZW50cyBhbmQgcHJlc2VudGF0aW9uIHdoZXJlIGZpdHRpbmdcbiAgLy8gdmFyIHBvcHBlcjtcbiAgdmFyIHBvcHBlck5vZGU7XG4gIHZhciBwb3BwZXI7XG4gIHZhciBwb3BwZXJEaXY7XG4gIFxuXG4gIGZ1bmN0aW9uIHNldEhhbmRsZU9uKG5vZGUpIHtcbiBcbiAgICBpZihub2RlLmNsYXNzZXMoKS5pbmNsdWRlcyhcImVoLWhhbmRsZVwiKSl7XG4gICAgICAvLyBEb24ndCBhZGQgZWRpdCBib3ggZm9yIGN5dG9zY2FwZS1lZGdlaGFuZGxlcyBoYW5kbGVzXG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHJlbW92ZUhhbmRsZSgpOyAvLyBybSBvbGQgaGFuZGxlXG5cbiAgICBsZXQgaWNvbnMgPSBub2RlLmRhdGEoJ2ljb25zJyk7XG4gICAgaWYgKCFpY29ucyB8fCBpY29ucy5sZW5ndGggPT0gMCkge1xuICAgICAgbG9nKFwiTm9kZSB3aXRoIG5vIGljb25zIGluIGRhdGFcIik7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHBvcHBlck5vZGUgPSBub2RlO1xuXG4gICAgcG9wcGVyRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgcG9wcGVyRGl2LmNsYXNzTGlzdC5hZGQoJ2N5LW5vZGVpY29ucy1wb3BwZXItaGFuZGxlJyk7XG5cbiAgICBpY29ucy5mb3JFYWNoKGljb24gPT4ge1xuICAgICAgbGV0IGljb25EaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIGljb25EaXYuY2xhc3NMaXN0LmFkZCgnY3ktbm9kZWljb25zLXBvcHBlci1ub2RlaWNvbicpO1xuICAgICAgaWYgKGljb24uc3R5bGUpIHtcbiAgICAgICAgaWNvbkRpdi5zdHlsZSA9IGljb24uc3R5bGU7XG4gICAgICB9XG4gICAgICBpY29uRGl2LmlubmVySFRNTCA9IGljb24uaW5uZXJIVE1MO1xuICAgICAgaWYoaWNvbi50b29sdGlwKXtcbiAgICAgICAgaWNvbkRpdi50aXRsZSA9IGljb24udG9vbHRpcDtcbiAgICAgIH1cbiAgICAgIHBvcHBlckRpdi5hcHBlbmRDaGlsZChpY29uRGl2KTtcbiAgICAgIGljb25EaXYuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICAgICAgbG9nKFwiQ2xpY2tlZCBvbjogXCIsIGljb24pO1xuICAgICAgICBpZiAoaWNvbi5vbmNsaWNrKSB7XG4gICAgICAgICAgaWNvbi5vbmNsaWNrKCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgfSk7IFxuXG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChwb3BwZXJEaXYpO1xuXG4gICAgcG9wcGVyID0gbm9kZS5wb3BwZXIoe1xuICAgICAgY29udGVudDogcG9wcGVyRGl2LFxuICAgICAgcG9wcGVyOiB7XG4gICAgICAgIHBsYWNlbWVudDogb3B0aW9ucy5pY29uc1BsYWNlbWVudCxcbiAgICAgICAgaW50ZXJhY3RpdmU6IHRydWUsXG4gICAgICAgIG1vZGlmaWVyczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIG5hbWU6ICdvZmZzZXQnLFxuICAgICAgICAgICAgb3B0aW9uczoge1xuICAgICAgICAgICAgICBvZmZzZXQ6IFswLCBvcHRpb25zLnZlcnRpY2FsT2Zmc2V0XSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcblxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gcmVtb3ZlSGFuZGxlKCkge1xuICAgIGlmIChwb3BwZXIpIHtcbiAgICAgIHBvcHBlci5kZXN0cm95KCk7XG4gICAgICBwb3BwZXIgPSBudWxsO1xuICAgIH1cblxuICAgIGlmIChwb3BwZXJEaXYpIHtcbiAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQocG9wcGVyRGl2KTtcbiAgICAgIHBvcHBlckRpdiA9IG51bGw7XG4gICAgfVxuXG4gICAgcG9wcGVyTm9kZSA9IG51bGw7XG4gIH1cblxuICBjeS5vbignbW91c2VvdmVyJywgJ25vZGUnLCBmdW5jdGlvbiAoZSkge1xuICAgIHNldEhhbmRsZU9uKGUudGFyZ2V0KTtcbiAgfSk7XG5cbiAgY3kub24oJ2dyYWInLCAnbm9kZScsIGZ1bmN0aW9uICgpIHtcbiAgICByZW1vdmVIYW5kbGUoKTtcbiAgfSk7XG5cbiAgY3kub24oJ3RhcCcsIGZ1bmN0aW9uIChlKSB7XG4gICAgY29uc29sZS5sb2coXCJjeXBvcHBlciAtIHRhcFwiKTtcbiAgICBpZiAoZS50YXJnZXQgPT09IGN5KSB7XG4gICAgICByZW1vdmVIYW5kbGUoKTtcbiAgICB9ICAgIFxuICB9KTtcblxuICBjeS5vbignem9vbSBwYW4nLCBmdW5jdGlvbiAoKSB7XG4gICAgcmVtb3ZlSGFuZGxlKCk7XG4gIH0pO1xuICBjeS5vbignbW91c2VvdXQnLCAnbm9kZScsIGZ1bmN0aW9uIChlKSB7XG4gICAgcmVtb3ZlSGFuZGxlKCk7XG4gIH0pO1xuXG4gIGN5Lm9uKCd0YXAnLCAnbm9kZScsIGZ1bmN0aW9uIChlKSB7XG4gICAgY29uc29sZS5sb2coXCJjeXBvcHBlciAtIHRhcFwiLCBlKTtcbiAgICBzZXRIYW5kbGVPbihlLnRhcmdldCk7XG4gIH0pO1xuXG5cbiAgY3kub24oJ3RhcGVuZCcsICdub2RlJywgZnVuY3Rpb24gKGUpIHtcbiAgICBjb25zb2xlLmxvZyhcImN5cG9wcGVyIC0gdGFwZW5kXCIpO1xuICAgIHJlbW92ZUhhbmRsZSgpO1xuICB9KTtcbiAgcmV0dXJuIHRoaXM7XG59XG5cbm1vZHVsZS5leHBvcnRzID0geyBzZXR1cFBvcHBlciB9O1xuIiwiLyogZXNsaW50LWRpc2FibGUgbm8tdW51c2VkLXZhcnMgKi9cbmxldCBkZWZhdWx0cyA9IHtcbiAgdmVydGljYWxPZmZzZXQ6IDAsXG4gIHNob3dMb2dzOiBmYWxzZSxcbiAgYWx3YXlzT246IGZhbHNlLFxuICBpY29uc1BsYWNlbWVudDogJ2JvdHRvbScsXG4gIGljb25zOiBbXSAvLyBTYW1wbGU6IFt7aW5uZXJIVE1MOiAnPGkgY2xhc3M9XCJmYSBmYS1wYXBlcmNsaXBcIi8+Jywgc3R5bGU6ICdjb2xvcjpyZWQnfSwge31dXG59O1xuLyogZXNsaW50LWVuYWJsZSAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGRlZmF1bHRzO1xuIiwiY29uc3QgZGVmYXVsdHMgPSByZXF1aXJlKCcuL2RlZmF1bHRzJyk7XG5jb25zdCBhc3NpZ24gPSByZXF1aXJlKCcuLi9hc3NpZ24nKTtcbmNvbnN0IHNldHVwUG9wcGVyID0gcmVxdWlyZSgnLi9jeXBvcHBlcicpOyBcbmNvbnN0IHtMT0dfT1BUSU9OU30gPSByZXF1aXJlKFwiLi9sb2dnaW5nXCIpO1xuXG5mdW5jdGlvbiBOb2RlSWNvbnMoIG9wdGlvbnMgKXtcbiAgbGV0IGN5ID0gb3B0aW9ucy5jeTtcblxuICB0aGlzLmN5ID0gY3k7XG4gIHRoaXMubGlzdGVuZXJzID0gW107XG5cbiAgdGhpcy5vcHRpb25zID0gYXNzaWduKCB7fSwgZGVmYXVsdHMsIG9wdGlvbnMgKTtcblxuICBMT0dfT1BUSU9OUy5lbmFibGVkID0gdGhpcy5vcHRpb25zLnNob3dMb2dzO1xuICBcbiAgdGhpcy5wcmV2ZW50RGVmYXVsdCA9IGUgPT4gZS5wcmV2ZW50RGVmYXVsdCgpO1xuICB0aGlzLnNldHVwUG9wcGVyKCk7XG4gICAgIFxufVxuXG5sZXQgcHJvdG8gPSBOb2RlSWNvbnMucHJvdG90eXBlID0ge307XG5sZXQgZXh0ZW5kID0gb2JqID0+IGFzc2lnbiggcHJvdG8sIG9iaiApO1xuIFxucHJvdG8uc2V0T3B0aW9ucyA9IGZ1bmN0aW9uKCBvcHRpb25zICl7XG4gIGFzc2lnbiggdGhpcy5vcHRpb25zLCBvcHRpb25zICk7XG59O1xuIFxuW1xuICBzZXR1cFBvcHBlclxuXS5mb3JFYWNoKCBleHRlbmQgKTtcblxubW9kdWxlLmV4cG9ydHMgPSBOb2RlSWNvbnM7XG4iLCJ2YXIgTE9HX09QVElPTlMgPSB7XHJcbiAgICBlbmFibGVkOiB0cnVlXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGxvZyhtc2csIC4uLnBhcmFtZXRlcnMpIHsgICBcclxuICAgIGlmIChMT0dfT1BUSU9OUy5lbmFibGVkKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKGBbY3l0b3NjYXBlLW5vZGVpY29uc10gJHttc2d9YCwgcGFyYW1ldGVycyk7XHJcbiAgICB9XHJcbn1cclxuICBcclxubW9kdWxlLmV4cG9ydHMgPSB7IGxvZywgTE9HX09QVElPTlMgfTsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBpcyByZWZlcmVuY2VkIGJ5IG90aGVyIG1vZHVsZXMgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvaW5kZXguanNcIik7XG4iLCIiXSwibmFtZXMiOlsibW9kdWxlIiwiZXhwb3J0cyIsIk9iamVjdCIsImFzc2lnbiIsImJpbmQiLCJ0Z3QiLCJzcmNzIiwiZmlsdGVyIiwic3JjIiwiZm9yRWFjaCIsImtleXMiLCJrIiwiTm9kZUljb25zIiwicmVxdWlyZSIsIm9wdGlvbnMiLCJjeSIsImltcGwiLCJyZWdpc3RlciIsImN5dG9zY2FwZSIsImxvZyIsInBvcHBlckVuYWJsZWQiLCJzZXR1cFBvcHBlciIsInBvcHBlck5vZGUiLCJwb3BwZXIiLCJwb3BwZXJEaXYiLCJzZXRIYW5kbGVPbiIsIm5vZGUiLCJjbGFzc2VzIiwiaW5jbHVkZXMiLCJyZW1vdmVIYW5kbGUiLCJpY29ucyIsImRhdGEiLCJsZW5ndGgiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJjbGFzc0xpc3QiLCJhZGQiLCJpY29uRGl2IiwiaWNvbiIsInN0eWxlIiwiaW5uZXJIVE1MIiwidG9vbHRpcCIsInRpdGxlIiwiYXBwZW5kQ2hpbGQiLCJhZGRFdmVudExpc3RlbmVyIiwib25jbGljayIsImJvZHkiLCJjb250ZW50IiwicGxhY2VtZW50IiwiaWNvbnNQbGFjZW1lbnQiLCJpbnRlcmFjdGl2ZSIsIm1vZGlmaWVycyIsIm5hbWUiLCJvZmZzZXQiLCJ2ZXJ0aWNhbE9mZnNldCIsImRlc3Ryb3kiLCJyZW1vdmVDaGlsZCIsIm9uIiwiZSIsInRhcmdldCIsImNvbnNvbGUiLCJkZWZhdWx0cyIsInNob3dMb2dzIiwiYWx3YXlzT24iLCJMT0dfT1BUSU9OUyIsImxpc3RlbmVycyIsImVuYWJsZWQiLCJwcmV2ZW50RGVmYXVsdCIsInByb3RvIiwicHJvdG90eXBlIiwiZXh0ZW5kIiwib2JqIiwic2V0T3B0aW9ucyIsIm1zZyIsInBhcmFtZXRlcnMiXSwic291cmNlUm9vdCI6IiJ9