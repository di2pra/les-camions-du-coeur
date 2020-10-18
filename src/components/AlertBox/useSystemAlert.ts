import { useCallback, useState } from "react";

import { SystemAlert, SystemAlertTypes } from "./types/SystemAlert";

export const useSystemAlert = () => {
  const [systemAlert, setSystemAlert] = useState<SystemAlert | null>(null);

  const setError = useCallback((message: string) =>
    setSystemAlert({
      type: SystemAlertTypes.ERROR,
      message
    }),
    []
  );

  const setSuccess = useCallback((message: string) =>
    setSystemAlert({
      type: SystemAlertTypes.SUCCESS,
      message
    }),
    []
  );

  const setWarning = useCallback((message: string) =>
    setSystemAlert({
      type: SystemAlertTypes.WARNING,
      message
    }),
    []
  );

  const setInfo = useCallback((message: string) =>
    setSystemAlert({
      type: SystemAlertTypes.INFO,
      message
    }),
    []
  );

  return {systemAlert, setError, setSuccess, setWarning, setInfo};
};
