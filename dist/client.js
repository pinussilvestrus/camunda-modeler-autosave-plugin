/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./client/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./client/AutoSavePlugin.js":
/*!**********************************!*\
  !*** ./client/AutoSavePlugin.js ***!
  \**********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return AutoSavePlugin; });
/* harmony import */ var camunda_modeler_plugin_helpers_react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! camunda-modeler-plugin-helpers/react */ "./node_modules/camunda-modeler-plugin-helpers/react.js");
/* harmony import */ var camunda_modeler_plugin_helpers_react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(camunda_modeler_plugin_helpers_react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var camunda_modeler_plugin_helpers_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! camunda-modeler-plugin-helpers/components */ "./node_modules/camunda-modeler-plugin-helpers/components.js");
/* harmony import */ var _ConfigModal__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ConfigModal */ "./client/ConfigModal.js");
/**
 * Copyright Camunda Services GmbH and/or licensed to Camunda Services GmbH
 * under one or more contributor license agreements. See the NOTICE file
 * distributed with this work for additional information regarding copyright
 * ownership.
 *
 * Camunda licenses this file to you under the MIT; you may not use this file
 * except in compliance with the MIT License.
 */



const defaultState = {
  enabled: false,
  interval: 5,
  configOpen: false
};
class AutoSavePlugin extends camunda_modeler_plugin_helpers_react__WEBPACK_IMPORTED_MODULE_0__["PureComponent"] {
  constructor(props) {
    super(props);
    this.state = defaultState;
    this.handleConfigClosed = this.handleConfigClosed.bind(this);
  }

  componentDidMount() {
    const {
      config,
      subscribe
    } = this.props;
    config.getForPlugin('autoSave', 'config').then(config => this.setState(config));
    subscribe('app.activeTabChanged', ({
      activeTab
    }) => {
      this.clearTimer();

      if (this.state.enabled && activeTab.file && activeTab.file.path) {
        this.setupTimer();
      }
    });
    subscribe('tab.saved', () => {
      if (!this.timer && this.state.enabled) {
        this.setupTimer();
      }
    });
  }

  componentDidUpdate() {
    const {
      configOpen,
      enabled
    } = this.state;

    if (!enabled || configOpen) {
      this.clearTimer();
    }

    if (!this.timer && !configOpen && enabled) {
      this.setupTimer();
    }
  }

  setupTimer() {
    this.timer = setTimeout(() => {
      this.save();
      this.setupTimer();
    }, this.state.interval * 1000);
  }

  clearTimer() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  save() {
    debugger;
    const {
      displayNotification,
      triggerAction
    } = this.props;
    triggerAction('save').then(tab => {
      if (!tab) {
        return displayNotification({
          title: 'Failed to save'
        });
      }
    });
  }

  handleConfigClosed(newConfig) {
    this.setState({
      configOpen: false
    });

    if (newConfig) {
      this.props.config.setForPlugin('autoSave', 'config', newConfig).catch(console.error);
      this.setState(newConfig);
    }
  }

  render() {
    const {
      enabled,
      interval
    } = this.state;
    const initValues = {
      enabled,
      interval
    };
    return camunda_modeler_plugin_helpers_react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(camunda_modeler_plugin_helpers_react__WEBPACK_IMPORTED_MODULE_0__["Fragment"], null, camunda_modeler_plugin_helpers_react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(camunda_modeler_plugin_helpers_components__WEBPACK_IMPORTED_MODULE_1__["Fill"], {
      slot: "toolbar",
      group: "9_autoSave"
    }, camunda_modeler_plugin_helpers_react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
      type: "button",
      onClick: () => this.setState({
        configOpen: true
      })
    }, "Configure autosave")), this.state.configOpen && camunda_modeler_plugin_helpers_react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_ConfigModal__WEBPACK_IMPORTED_MODULE_2__["default"], {
      onClose: this.handleConfigClosed,
      initValues: initValues
    }));
  }

}

/***/ }),

/***/ "./client/ConfigModal.js":
/*!*******************************!*\
  !*** ./client/ConfigModal.js ***!
  \*******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return ConfigModal; });
/* harmony import */ var camunda_modeler_plugin_helpers_react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! camunda-modeler-plugin-helpers/react */ "./node_modules/camunda-modeler-plugin-helpers/react.js");
/* harmony import */ var camunda_modeler_plugin_helpers_react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(camunda_modeler_plugin_helpers_react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var camunda_modeler_plugin_helpers_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! camunda-modeler-plugin-helpers/components */ "./node_modules/camunda-modeler-plugin-helpers/components.js");

 // polyfill upcoming structural components

