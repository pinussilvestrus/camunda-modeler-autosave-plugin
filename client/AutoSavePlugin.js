/**
 * Copyright Camunda Services GmbH and/or licensed to Camunda Services GmbH
 * under one or more contributor license agreements. See the NOTICE file
 * distributed with this work for additional information regarding copyright
 * ownership.
 *
 * Camunda licenses this file to you under the MIT; you may not use this file
 * except in compliance with the MIT License.
 */

import React, { Fragment, PureComponent } from 'camunda-modeler-plugin-helpers/react';
import { Fill } from 'camunda-modeler-plugin-helpers/components';

import ConfigModal from './ConfigModal';

const defaultState = {
  enabled: false,
  interval: 5,
  configOpen: false
};

export default class AutoSavePlugin extends PureComponent {
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

    config.getForPlugin('autoSave', 'config')
      .then(config => this.setState(config));

    subscribe('app.activeTabChanged', ({ activeTab }) => {
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
    const {
      displayNotification,
      triggerAction
    } = this.props;

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
      this.props.config.setForPlugin('autoSave', 'config', newConfig)
        .catch(console.error);

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

    return <Fragment>
      <Fill slot="toolbar" group="9_autoSave">
        <button type="button" onClick={() => this.setState({ configOpen: true })}>
          Configure autosave
        </button>
      </Fill>
      { this.state.configOpen && (
        <ConfigModal
          onClose={ this.handleConfigClosed }
          initValues={ initValues }
        />
      )}
    </Fragment>
  }
}
