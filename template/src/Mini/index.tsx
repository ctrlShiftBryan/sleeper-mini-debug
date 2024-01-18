import React from 'react';
import * as RN from 'react-native';
import { Types, Sleeper, Fonts, Theme } from '@sleeperhq/mini-core';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import { setConfig } from '@ctrlshiftbryan/nerd-types';

type OwnProps = {
  context: Types.Context;
  actions: Types.Actions;
  entitlements: Types.Entitlements;
  events: Types.Events;
};

setConfig({
  enablePersist: true,
  build: 'f',
  // gmApiUrl: 'http://192.168.1.177:3333',
  // gmAppLinkUrl: 'http://192.168.1.177:1234',
});

const Mini = (props: OwnProps) => {
  const { context } = props;

  return (
    <ErrorBoundary context={{}}>
      <RN.View style={styles.container}>
        <Sleeper.Text style={styles.text}>
          Hello {context?.user?.display_name}
        </Sleeper.Text>
        <Sleeper.Text style={styles.text}>
          Open app.json and select a sample to learn what API features are
          available. 1
        </Sleeper.Text>
        <Sleeper.Text style={styles.text}>
          When you're ready to get started, edit this file (src/Mini/index.tsx)
          and add your own code.
        </Sleeper.Text>
        <Sleeper.Text style={styles.text}>
          Feel free to copy any package from mini_packages.json to this
          project's package.json. They will be included in your final mini.
        </Sleeper.Text>
      </RN.View>
    </ErrorBoundary>
  );
};

const styles = RN.StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: Theme.primaryText,
    padding: 10,
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 10,
    margin: 5,
    ...Fonts.Styles.Body1,
  },
});

export default Mini;
