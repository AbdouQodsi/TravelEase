import React from 'react';
import { RefreshControl, ScrollView } from 'react-native';
import LoadingOverlay from './LoadingOverlay';
import useLoadingState from './useLoadingState';

// Higher-order component to add loading functionality to any page
export const withLoading = <P extends object>(
  Component: React.ComponentType<P>,
  loadDataFn?: (props: P) => Promise<void>
) => {
  return (props: P) => {
    const { 
      isLoading, 
      isError, 
      errorMessage, 
      startLoading, 
      setError, 
      reset 
    } = useLoadingState();
    const [refreshing, setRefreshing] = React.useState(false);

    // Load data on mount if loadDataFn is provided
    React.useEffect(() => {
      if (loadDataFn) {
        loadData();
      }
    }, []);

    // Function to load data
    const loadData = async () => {
      if (!loadDataFn) return;
      
      try {
        startLoading();
        await loadDataFn(props);
        reset();
      } catch (error) {
        setError('Failed to load data');
      }
    };

    // Handle pull-to-refresh
    const handleRefresh = async () => {
      if (!loadDataFn) return;
      
      setRefreshing(true);
      try {
        await loadDataFn(props);
        setRefreshing(false);
      } catch (error) {
        setRefreshing(false);
        setError('Failed to refresh data');
      }
    };

    return (
      <>
        <Component
          {...props}
          isLoading={isLoading}
          isError={isError}
          errorMessage={errorMessage}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          retryLoading={loadData}
        />
        <LoadingOverlay
          isLoading={isLoading && !refreshing}
          isError={isError}
          errorMessage={errorMessage}
          onRetry={loadData}
        />
      </>
    );
  };
};

// Wrapper component for ScrollView with pull-to-refresh
export const LoadingScrollView: React.FC<{
  children: React.ReactNode;
  onRefresh?: () => Promise<void>;
  refreshing?: boolean;
  [key: string]: any;
}> = ({ children, onRefresh, refreshing = false, ...props }) => {
  return (
    <ScrollView
      {...props}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#6C63FF']}
            tintColor="#6C63FF"
          />
        ) : undefined
      }
    >
      {children}
    </ScrollView>
  );
};

export default withLoading;