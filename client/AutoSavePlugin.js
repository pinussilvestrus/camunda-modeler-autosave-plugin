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
import { Fill, Modal } from 'camunda-modeler-plugin-helpers/components';


/**
 * An extension that shows how to hook into
 * editor events to accomplish the following:
 *
 * - hook into <bpmn.modeler.configure> to provide a bpmn.modeler extension
 * - hook into <bpmn.modeler.created> to register for bpmn.modeler events
 * - hook into <tab.saved> to perform a post-safe action
 *
 */
export default class AutoSavePlugin extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      enabled: false
    };
  }

  componentDidMount() {
    const {
      subscribe
    } = this.props;

    subscribe('app.activeTabChanged', () => {
      this.clearTimer();
      this.state.enabled && this.setupTimer();
    });
  }

  componentDidUpdate(_, prevState) {
    if (!this.state.enabled) {
      this.clearTimer();
    }

    if (!prevState.enabled && this.state.enabled) {
      this.setupTimer();
    }
  }

  setupTimer() {
    this.timer = setTimeout(() => {
      this.save();
      this.setupTimer();
    }, 10000);
  }

  clearTimer() {
    this.timer && clearTimeout(this.timer);
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

        return displayNotification({ title: 'Autosaved', duration: 1500 });
      });
  }

  render() {
    return <Fragment>
      <Fill slot="toolbar">
        <button type="button" onClick={() => this.setState({ enabled: !this.state.enabled })}>
          { `Autosave: ${this.state.enabled ? 'On' : 'Off'} ` }
        </button>
      </Fill>
    </Fragment>
  }
}
