/* eslint-disable no-catch-shadow */
/* eslint-disable react-native/no-inline-styles */
import { getConfig } from '@ctrlshiftbryan/nerd-types';
import React from 'react';
import { Text, View } from 'react-native';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  context: any;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  info: React.ErrorInfo | null;
  responseKey: string | null;
}

interface FallbackUIProps {
  error: Error | null;
  info: React.ErrorInfo | null;
  errorKey: string | null;
}

const FallbackUI: React.FC<FallbackUIProps> = ({ error, errorKey }) => (
  <View>
    <Text
      style={{
        color: 'white',
        padding: 12,
        margin: 12,
        marginBottom: 0,
        paddingBottom: 0,
        fontSize: 24,
      }}>
      Could Not Load League
    </Text>
    <Text style={{ color: 'white', padding: 12, margin: 12 }}>
      An error occurred: {error?.message}
    </Text>

    {errorKey && (
      <Text
        style={{
          color: 'white',
          padding: 12,
          margin: 12,
          paddingTop: 0,
          marginTop: 0,
        }}>
        key: {errorKey}
      </Text>
    )}
  </View>
);

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = {
    hasError: false,
    error: null,
    info: null,
    responseKey: null,
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error, info: null, responseKey: null };
  }

  async componentDidCatch(error: Error, info: React.ErrorInfo): Promise<void> {
    const { gmApiUrl, version, build } = getConfig();
    // log error to an error reporting service
    const data = {
      error,
      context: this.props.context,
      msg: error?.message,
      name: error?.name,
      version,
      build,
    };

    try {
      const response = await fetch(gmApiUrl + '/debug', {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        this.setState({ info });
      }

      const responseData = await response.json();
      console.log(response);

      console.log(responseData);
      this.setState({ info, responseKey: responseData.key }); // Set responseKey with the key from the response
    } catch (_error) {
      this.setState({ info });
      // Optionally set state with error info or handle error as needed
    }
    this.setState({ info });
  }

  render(): React.ReactNode {
    return this.state.hasError ? (
      <FallbackUI
        error={this.state.error}
        info={this.state.info}
        errorKey={this.state.responseKey}
      />
    ) : (
      this.props.children
    );
  }
}
