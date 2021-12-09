/* eslint-disable no-unused-vars */
import React, { useState } from 'camunda-modeler-plugin-helpers/react';
import { Overlay, Section } from 'camunda-modeler-plugin-helpers/components';

const OFFSET = { right: 0 };

// we can even use hooks to render into the application
export default function ConfigOverlay({ anchor, initValues, onClose }) {
  const [ enabled, setEnabled ] = useState(initValues.enabled);
  const [ interval, setAutoSaveInterval ] = useState(initValues.interval);

  const onSubmit = () => onClose({ enabled, interval });

  // we can use the built-in styles, e.g. by adding "btn btn-primary" class names
  return (
    <Overlay anchor={ anchor } onClose={ onClose } offset={ OFFSET }>
      <Section>
        <Section.Header>Auto save configuration</Section.Header>

        <Section.Body>
          <form id="autoSaveConfigForm" onSubmit={ onSubmit }>
            <div class="form-group">
              <div class="custom-control custom-checkbox">
                <input
                  name="enabled"
                  className="custom-control-input"
                  id="enabled"
                  type="checkbox"
                  onChange={ () => setEnabled(!enabled) }
                  value={ enabled }
                  defaultChecked={ enabled } />
                <label className="custom-control-label" htmlFor="enabled">
                  Enabled
                </label>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="interval">Interval (seconds)</label>
              <input
                type="number"
                className="form-control"
                name="interval"
                min="1"
                value={ interval }
                onChange={ (event) =>
                  setAutoSaveInterval(Number(event.target.value))
                }
              />
            </div>
          </form>

          <Section.Actions>
            <button
              type="submit"
              className="btn btn-primary"
              form="autoSaveConfigForm"
            >
              Save
            </button>
          </Section.Actions>
        </Section.Body>
      </Section>
    </Overlay>
  );
}

