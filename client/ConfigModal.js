import React, { useCallback, useState } from 'camunda-modeler-plugin-helpers/react';
import { Modal } from 'camunda-modeler-plugin-helpers/components';


export default function ConfigModal({ initValues, onClose }) {
  const [ enabled, setEnabled ] = useState(initValues.enabled);
  const [ interval, setAutoSaveInterval ] = useState(initValues.interval);

  const onSubmit = useCallback(() => onClose({ enabled, interval }));

  return <Modal onClose={ onClose }>
    <Modal.Title>
      AutoSave Configuration
    </Modal.Title>

    <Modal.Body>
      <form id="autoSaveConfigForm" onSubmit={ onSubmit }>
        <p>
          <label>
            Enabled:
            <input
              type="checkbox"
              name="enabled"
              checked={ enabled }
              onChange={ () => setEnabled(!enabled) }
            />
          </label>
        </p>
        <p>
          <label>
            Interval (seconds):
            <input
              type="number"
              name="interval"
              value={ interval }
              onChange={ event => setAutoSaveInterval(Number(event.target.value)) }
            />
          </label>
        </p>
      </form>
    </Modal.Body>

    <Modal.Footer>
      <div id="autoSaveConfigButtons">
        <button type="submit" form="autoSaveConfigForm">Save</button>
        <button type="button" onClick={ () => onClose() }>Cancel</button>
      </div>
    </Modal.Footer>
  </Modal>
}

