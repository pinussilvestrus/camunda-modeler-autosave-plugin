/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./client/AutoSavePlugin.js":
/*!**********************************!*\
  !*** ./client/AutoSavePlugin.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ AutoSavePlugin)
/* harmony export */ });
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

/* eslint-disable no-unused-vars*/



const defaultState = {
  enabled: false,
  interval: 5,
  configOpen: false
};
/**
 * An example client extension plugin to enable auto saving functionality
 * into the Camunda Modeler
 */

class AutoSavePlugin extends camunda_modeler_plugin_helpers_react__WEBPACK_IMPORTED_MODULE_0__.PureComponent {
  activeTab = {
    id: '__empty',
    type: 'empty'
  };
  directEditingActivated = false;

  constructor(props) {
    super(props);
    this.state = defaultState;
    this.handleConfigClosed = this.handleConfigClosed.bind(this);
  }

  componentDidMount() {
    /**
    * The component props include everything the Application offers plugins,
    * which includes:
    * - config: save and retrieve information to the local configuration
    * - subscribe: hook into application events, like <tab.saved>, <app.activeTabChanged> ...
    * - triggerAction: execute editor actions, like <save>, <open-diagram> ...
    * - log: log information into the Log panel
    * - displayNotification: show notifications inside the application
    */
    const {
      config,
      subscribe
    } = this.props; // retrieve plugin related information from the application configuration

    config.getForPlugin('autoSave', 'config').then(config => this.setState(config)); // subscribe to the creation of the BPMN modeler to detect modeling events

    subscribe('bpmn.modeler.created', ({
      modeler
    }) => {
      const eventBus = modeler.get('eventBus');
      eventBus.on('directEditing.activate', () => this.directEditingActivated = true);
      eventBus.on('directEditing.deactivate', () => this.directEditingActivated = false);
    }); // subscribe to the creation of the DMN modeler to detect modeling events

    subscribe('dmn.modeler.created', ({
      modeler
    }) => {
      const eventBus = modeler._eventBus;
      var mayChangeDirectEditingState = true; // workaround to ensure proper detection of the direct editing state as the fired event of the
      // DMN modeler doesn't differentiate

      eventBus.on('view.selectionChanged', event => {
        if (modeler._activeView.type === 'drd') {
          mayChangeDirectEditingState = event.oldSelection.length != event.newSelection.length;
        }
      });
      eventBus.on('view.directEditingChanged', () => {
        if (mayChangeDirectEditingState) {
          this.directEditingActivated = true;
        } else {
          this.directEditingActivated = false;
        }

        mayChangeDirectEditingState = false;
      });
    }); // subscribe to the creation of the CMMN modeler to detect modeling events

    subscribe('cmmn.modeler.created', ({
      modeler
    }) => {
      const eventBus = modeler.get('eventBus');
      eventBus.on('directEditing.activate', () => this.currentlyEditing = true);
      eventBus.on('directEditing.deactivate', () => this.currentlyEditing = false);
    }); // subscribe to the event when the active tab changed in the application

    subscribe('app.activeTabChanged', ({
      activeTab
    }) => {
      this.clearTimer();
      this.activeTab = activeTab;

      if (this.state.enabled && activeTab.file && activeTab.file.path) {
        this.setupTimer();
      }
    }); // subscribe to the event when a tab was saved in the application

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

    if (!this.timer && !configOpen && enabled && this.activeTab.file && this.activeTab.file.path) {
      this.setupTimer();
    }
  }

