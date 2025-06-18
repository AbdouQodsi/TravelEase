import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

type LoadingOverlayProps = {
  isLoading?: boolean;
  isError?: boolean;
  errorMessage?: string;
  onRetry?: () => void;
};

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isLoading = false,
  isError = false,
  errorMessage = 'Something went wrong',
  onRetry,
}) => {
  if (!isLoading && !isError) return null;

  return (
    <View style={styles.container}>
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6C63FF" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      )}
      
      {isError && (
        <View style={styles.errorContainer}>
          <Feather name="alert-circle" size={50} color="#FF6B6B" />
          <Text style={styles.errorText}>{errorMessage}</Text>
          {onRetry && (
            <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
              <Feather name="refresh-cw" size={16} color="#FFF" />
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingContainer: {
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  errorContainer: {
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    flexDirection: 'row',
    backgroundColor: '#6C63FF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: 'center',
  },
  retryText: {
    color: '#FFF',
    marginLeft: 8,
    fontWeight: '500',
  },
});

export default LoadingOverlay;