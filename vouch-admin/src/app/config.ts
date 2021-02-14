import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { notify } from 'sha-el-design/lib';

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach((v) => console.error(v));

    if (graphQLErrors.some((v) => v.extensions?.code === 401)) {
      localStorage.clear();
      location.href = '/';
    }
  }

  if (networkError) {
    notify({
      type: 'error',
      title: 'Unable to reach our servers',
      message: 'Please check your internet connection',
    });
  }
});

export const _client = () =>
  new ApolloClient({
    link: from([
      errorLink,
      createHttpLink({
        uri: process.env.AUTH_HOST || '/api/graphql',
        headers: { Token: sessionStorage.getItem('token') || localStorage.getItem('token') || '' },
      }),
    ]),
    cache: new InMemoryCache(),
  });

export const LOGIN_URL = '/api/login';
export const LOGOUT_URL = '/api/logout';
export const client = _client();
