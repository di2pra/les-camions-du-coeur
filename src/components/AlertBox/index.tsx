import React, { FC, memo } from 'react';

import { SystemAlert, SystemAlertTypes } from './types/SystemAlert';

interface Props {
  systemAlert: SystemAlert | null;
}

const AlertBox: FC<Props> = ({ systemAlert }) => {
  if(!systemAlert) {
    return null;
  }

  if (!(systemAlert.type in SystemAlertTypes)) {
    return null;
  }

  return (
    <div className="alert-container">
      <div className={'alert alert-' + systemAlert.type}>{systemAlert.message || 'Une erreur est survenue'}</div>
    </div>
  );
};

export default memo(AlertBox);