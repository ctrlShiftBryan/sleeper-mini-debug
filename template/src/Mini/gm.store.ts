/* eslint-disable @typescript-eslint/no-unused-vars */
import { create } from 'zustand';
import { combine, createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

type TestingState = {
  test: string;
};

const gmState: TestingState = { test: 'this is a test' };

// DO NOT EXPORT THIS
const storeActions = (
  set: (
    partial:
      | TestingState
      | Partial<TestingState>
      | ((state: TestingState) => TestingState | Partial<TestingState>),
    replace?: boolean | undefined,
  ) => void,
) => ({
  actions: {
    setTest: (value: string) => set(state => ({ ...state, test: value })),
  },
});

const createStore = (withPersist: boolean) => {
  if (withPersist) {
    return create(
      persist(combine(gmState, storeActions), {
        name: 'testing-state',
        storage: createJSONStorage(() => AsyncStorage),
        partialize: state => {
          const { actions: _actions, ...rest } = state;
          return rest;
        },
      }),
    );
  }
  return create(combine(gmState, storeActions));
};

const usePersist = false;
const useGmStore = createStore(usePersist);

const useTestValue = () => useGmStore(state => state.test);

export const GmStoreHooks = {
  useTestValue,
};

export const useGmActions = () => useGmStore(state => state.actions);