const Title = camunda_modeler_plugin_helpers_components__WEBPACK_IMPORTED_MODULE_1__["Modal"].Title || (({
  children
}) => camunda_modeler_plugin_helpers_react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h2", null, children));

const Body = camunda_modeler_plugin_helpers_components__WEBPACK_IMPORTED_MODULE_1__["Modal"].Body || (({
  children
}) => camunda_modeler_plugin_helpers_react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, children));

const Footer = camunda_modeler_plugin_helpers_components__WEBPACK_IMPORTED_MODULE_1__["Modal"].Footer || (({
  children
}) => camunda_modeler_plugin_helpers_react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, children));

function ConfigModal({
  initValues,
  onClose
}) {
  const [enabled, setEnabled] = Object(camunda_modeler_plugin_helpers_react__WEBPACK_IMPORTED_MODULE_0__["useState"])(initValues.enabled);
  const [interval, setAutoSaveInterval] = Object(camunda_modeler_plugin_helpers_react__WEBPACK_IMPORTED_MODULE_0__["useState"])(initValues.interval);

  const onSubmit = () => onClose({
    enabled,
    interval
  });

  return camunda_modeler_plugin_helpers_react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(camunda_modeler_plugin_helpers_components__WEBPACK_IMPORTED_MODULE_1__["Modal"], {
    onClose: onClose
  }, camunda_modeler_plugin_helpers_react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(Title, null, "AutoSave Configuration"), camunda_modeler_plugin_helpers_react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(Body, null, camunda_modeler_plugin_helpers_react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("form", {
    id: "autoSaveConfigForm",
    onSubmit: onSubmit
  }, camunda_modeler_plugin_helpers_react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", null, camunda_modeler_plugin_helpers_react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", null, "Enabled:", camunda_modeler_plugin_helpers_react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
    type: "checkbox",
    name: "enabled",
    checked: enabled,
    onChange: () => setEnabled(!enabled)
  }))), camunda_modeler_plugin_helpers_react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", null, camunda_modeler_plugin_helpers_react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", null, "Interval (seconds):", camunda_modeler_plugin_helpers_react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
    type: "number",
    name: "interval",
    min: "1",
    value: interval,
    onChange: event => setAutoSaveInterval(Number(event.target.value))
  }))))), camunda_modeler_plugin_helpers_react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(Footer, null, camunda_modeler_plugin_helpers_react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    id: "autoSaveConfigButtons"
  }, camunda_modeler_plugin_helpers_react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
    type: "submit",
    form: "autoSaveConfigForm"
  }, "Save"), camunda_modeler_plugin_helpers_react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
    type: "button",
    onClick: () => onClose()
  }, "Cancel"))));
}

/***/ }),

/***/ "./client/index.js":
/*!*************************!*\
  !*** ./client/index.js ***!
  \*************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var camunda_modeler_plugin_helpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! camunda-modeler-plugin-helpers */ "./node_modules/camunda-modeler-plugin-helpers/index.js");
/* harmony import */ var _AutoSavePlugin__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./AutoSavePlugin */ "./client/AutoSavePlugin.js");
/**
 * Copyright Camunda Services GmbH and/or licensed to Camunda Services GmbH
 * under one or more contributor license agreements. See the NOTICE file
 * distributed with this work for additional information regarding copyright
 * ownership.
 *
 * Camunda licenses this file to you under the MIT; you may not use this file
 * except in compliance with the MIT License.
 */


Object(camunda_modeler_plugin_helpers__WEBPACK_IMPORTED_MODULE_0__["registerClientExtension"])(_AutoSavePlugin__WEBPACK_IMPORTED_MODULE_1__["default"]);

/***/ }),

/***/ "./node_modules/camunda-modeler-plugin-helpers/components.js":
/*!*******************************************************************!*\
  !*** ./node_modules/camunda-modeler-plugin-helpers/components.js ***!
  \*******************************************************************/
