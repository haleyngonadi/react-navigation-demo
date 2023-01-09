import {
  ARTICLE_DETAILS,
  CHANNEL_SCREEN,
  COMMENTS,
  CURATED_DETAILS,
  EDIT_LIST_SCREEN,
  EPISODE_SCREEN,
  MORE_SCREEN,
  NOTIFY_SCREEN,
  ONBOARDING_STACK,
  PAYWALL_SCREEN,
  PERSON_SCREEN,
  PILOT_DETAILS,
  REVIEW_DETAIL_SCREEN,
  SEARCH_SCREEN,
  SHOW_DETAIL_SCREEN,
  SHOW_EPISODE_SCREEN,
  SHOW_RELATED_SCREEN,
  SHOW_STACK,
  TAB_NAVIGATOR,
  USER_LIST_SCREEN,
  VIEW_USER_PROFILE,
  WEB_VIEW_SCREEN,
  YAPIM_SCREEN,
} from 'constants/screens';
import { ArticleDetail, PilotDetail } from '@/screens/news';
import { CuratedDetail, Welcome } from '@/screens/pages';
import { HeaderTitle, Logo } from '@/components';
import {
  LIST_TAB_SCREEN,
  LIST_USERS_SCREEN,
  SHOW_LIST_VIEW,
} from 'constants/screens';
import {
  ListTabs,
  Person,
  Profile,
  Search,
  Show,
  ShowList,
  UserList,
  UserNotifications,
} from 'screens';
import React, { useEffect } from 'react';
import {
  TransitionPresets,
  createStackNavigator,
} from '@react-navigation/stack';
import { fetchToken, setUser } from '@/reducers/session-reducer';
import { getUser, registerDevice, setupPurchases } from '@/actions/authActions';
import { useIsMounted, useSession, useTheme } from '@/hooks';

import ButtonHeader from '@/components/ButtonHeader';
import CommentStack from '../comment-stack';
import { EditList } from '@/screens/users/lists';
import EpisodeDetail from 'screens/episodes/EpisodeDetail';
import HeaderBackGround from '@/components/HeaderBackGround';
import { IS_IOS } from '@/constants';
import { Icon } from 'components';
import { ListDetail } from '@/screens';
import MoreNavigator from '../MoreNavigator';
import OpenWebView from '@/screens/pages/WebScene';
import Page from '@/screens/pages/Page';
import PaywallScreen from '@/screens/subscription';
import ProfileStack from '../ProfileStack';
import ReviewDetails from '@/screens/shows/reviews/ReviewDetail';
import ShowStack from '../show-stack';
import SvgBell from '@/assets/svgs/SvgBell';
import SvgSearch from '@/assets/svgs/SvgSearch';
import TabNavigator from './TabNavigator';
import { fetchSubscription } from '@/actions/user-actions';
import { store } from '@/store';
import { styles as theme } from 'styles/theme';
import { useAlert } from '@/contexts/AlertContext';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

