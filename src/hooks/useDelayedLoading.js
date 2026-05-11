import { useState, useCallback, useRef, useEffect } from 'react';

const MIN_LOADING_TIME = 100;

export const useDelayedLoading = (initialState = false) => {
  const [isLoading, setIsLoading] = useState(initialState);
  const timeoutRef = useRef(null);
  const startTimeRef = useRef(null);

  const startLoading = useCallback(() => {
    startTimeRef.current = Date.now();
    setIsLoading(true);
  }, []);

  const finishLoading = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    const elapsed = Date.now() - (startTimeRef.current || Date.now());
    const remainingDelay = Math.max(0, MIN_LOADING_TIME - elapsed);

    timeoutRef.current = setTimeout(() => {
      setIsLoading(false);
      startTimeRef.current = null;
    }, remainingDelay);
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return { isLoading, startLoading, finishLoading };
};

export const useAsyncWithLoader = (asyncFn, dependencies = []) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const execute = useCallback(async (...args) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await asyncFn(...args);
      setData(result);
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, dependencies);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
  }, []);

  return { isLoading, error, data, execute, reset };
};

export default useDelayedLoading;