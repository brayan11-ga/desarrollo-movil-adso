
import type { NavigatorScreenParams } from '@react-navigation/native';

export type Service = {
  id: string;
  name: string;
};

export type HomeStackParamList = {
  HomeList: undefined;
  HomeDetail: {
    id: string;
    name: string;
  };
};

export type RootTabParamList = {
  Home: NavigatorScreenParams<HomeStackParamList>;
  Favorites: undefined;
};
