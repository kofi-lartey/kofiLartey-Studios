import { useCallback } from 'react';
import { exportToCSV, exportToJSON } from '../utils/exportUtils';

const useExport = (filename = 'admin-export') => {
  const exportCSV = useCallback((rows, name = `${filename}.csv`) => {
    exportToCSV(rows, name);
  }, [filename]);

  const exportJSON = useCallback((data, name = `${filename}.json`) => {
    exportToJSON(data, name);
  }, [filename]);

  return { exportCSV, exportJSON };
};

export default useExport;
