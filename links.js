import { ACTIVITY_FEED_SCREEN, APP_STACK, ARTICLES_HOME, ARTICLE_DETAILS, BUZZ_SCREEN, CALENDAR_SCREEN, CHANNEL_SCREEN, CURATED_DETAILS, CURATED_SCREEN, FEED_STACK, MORE_SCREEN, NOT_FOUND_ROUTE, PERSON_SCREEN, PILOTS_SCREEN, PROFILE_SCREEN, RATINGS_SCREEN, SEARCH_SCREEN, SHOW_DETAIL_SCREEN, SHOW_EPISODE_SCREEN, SHOW_STACK, SOCIAL_CHARTS_SCREEN, TAB_NAVIGATOR, TRACKER_SCREEN, USER_NAVIGATION, USER_SETTINGS_SCREEN, VIEW_USER_PROFILE, YAPIM_SCREEN } from './screens';

const deepLinkConfig = {
  screens: {
    [APP_STACK]: {
      initialRouteName: TAB_NAVIGATOR,
      screens: {
        [TAB_NAVIGATOR]: {
          screens: {
            [CALENDAR_SCREEN]: {
              path: 'calendar',
            },
            [TRACKER_SCREEN]: {
              path: 'tracker',
            },

            [FEED_STACK]: {
              initialRouteName: ARTICLES_HOME,

              screens: {
                [ARTICLES_HOME]: {
                  path: 'news',
                },

                [CURATED_SCREEN]: {
                  path: 'curated',
                },
                [PILOTS_SCREEN]: {
                  path: 'coming-soon',
                },
              },
            },
          },
        },

        [SEARCH_SCREEN]: {
          path: 'explore',
        },

        [CURATED_DETAILS]: {
          path: 'curated/:slug',
          parse: {
            slug: (slug) => `${slug}`,
          },
        },
        [CHANNEL_SCREEN]: {
          path: 'network/:slug',
          parse: {
            slug: (slug) => `network/${slug}`,
          },
        },
        [YAPIM_SCREEN]: {
          path: 'studio/:slug',
          parse: {
            slug: (slug) => `studio/${slug}`,
          },
        },
        [VIEW_USER_PROFILE]: {
          screens: {
            [PROFILE_SCREEN]: {
              path: 'user/:slug/:tab?',
              parse: {
                slug: (slug) => `${slug}`,
              },
            },
          },
        },
        [SHOW_EPISODE_SCREEN]: {
          path: 'show/:slug/season-:sezon/episode-:bolum',
          parse: {
            sezon: Number,
            bolum: Number,
          },
        },

        [SHOW_STACK]: {
          screens: {
            [SHOW_DETAIL_SCREEN]: {
              path: 'show/:slug/:tab?',
              parse: {
                slug: (slug) => `${slug}`,
              },
            },
          },
        },

        [MORE_SCREEN]: {
          screens: {
            [USER_SETTINGS_SCREEN]: {
              path: 'settings/:slug?',
            },
            [RATINGS_SCREEN]: {
              path: 'ratings',
            },
            [ACTIVITY_FEED_SCREEN]: {
              path: 'activity',
            },
            [BUZZ_SCREEN]: {
              path: 'tv-renewals-cancellations',
            },
            [SOCIAL_CHARTS_SCREEN]: {
              path: 'charts/:slug?',
              parse: {
                slug: (slug) => `${slug}`,
              },
            },
          },
        },
        [PERSON_SCREEN]: {
          path: 'person/:slug',
          parse: {
            slug: (slug) => `${slug}`,
          },
        },
        [ARTICLE_DETAILS]: {
          path: 'article/:slug',
          parse: {
            slug: (slug) => `${slug}`,
          },
        },
      },
    },
    [NOT_FOUND_ROUTE]: '*',
  },
};

export default deepLinkConfig;