  setupTimer() {
    this.timer = setTimeout(() => {
      if (!this.directEditingActivated) {
        this.save();
      }

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
    const {
      displayNotification,
      triggerAction
    } = this.props; // trigger a tab save operation

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
      // via <config> it is also possible to save data into the application configuration
      this.props.config.setForPlugin('autoSave', 'config', newConfig).catch(console.error);
      this.setState(newConfig);
    }
  }
  /**
   * render any React component you like to extend the existing
   * Camunda Modeler application UI
   */


  render() {
    const {
      enabled,
      interval
    } = this.state;
    const initValues = {
      enabled,
      interval
    }; // we can use fills to hook React components into certain places of the UI

    return /*#__PURE__*/camunda_modeler_plugin_helpers_react__WEBPACK_IMPORTED_MODULE_0___default().createElement(camunda_modeler_plugin_helpers_react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, /*#__PURE__*/camunda_modeler_plugin_helpers_react__WEBPACK_IMPORTED_MODULE_0___default().createElement(camunda_modeler_plugin_helpers_components__WEBPACK_IMPORTED_MODULE_1__.Fill, {
      slot: "toolbar",
      group: "9_autoSave"
    }, /*#__PURE__*/camunda_modeler_plugin_helpers_react__WEBPACK_IMPORTED_MODULE_0___default().createElement("button", {
      type: "button",
      onClick: () => this.setState({
        configOpen: true
      })
    }, "Configure autosave")), this.state.configOpen && /*#__PURE__*/camunda_modeler_plugin_helpers_react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_ConfigModal__WEBPACK_IMPORTED_MODULE_2__["default"], {
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
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ConfigModal)
/* harmony export */ });
/* harmony import */ var camunda_modeler_plugin_helpers_react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! camunda-modeler-plugin-helpers/react */ "./node_modules/camunda-modeler-plugin-helpers/react.js");
/* harmony import */ var camunda_modeler_plugin_helpers_react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(camunda_modeler_plugin_helpers_react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var camunda_modeler_plugin_helpers_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! camunda-modeler-plugin-helpers/components */ "./node_modules/camunda-modeler-plugin-helpers/components.js");
/* eslint-disable no-unused-vars */

 // polyfill upcoming structural components

const Title = camunda_modeler_plugin_helpers_components__WEBPACK_IMPORTED_MODULE_1__.Modal.Title || (({
  children
}) => /*#__PURE__*/camunda_modeler_plugin_helpers_react__WEBPACK_IMPORTED_MODULE_0___default().createElement("h2", null, children));

const Body = camunda_modeler_plugin_helpers_components__WEBPACK_IMPORTED_MODULE_1__.Modal.Body || (({
  children
}) => /*#__PURE__*/camunda_modeler_plugin_helpers_react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, children));

const Footer = camunda_modeler_plugin_helpers_components__WEBPACK_IMPORTED_MODULE_1__.Modal.Footer || (({
  children
}) => /*#__PURE__*/camunda_modeler_plugin_helpers_react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, children)); // we can even use hooks to render into the application


function ConfigModal({
  initValues,
  onClose
}) {
  const [enabled, setEnabled] = (0,camunda_modeler_plugin_helpers_react__WEBPACK_IMPORTED_MODULE_0__.useState)(initValues.enabled);
  const [interval, setAutoSaveInterval] = (0,camunda_modeler_plugin_helpers_react__WEBPACK_IMPORTED_MODULE_0__.useState)(initValues.interval);

  const onSubmit = () => onClose({
    enabled,
    interval
  }); // we can use the built-in styles, e.g. by adding "btn btn-primary" class names


  return /*#__PURE__*/camunda_modeler_plugin_helpers_react__WEBPACK_IMPORTED_MODULE_0___default().createElement(camunda_modeler_plugin_helpers_components__WEBPACK_IMPORTED_MODULE_1__.Modal, {
    onClose: onClose
  }, /*#__PURE__*/camunda_modeler_plugin_helpers_react__WEBPACK_IMPORTED_MODULE_0___default().createElement(Title, null, "AutoSave Configuration"), /*#__PURE__*/camunda_modeler_plugin_helpers_react__WEBPACK_IMPORTED_MODULE_0___default().createElement(Body, null, /*#__PURE__*/camunda_modeler_plugin_helpers_react__WEBPACK_IMPORTED_MODULE_0___default().createElement("form", {
    id: "autoSaveConfigForm",
    onSubmit: onSubmit
  }, /*#__PURE__*/camunda_modeler_plugin_helpers_react__WEBPACK_IMPORTED_MODULE_0___default().createElement("p", null, /*#__PURE__*/camunda_modeler_plugin_helpers_react__WEBPACK_IMPORTED_MODULE_0___default().createElement("label", null, "Enabled:", /*#__PURE__*/camunda_modeler_plugin_helpers_react__WEBPACK_IMPORTED_MODULE_0___default().createElement("input", {
    type: "checkbox",
    name: "enabled",
    checked: enabled,
    onChange: () => setEnabled(!enabled)
  }))), /*#__PURE__*/camunda_modeler_plugin_helpers_react__WEBPACK_IMPORTED_MODULE_0___default().createElement("p", null, /*#__PURE__*/camunda_modeler_plugin_helpers_react__WEBPACK_IMPORTED_MODULE_0___default().createElement("label", null, "Interval (seconds):", /*#__PURE__*/camunda_modeler_plugin_helpers_react__WEBPACK_IMPORTED_MODULE_0___default().createElement("input", {
    type: "number",
    name: "interval",
    min: "1",
    value: interval,
    onChange: event => setAutoSaveInterval(Number(event.target.value))
  }))))), /*#__PURE__*/camunda_modeler_plugin_helpers_react__WEBPACK_IMPORTED_MODULE_0___default().createElement(Footer, null, /*#__PURE__*/camunda_modeler_plugin_helpers_react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    id: "autoSaveConfigButtons"
  }, /*#__PURE__*/camunda_modeler_plugin_helpers_react__WEBPACK_IMPORTED_MODULE_0___default().createElement("button", {
    type: "submit",
    class: "btn btn-primary",
    form: "autoSaveConfigForm"
  }, "Save"), /*#__PURE__*/camunda_modeler_plugin_helpers_react__WEBPACK_IMPORTED_MODULE_0___default().createElement("button", {
    type: "button",
    class: "btn btn-secondary",
    onClick: () => onClose()
  }, "Cancel"))));
}