/*! exports provided: Fill, Modal */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Fill", function() { return Fill; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Modal", function() { return Modal; });
if (!window.components) {
  throw new Error('Not compatible with Camunda Modeler < 3.4');
}

/**
 * Fill component.
 *
 * @type {import('react').ComponentType<{ group: string, name: string }>}
 */
const Fill = window.components.Fill;

/**
 * Modal component.
 *
 * @type {import('react').ComponentType<{ onClose: Function }>}
 */
const Modal = window.components.Modal;

/***/ }),

/***/ "./node_modules/camunda-modeler-plugin-helpers/index.js":
/*!**************************************************************!*\
  !*** ./node_modules/camunda-modeler-plugin-helpers/index.js ***!
  \**************************************************************/
/*! exports provided: registerClientPlugin, registerClientExtension, registerBpmnJSPlugin, registerBpmnJSModdleExtension, getModelerDirectory, getPluginsDirectory */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "registerClientPlugin", function() { return registerClientPlugin; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "registerClientExtension", function() { return registerClientExtension; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "registerBpmnJSPlugin", function() { return registerBpmnJSPlugin; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "registerBpmnJSModdleExtension", function() { return registerBpmnJSModdleExtension; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getModelerDirectory", function() { return getModelerDirectory; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getPluginsDirectory", function() { return getPluginsDirectory; });
/**
 * Validate and register a client plugin.
 *
 * @param {Object} plugin
 * @param {String} type
 */
function registerClientPlugin(plugin, type) {
  var plugins = window.plugins || [];
  window.plugins = plugins;

  if (!plugin) {
    throw new Error('plugin not specified');
  }

  if (!type) {
    throw new Error('type not specified');
  }

  plugins.push({
    plugin: plugin,
    type: type
  });
}

/**
 * Validate and register a client plugin.
 *
 * @param {import('react').ComponentType} extension
 *
 * @example
 *
 * import MyExtensionComponent from './MyExtensionComponent';
 *
 * registerClientExtension(MyExtensionComponent);
 */
function registerClientExtension(component) {
  registerClientPlugin(component, 'client');
}

/**
 * Validate and register a bpmn-js plugin.
 *
 * @param {Object} module
 *
 * @example
 *
 * import {
 *   registerBpmnJSPlugin
 * } from 'camunda-modeler-plugin-helpers';
 *
 * const BpmnJSModule = {
 *   __init__: [ 'myService' ],
 *   myService: [ 'type', ... ]
 * };
 *
 * registerBpmnJSPlugin(BpmnJSModule);
 */
function registerBpmnJSPlugin(module) {
  registerClientPlugin(module, 'bpmn.modeler.additionalModules');
}

/**
 * Validate and register a bpmn-moddle extension plugin.
 *
 * @param {Object} descriptor
 *
 * @example
 * import {
 *   registerBpmnJSModdleExtension
 * } from 'camunda-modeler-plugin-helpers';
 *
 * var moddleDescriptor = {
 *   name: 'my descriptor',
 *   uri: 'http://example.my.company.localhost/schema/my-descriptor/1.0',
 *   prefix: 'mydesc',
 *
 *   ...
 * };
 *
 * registerBpmnJSModdleExtension(moddleDescriptor);
 */
function registerBpmnJSModdleExtension(descriptor) {
  registerClientPlugin(descriptor, 'bpmn.modeler.moddleExtension');
}

/**
 * Return the modeler directory, as a string.
 *
 * @deprecated Will be removed in future Camunda Modeler versions without replacement.
 *
 * @return {String}
 */
function getModelerDirectory() {
  return window.getModelerDirectory();
}

/**
 * Return the modeler plugin directory, as a string.
 *
 * @deprecated Will be removed in future Camunda Modeler versions without replacement.
 *
 * @return {String}
 */
function getPluginsDirectory() {
  return window.getPluginsDirectory();
}

/***/ }),

/***/ "./node_modules/camunda-modeler-plugin-helpers/react.js":
/*!**************************************************************!*\
  !*** ./node_modules/camunda-modeler-plugin-helpers/react.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

if (!window.react) {
  throw new Error('Not compatible with Camunda Modeler < 3.4');
}

/**
 * React object used by Camunda Modeler. Use it to create UI extension.
 *
 * @type {import('react')}
 */
module.exports = window.react;

/***/ })

/******/ });
//# sourceMappingURL=client.js.map