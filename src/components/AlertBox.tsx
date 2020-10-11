import React, { FC } from 'react';

import { Error } from '../types/Error';

const types = ["error", "success", "warning", "info"]

interface Props {
  error: Error | null;
}

const AlertBox: FC<Props> = ({error}) => {
  if(!error) {
    return null;
  }
    
  if (!types.includes(error.type)) {
    return null;
  }

  return (
    <div className="alert-container">
      <div className={'alert alert-' + error.type}>{error.message || 'Une erreur est survenue'}</div>
    </div>
  )
}

export default AlertBox;