/***/ }),

/***/ "./node_modules/camunda-modeler-plugin-helpers/components.js":
/*!*******************************************************************!*\
  !*** ./node_modules/camunda-modeler-plugin-helpers/components.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Fill": () => (/* binding */ Fill),
/* harmony export */   "Modal": () => (/* binding */ Modal)
/* harmony export */ });
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
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "registerClientPlugin": () => (/* binding */ registerClientPlugin),
/* harmony export */   "registerClientExtension": () => (/* binding */ registerClientExtension),
/* harmony export */   "registerBpmnJSPlugin": () => (/* binding */ registerBpmnJSPlugin),
/* harmony export */   "registerBpmnJSModdleExtension": () => (/* binding */ registerBpmnJSModdleExtension),
/* harmony export */   "registerDmnJSModdleExtension": () => (/* binding */ registerDmnJSModdleExtension),
/* harmony export */   "registerDmnJSPlugin": () => (/* binding */ registerDmnJSPlugin),
/* harmony export */   "getModelerDirectory": () => (/* binding */ getModelerDirectory),
/* harmony export */   "getPluginsDirectory": () => (/* binding */ getPluginsDirectory)
/* harmony export */ });
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
 * Validate and register a dmn-moddle extension plugin.
 *
 * @param {Object} descriptor
 *
 * @example
 * import {
 *   registerDmnJSModdleExtension
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
 * registerDmnJSModdleExtension(moddleDescriptor);
 */
function registerDmnJSModdleExtension(descriptor) {
  registerClientPlugin(descriptor, 'dmn.modeler.moddleExtension');
}

/**
 * Validate and register a dmn-js plugin.
 *
 * @param {Object} module
 *
 * @example
 *
 * import {
 *   registerDmnJSPlugin
 * } from 'camunda-modeler-plugin-helpers';
 *
 * const DmnJSModule = {
 *   __init__: [ 'myService' ],
 *   myService: [ 'type', ... ]
 * };
 *
 * registerDmnJSPlugin(DmnJSModule, [ 'drd', 'literalExpression' ]);
 * registerDmnJSPlugin(DmnJSModule, 'drd')
 */
function registerDmnJSPlugin(module, components) {

  if (!Array.isArray(components)) {
    components = [ components ]
  }

  components.forEach(c => registerClientPlugin(module, `dmn.modeler.${c}.additionalModules`)); 
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
/***/ ((module) => {

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
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!*************************!*\
  !*** ./client/index.js ***!
  \*************************/
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


(0,camunda_modeler_plugin_helpers__WEBPACK_IMPORTED_MODULE_0__.registerClientExtension)(_AutoSavePlugin__WEBPACK_IMPORTED_MODULE_1__["default"]);
})();

/******/ })()
;
//# sourceMappingURL=client.js.map