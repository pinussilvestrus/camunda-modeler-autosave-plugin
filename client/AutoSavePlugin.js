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
import React, { Fragment, PureComponent } from 'camunda-modeler-plugin-helpers/react';
import { Fill } from 'camunda-modeler-plugin-helpers/components';

import ConfigModal from './ConfigModal';

const defaultState = {
  enabled: false,
  interval: 5,
  configOpen: false
};

/**
 * An example client extension plugin to enable auto saving functionality
 * into the Camunda Modeler
 */
export default class AutoSavePlugin extends PureComponent {
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
    } = this.props;

    // retrieve plugin related information from the application configuration
    config.getForPlugin('autoSave', 'config')
      .then(config => this.setState(config));

    // subscribe to the creation of the BPMN modeler to detect modeling events
    subscribe('bpmn.modeler.created', ({ modeler }) => {
      const eventBus = modeler.get('eventBus');

      eventBus.on('directEditing.activate', () => this.directEditingActivated = true);
      eventBus.on('directEditing.deactivate', () => this.directEditingActivated = false);
    });

    // subscribe to the creation of the DMN modeler to detect modeling events
    subscribe('dmn.modeler.created', ({ modeler }) => {
      const eventBus = modeler._eventBus;
      var mayChangeDirectEditingState = true;

      // workaround to ensure proper detection of the direct editing state as the fired event of the
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
    });

    // subscribe to the creation of the CMMN modeler to detect modeling events
    subscribe('cmmn.modeler.created', ({ modeler }) => {
      const eventBus = modeler.get('eventBus');

      eventBus.on('directEditing.activate', () => this.currentlyEditing = true);
      eventBus.on('directEditing.deactivate', () => this.currentlyEditing = false);
    });

    // subscribe to the event when the active tab changed in the application
    subscribe('app.activeTabChanged', ({ activeTab }) => {
      this.clearTimer();
      this.activeTab = activeTab;

      if (this.state.enabled && activeTab.file && activeTab.file.path) {
        this.setupTimer();
      }
    });

    // subscribe to the event when a tab was saved in the application
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
    } = this.props;

    // trigger a tab save operation
    triggerAction('save')
      .then(tab => {
        if (!tab) {
          return displayNotification({ title: 'Failed to save' });
        }
      });
  }

  handleConfigClosed(newConfig) {
    this.setState({ configOpen: false });

    if (newConfig) {

      // via <config> it is also possible to save data into the application configuration
      this.props.config.setForPlugin('autoSave', 'config', newConfig)
        .catch(console.error);

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
    };

    // we can use fills to hook React components into certain places of the UI
    return <Fragment>
      <Fill slot="toolbar" group="9_autoSave">
        <button type="button" onClick={ () => this.setState({ configOpen: true }) }>
          Configure autosave
        </button>
      </Fill>
      { this.state.configOpen && (
        <ConfigModal
          onClose={ this.handleConfigClosed }
          initValues={ initValues }
        />
      )}
    </Fragment>;
  }
}
