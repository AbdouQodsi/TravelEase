import { useState, useCallback } from 'react';

export type LoadingState = {
  isLoading: boolean;
  isError: boolean;
  errorMessage: string;
};

export const useLoadingState = (initialState: Partial<LoadingState> = {}) => {
  const [state, setState] = useState<LoadingState>({
    isLoading: false,
    isError: false,
    errorMessage: '',
    ...initialState,
  });

  const startLoading = useCallback(() => {
    setState({
      isLoading: true,
      isError: false,
      errorMessage: '',
    });
  }, []);

  const setError = useCallback((message: string = 'Something went wrong') => {
    setState({
      isLoading: false,
      isError: true,
      errorMessage: message,
    });
  }, []);

  const reset = useCallback(() => {
    setState({
      isLoading: false,
      isError: false,
      errorMessage: '',
    });
  }, []);

  return {
    ...state,
    startLoading,
    setError,
    reset,
  };
};

export default useLoadingState;