const Stack = createStackNavigator();
const AppStack = () => {
  const { Colors, darkMode, Layout, Common } = useTheme();
  const { goBack, navigate } = useNavigation();
  const { is_onboarding, deviceInfo, isLogged } = useSession();
  const alert = useAlert();
  const { t } = useTranslation();
  const isMounted = useIsMounted();
  useEffect(() => {
    if (isLogged) {
      getUser(false)
        .then(user => {
          store.dispatch(setUser({ user }));
          if (deviceInfo && deviceInfo.token) {
            registerDevice(deviceInfo).then(() => {});
          }
          // TODO: Fetch notifications if user isn't susbcribed already
          setupPurchases(user.hashid).then(() => {
            store.dispatch(fetchSubscription());
          });
        })
        .catch(({ error }) => {
          if (error?.message) {
            alert.showAlert({
              type: 'error',
              message: error.message,
            });
          } else {
            alert.showAlert({
              type: 'error',
              message: t('errors.default'),
            });
          }
        });
    }
  }, [isLogged]);
  const DefaultNavigatorConfig = {
    initialRouteName: is_onboarding ? ONBOARDING_STACK : TAB_NAVIGATOR,
    header: null,
    //...HEADER_OPTIONS,
    screenOptions: {
      headerShown: false,
      headerMode: 'screen',
      headerTintColor: 'white',
    },
  };

  const defaultOptions = {
    headerTintColor: Colors.text,
    headerTransparent: false,
    headerShown: true,
    headerStyle: [Common.bgShadow],

    //...TransitionPresets.ModalFadeTransition,

    headerLeft: () => <ButtonHeader />,
  };

  const popupOptions = {
    headerShown: false,
    gestureEnabled: true,
    ...TransitionPresets.ModalPresentationIOS,
  };

  const fadeOptions = {
    ...TransitionPresets.ModalFadeTransition,
  };

  return (
    <Stack.Navigator {...DefaultNavigatorConfig}>
      <Stack.Screen
        name={ONBOARDING_STACK}
        component={Welcome}
        options={{ ...fadeOptions }}
      />
      <Stack.Screen
        name={TAB_NAVIGATOR}
        component={TabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={PAYWALL_SCREEN}
        component={PaywallScreen}
        options={{ ...TransitionPresets.ModalSlideFromBottomIOS }}
      />
      <Stack.Screen name={MORE_SCREEN} component={MoreNavigator} />
      <Stack.Screen
        name={ARTICLE_DETAILS}
        component={ArticleDetail}
        options={{
          headerShown: true,
          headerTitleAlign: 'center',
          title: null,
        }}
      />
      <Stack.Screen name={PILOT_DETAILS} component={PilotDetail} />
      <Stack.Screen
        name={WEB_VIEW_SCREEN}
        component={OpenWebView}
        options={{
          ...popupOptions,
          headerShown: true,
          headerLeft: () => <ButtonHeader color={Colors.text} />,
        }}
      />
      <Stack.Screen name={SHOW_DETAIL_SCREEN} component={Show} />
      <Stack.Screen
        name={SHOW_STACK}
        component={ShowStack}
        options={{ ...fadeOptions }}
      />
      <Stack.Screen
        name={SHOW_RELATED_SCREEN}
        component={Show}
        options={{ ...popupOptions }}
      />
      <Stack.Screen
        name={PERSON_SCREEN}
        component={Person}
        options={{ ...fadeOptions }}
      />
      <Stack.Screen
        name={SHOW_LIST_VIEW}
        component={ShowList}
        options={{
          ...popupOptions,
          headerShown: true,
          headerTitleAlign: 'center',
          headerBackground: () => <HeaderBackGround clear rounded={false} />,
          headerLeft: () => <ButtonHeader color={Colors.text} close />,
        }}
      />
      <Stack.Screen
        name={LIST_USERS_SCREEN}
        component={UserList}
        options={{
          headerStyle: {
            backgroundColor: Colors.GRAY_MEDIUM,
            shadowColor: 'transparent',
          },
          ...defaultOptions,
          headerLeft: () => <ButtonHeader color={Colors.text} />,
        }}
      />
      <Stack.Screen
        name={SEARCH_SCREEN}
        component={Search}
        options={{
          title: null,
          headerShown: true,
          headerTitleAlign: 'center',

          headerLeft: () => <ButtonHeader color={Colors.text} />,
          headerTitle: () => (
            <HeaderTitle color={Colors.text} title={t('commons.search')} />
          ),
          headerBackground: () => <HeaderBackGround clear rounded={false} />,
        }}
      />
      <Stack.Screen
        name={NOTIFY_SCREEN}
        component={UserNotifications}
        options={({ navigation }) => ({
          headerTitleAlign: 'center',
          headerShown: true,
          title: null,
          headerLeft: () => <ButtonHeader color={Colors.text} />,
          headerTitle: () => (
            <HeaderTitle color={Colors.text} title={t('notifications.title')} />
          ),
          headerBackground: () => <HeaderBackGround clear rounded={false} />,
        })}
      />
      <Stack.Screen
        name={EPISODE_SCREEN}
        component={EpisodeDetail}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name={SHOW_EPISODE_SCREEN}
        component={EpisodeDetail}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={LIST_TAB_SCREEN}
        component={ListTabs}
        options={{
          headerShown: true,
          headerBackground: () => <HeaderBackGround clear rounded={false} />,
          headerLeft: () => <ButtonHeader close />,
          ...defaultOptions,
        }}
      />
      <Stack.Screen
        name={EDIT_LIST_SCREEN}
        component={EditList}
        options={{
          ...popupOptions,
          headerShown: true,
          title: t('lists.edit_list.title'),
          headerBackground: () => <HeaderBackGround clear rounded={false} />,
          headerLeft: () => <ButtonHeader close />,
          ...defaultOptions,
        }}
      />
      <Stack.Screen
        name={COMMENTS}
        component={CommentStack}
        options={{
          headerShown: false,
          headerBackground: () => <HeaderBackGround />,
          headerLeft: () => <ButtonHeader />,
        }}
      />
      <Stack.Screen
        name={VIEW_USER_PROFILE}
        component={ProfileStack}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={YAPIM_SCREEN}
        component={Page}
        options={{
          ...defaultOptions,
          headerLeft: () => <ButtonHeader color="#FFF" />,
          headerBackground: () => <HeaderBackGround rounded={true} />,
          headerShown: true,
          headerTitleAlign: 'center',
        }}
      />

      <Stack.Screen
        name={CHANNEL_SCREEN}
        component={Page}
        options={{
          ...defaultOptions,
          headerLeft: () => <ButtonHeader color={Colors.text} />,
          headerBackground: () => <HeaderBackGround rounded={true} />,
          headerShown: true,
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        name={CURATED_DETAILS}
        component={CuratedDetail}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={USER_LIST_SCREEN}
        component={ListDetail}
        options={{
          headerShown: true,
          headerTitleAlign: 'center',
          ...defaultOptions,
          headerLeft: () => <ButtonHeader color={Colors.text} />,
          headerBackground: () => <HeaderBackGround clear rounded={false} />,
          headerTitle: () => (
            <HeaderTitle title={t('list', { count: 1 })} color={Colors.text} />
          ),
        }}
      />
      <Stack.Screen
        name={REVIEW_DETAIL_SCREEN}
        component={ReviewDetails}
        options={{
          headerShown: true,
          headerTitleAlign: 'center',
          ...defaultOptions,
          title: null,
          headerLeft: () => <ButtonHeader color={Colors.text} />,
          headerBackground: () => (
            <HeaderBackGround style={[Common.bgDefault]} rounded={false} />
          ),
        }}
      />
    </Stack.Navigator>
  );
};
export default AppStack;
