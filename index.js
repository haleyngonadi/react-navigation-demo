import { APP_STACK, AUTH_STACK, MORE_SCREEN, NOT_FOUND_ROUTE, PROFILE_SCREEN, SHOW_DETAIL_SCREEN, SHOW_STACK, TAB_NAVIGATOR, USER_SETTINGS_SCREEN, VIEW_USER_PROFILE } from 'constants/screens';
import { Linking, Platform, View } from 'react-native';
import { Loading, Modal } from '@/components';
import { NavigationContainer, getStateFromPath } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { useLayout, useSession, useTheme } from '@/hooks';

import AppNavigator from './AppStack';
import AuthNavigator from './auth-navigator';
import ButtonHeader from '@/components/ButtonHeader';
import HeaderBackGround from '@/components/HeaderBackGround';
import NotFoundScreen from '@/screens/pages/404';
import RNBootSplash from 'react-native-bootsplash';
import Toaster from '@/components/Toaster';
import { createStackNavigator } from '@react-navigation/stack';
import deepLinkConfig from '@/constants/links';
import messaging from '@react-native-firebase/messaging';
import { navigationRef } from '@/utils/navigators';
import { setDefaultTheme } from '@/reducers/themeReducer';
import { useSelector } from 'react-redux';

const Stack = createStackNavigator();

const Navigation = () => {
  const { NavigationTheme, Layout, Common, Colors } = useTheme();
  const { isLogged } = useSession();
  const { width, height } = useLayout();

  const { modalVisible } = useSelector((state) => state.settings);

  useEffect(() => {
    init();
  });
  /**
   * Show the animation
   */
  const init = async () => {
    await setDefaultTheme({ theme: 'default_dark', darkMode: true });
    RNBootSplash.hide({ fade: true }); // hide the bootsplash immediately, without any fade
  };

  const linking = {
    prefixes: ['https:/site.com', 'site://'],
    config: deepLinkConfig,
    async getInitialURL() {
      const message = await messaging().getInitialNotification();
      if (message?.data?.url) {
        return message.data.url;
      } else if (message?.data?.link) {
        return message.data.link;
      }
      // As a fallback, you may want to do the default deep link handling
      const url = await Linking.getInitialURL();

      return url;
    },
    subscribe(listener) {
      // Listen to incoming links from deep linking
      const linkingSubscription = Linking.addEventListener('url', ({ url }) => {
        listener(url);
      });

      // Listen to firebase push notifications
      const unsubscribeNotification = messaging().onNotificationOpenedApp((message) => {
        if (message?.data?.url) {
          listener(message?.data?.url);
        } else if (message?.data?.link) {
          listener(message?.data?.link);
        }
      });

      return () => {
        // Clean up the event listeners
        unsubscribeNotification();
        linkingSubscription.remove();
      };
    },
    getStateFromPath: (path, options) => {
      // replace the "main" part of the route, keeping the "params" part intact
      // e.g. 'me?showName=true' -> 'user?showName=true'
      // if (path.includes('me')) {
      //   path = path.replace('me', 'user');
      // }
      console.log('path', path);
      return getStateFromPath(path, options);
    },
  };

  return (
    <>
      <NavigationContainer ref={navigationRef} theme={NavigationTheme} linking={linking}>
        <Stack.Navigator
          screenOptions={{ headerShown: false }}
          initialRouteName={isLogged ? APP_STACK : AUTH_STACK} // @demo
        >
          <Stack.Screen
            name={NOT_FOUND_ROUTE}
            component={NotFoundScreen}
            options={{
              headerShown: true,
              title: null,
              headerBackground: () => <HeaderBackGround width={width} height={height} rounded={false} />,
              headerLeft: () => <ButtonHeader />,
            }}
          />
          {!isLogged ? (
            <Stack.Screen
              name={AUTH_STACK}
              component={AuthNavigator}
              options={{
                animationTypeForReplace: !isLogged ? 'pop' : 'push',
              }}
            />
          ) : (
            <Stack.Screen
              name={APP_STACK}
              component={AppNavigator}
              options={{
                animationEnabled: false,
              }}
            />
          )}
        </Stack.Navigator>
      </NavigationContainer>
      <Toaster />
      <Modal visible={modalVisible} closeable={false} transparent={true}>
        <View style={[Layout.center, Layout.fill, Common.overlay]}>
          <View style={[Common.regularRadius, Layout.center, { width: 80, height: 80, backgroundColor: Colors.white }]}>
            <Loading size='large' />
          </View>
        </View>
      </Modal>
    </>
  );
};

export default Navigation;
