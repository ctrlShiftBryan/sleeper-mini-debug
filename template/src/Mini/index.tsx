/* eslint-disable react-native/no-inline-styles */
import * as RN from 'react-native';
import React, { useCallback, useMemo, useRef } from 'react';
import { Types, Sleeper, Fonts, Theme } from '@sleeperhq/mini-core';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import Animated, { useSharedValue } from 'react-native-reanimated';
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

type OwnProps = {
  context: Types.Context;
  actions: Types.Actions;
  entitlements: Types.Entitlements;
  events: Types.Events;
};

const Mini = (props: OwnProps) => {
  const { context } = props;
  const width = useSharedValue(100);

  const handlePress = () => {
    width.value = width.value + 10;
  };

  // ref
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  // variables
  const snapPoints = useMemo(() => ['25%', '50%'], []);

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);

  return (
    <ErrorBoundary context={{}}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <BottomSheetModalProvider>
          <RN.View style={styles.container}>
            <Animated.View
              style={{ width, height: 100, backgroundColor: 'violet' }}
            />
            <RN.Button onPress={handlePress} title="Click me" />
            <Sleeper.Text style={styles.text}>
              Hello {context?.user?.display_name}
            </Sleeper.Text>

            <RN.Button
              onPress={handlePresentModalPress}
              title="Present Modal"
              color="black"
            />
            <BottomSheetModal
              ref={bottomSheetModalRef}
              index={1}
              snapPoints={snapPoints}
              onChange={handleSheetChanges}>
              <RN.View style={styles.contentContainer}>
                <RN.Text>Awesome 🎉</RN.Text>
              </RN.View>
            </BottomSheetModal>
          </RN.View>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
};

const styles = RN.StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
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
