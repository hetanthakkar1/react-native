/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @flow
 */

import type {RNTesterNavState, ComponentList} from '../types/RNTesterTypes';

export const RNTesterNavActionsType = {
  INIT_FROM_STORAGE: 'INIT_FROM_STORAGE',
  NAVBAR_PRESS: 'NAVBAR_PRESS',
  BOOKMARK_PRESS: 'BOOKMARK_PRESS',
  BACK_BUTTON_PRESS: 'BACK_BUTTON_PRESS',
  MODULE_CARD_PRESS: 'MODULE_CARD_PRESS',
  EXAMPLE_CARD_PRESS: 'EXAMPLE_CARD_PRESS',
};

const getUpdatedBookmarks = ({
  exampleType,
  key,
  bookmarks,
}: {
  exampleType: string,
  key: string,
  bookmarks: ComponentList,
}) => {
  const updatedBookmarks = bookmarks
    ? {...bookmarks}
    : {components: [], apis: []};

  if (updatedBookmarks[exampleType].includes(key)) {
    updatedBookmarks[exampleType] = updatedBookmarks[exampleType].filter(
      k => k !== key,
    );
  } else {
    updatedBookmarks[exampleType].push(key);
  }
  return updatedBookmarks;
};

const getUpdatedRecentlyUsed = ({
  exampleType,
  key,
  recentlyUsed,
}: {
  exampleType: string,
  key: string,
  recentlyUsed: ComponentList,
}) => {
  const updatedRecentlyUsed = recentlyUsed
    ? {...recentlyUsed}
    : {components: [], apis: []};

  let existingKeys = updatedRecentlyUsed[exampleType];

  if (existingKeys.includes(key)) {
    existingKeys = existingKeys.filter(k => k !== key);
  }
  existingKeys.unshift(key);

  updatedRecentlyUsed[exampleType] = existingKeys.slice(0, 5);

  return updatedRecentlyUsed;
};

export const RNTesterNavReducer = (
  state: RNTesterNavState,
  action: {type: string, data: any},
): RNTesterNavState => {
  switch (action.type) {
    case RNTesterNavActionsType.INIT_FROM_STORAGE:
      return action.data;
    case RNTesterNavActionsType.NAVBAR_PRESS:
      return {
        ...state,
        activeModuleKey: null,
        activeModuleTitle: null,
        activeModuleExampleKey: null,
        screen: action.data.screen,
      };
    case RNTesterNavActionsType.MODULE_CARD_PRESS:
      return {
        ...state,
        activeModuleKey: action.data.key,
        activeModuleTitle: action.data.title,
        activeModuleExampleKey: null,
        recentlyUsed: getUpdatedRecentlyUsed({
          exampleType: action.data.exampleType,
          key: action.data.key,
          recentlyUsed: state.recentlyUsed,
        }),
      };
    case RNTesterNavActionsType.EXAMPLE_CARD_PRESS:
      return {
        ...state,
        activeModuleExampleKey: action.data.key,
      };
    case RNTesterNavActionsType.BOOKMARK_PRESS:
      return {
        ...state,
        bookmarks: getUpdatedBookmarks({
          exampleType: action.data.exampleType,
          key: action.data.key,
          bookmarks: state.bookmarks,
        }),
      };
    case RNTesterNavActionsType.BACK_BUTTON_PRESS:
      // Go back to module or list
      return {
        ...state,
        activeModuleExampleKey: null,
        activeModuleKey:
          state.activeModuleExampleKey != null ? state.activeModuleKey : null,
        activeModuleTitle:
          state.activeModuleExampleKey != null ? state.activeModuleTitle : null,
      };
    default:
      throw new Error(`Invalid action type ${action.type}`);
  }
};
