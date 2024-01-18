/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { GmStoreHooks, useGmActions } from './gm.store';
import { useQueryInitMiniData } from './useQuery';
import { QueryClient, QueryClientProvider } from 'react-query';

import { setConfig } from '@ctrlshiftbryan/nerd-types';
import { NerdButton, NerdText } from '@ctrlshiftbryan/nerd-core-rn';
type OwnProps = {
  context: Types.Context;
  actions: Types.Actions;
  entitlements: Types.Entitlements;
  events: Types.Events;
};

setConfig({
  enablePersist: true,
  // build: 'c',
  // gmApiUrl: 'http://192.168.1.177:3333',
  // gmAppLinkUrl: 'http://192.168.1.177:1234',
});
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
  const testValue = GmStoreHooks.useTestValue();

  const setTestValue = useGmActions().setTest;

  const queryClient = new QueryClient();

  return (
    <ErrorBoundary context={{}}>
      <QueryClientProvider client={queryClient}>
        <GetData context={context}>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <BottomSheetModalProvider>
              <RN.View style={styles.container}>
                <Animated.View
                  style={{ width, height: 100, backgroundColor: 'violet' }}
                />
                <NerdButton onPress={handlePress}>Click Me</NerdButton>
                <NerdText color="text-core_grey">
                  Hello {context?.user?.display_name}
                </NerdText>
                <Sleeper.Text style={styles.text}>
                  Test Value: {testValue}
                </Sleeper.Text>
                <RN.Button
                  onPress={() => {
                    setTestValue(new Date().toString());
                  }}
                  title="Set Value"
                />
                <RN.Button
                  onPress={handlePresentModalPress}
                  title="Present Modal"
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
        </GetData>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

function GetData({
  children,
  context,
}: {
  children: any;
  context: Types.Context;
}) {
  const initData = useQueryInitMiniData(context?.user, 'ok', 1);
  return (
    <>
      <Sleeper.Text style={styles.text}>
        Query Status: {initData.status}
      </Sleeper.Text>
      {children}
    </>
  );
}

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
