/* eslint-disable react-native/no-inline-styles */
import { Types } from '@sleeperhq/mini-core';
import React, { useCallback } from 'react';
import { SleeperMiniApp } from '@ctrlshiftbryan/nerd-core-rn';
import { setConfig } from '@ctrlshiftbryan/nerd-types';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
// import { Text, View } from 'react-native';

type OwnProps = {
  context: Types.Context;
};

setConfig({
  enablePersist: true,
  build: '.a6',
});

// gmApiUrl: 'http://192.168.1.177:3333',
// gmAppLinkUrl: 'http://192.168.1.177:1234',

function preload(ids: string[], map: any) {
  const safeMap = map || {};

  ids.map(id => safeMap[id]);
}

const Mini = (props: OwnProps) => {
  const { context } = props;
  const { actions } = context;
  // events.onBackButtonPressed = () => {
  //   // Handle the back button press
  //   // Return 'CONSUMED' if you took control of the action (and want the Sleeper app to do nothing)
  //   // Return 'PROPAGATE' if you took no action and want the event to continue (the Sleeper app will navigate back to the main mini list)
  //   return 'CONSUMED';
  // };

  // const keys = Object.keys(context);

  const keys2 = [
    'leaguesMap',
    'league',
    'user',
    'usersInLeagueMap',
    'rostersInLeagueMap',
    'draftsInLeagueMap',
    'draftPickTradesInLeagueMap',
    'playoffsInLeagueMap',
    'transactionsMap',
    'draftPicksInDraftMap',
    'userLeagueList',
    'leaguesMap',
    'userMap',
    'transactionsInLeagueMap',
  ];

  // todo get all league ids and read all leagues in transactions in leagues
  const leaguesMap = context.leaguesMap || {};
  const leagueIds = Object.keys(leaguesMap);
  const leagues = leagueIds.map(id => leaguesMap[id]);

  const activeLeagueIds = leagues.map(l => l.league_id);
  preload(activeLeagueIds, context.transactionsInLeagueMap);
  preload(activeLeagueIds, context.rostersInLeagueMap);
  preload(activeLeagueIds, context.usersInLeagueMap);
  preload(activeLeagueIds, context.draftsInLeagueMap);
  preload(activeLeagueIds, context.draftPickTradesInLeagueMap);

  const drafts = Object.values(context.draftsInLeagueMap || {}).flatMap(x => x);
  const draftIds = drafts.map(d => d.draft_id);
  preload(draftIds, context.draftPicksInDraftMap);

  const firstLeagueId = context.userLeagueList
    ? context.userLeagueList[0]
    : undefined;

  const defaultLeague = firstLeagueId ? leaguesMap[firstLeagueId] : undefined;

  const leagueToUse = context.league || defaultLeague;

  const nonProxy = {};
  keys2.forEach(key => {
    const obj = context[key];
    const keys3 = Object.keys(obj || {});
    const newObj = {};
    keys3.forEach(key3 => {
      const object3 = obj[key3];
      newObj[key3] = object3;
    });
    nonProxy[key] = newObj;
  });

  (nonProxy as any).league = leagueToUse;

  const openTrade = useCallback(
    (params: any) => {
      actions.navigate?.(params.type, params.data);
    },
    [actions],
  );

  return (
    <ErrorBoundary context={nonProxy}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SleeperMiniApp context={nonProxy} openTrade={openTrade} />
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
};

export default Mini;
