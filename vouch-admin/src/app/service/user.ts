import { APP_ID, client, LOGIN_URL, LOGOUT_URL, _client } from '../config';
import {
  AddGroupsToUserMutation,
  UpdateUserPermissionsMutation,
  UpdatePasswordMutation,
  MeQuery,
  SignUpMutation,
  AdduserMutation,
  AddUserToApp,
  RemoveAppFromUser,
} from '../gql/user';
import { UserMutationInput, UserNode } from '../typings/user';
import { MutationRoot, QueryRoot } from '../typings/schema';

export async function login(email: string, password: string) {
  return fetch(LOGIN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      password,
      application: APP_ID() || process.env.REACT_APP_APP_ID,
    }),
  });
}

export async function logout(params: string) {
  localStorage.removeItem('token');
  sessionStorage.removeItem('token');
  localStorage.removeItem('user');
  await fetch(LOGOUT_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return (location.href = `/${params}`);
}

export async function me() {
  const resp = await _client().query<Pick<QueryRoot, 'me' | 'currentOrganization'>>({
    query: MeQuery,
    errorPolicy: 'all',
  });

  return new Promise<Pick<QueryRoot, 'me' | 'currentOrganization'>>((resolve, reject) => {
    if (resp.data) {
      localStorage.setItem('user', JSON.stringify(resp.data.me));
      localStorage.setItem('currentOrganization', JSON.stringify(resp.data.currentOrganization));
      resolve(resp.data);
    }

    if (resp.errors) {
      reject(resp.errors);
    }
  });
}

export function signUp(user: UserMutationInput, password: string) {
  return client.mutate<Pick<MutationRoot, 'signUp'>>({
    mutation: SignUpMutation,
    variables: { user, password },
    errorPolicy: 'all',
  });
}

export function addUser(user: UserMutationInput) {
  return client.mutate<Pick<MutationRoot, 'addUser'>>({
    mutation: AdduserMutation,
    variables: { user },
    errorPolicy: 'all',
  });
}

export function addGroupsToUser(userId: string, groups: string[]) {
  return client.mutate<Pick<MutationRoot, 'addGroupToUser'>>({
    mutation: AddGroupsToUserMutation,
    variables: { userId, groups },
    errorPolicy: 'all',
  });
}

export function addPermissionsToUser(userId: string, permissions: string[]) {
  return client.mutate<Pick<MutationRoot, 'addPermissionToUser'>>({
    mutation: UpdateUserPermissionsMutation,
    variables: { userId, permissions },
    errorPolicy: 'all',
  });
}

export function updatePassword(userId: string, password: string) {
  return client.mutate<Pick<MutationRoot, 'addPermissionToUser'>>({
    mutation: UpdatePasswordMutation,
    variables: { userId, password },
    errorPolicy: 'all',
  });
}

export function addApplicationToUser(userId: string, app: string) {
  return client.mutate<Pick<MutationRoot, 'addApplicationToUser'>>({
    mutation: AddUserToApp,
    variables: { userId, app },
    errorPolicy: 'all',
  });
}

export function removeApplicationFromUser(userId: string, app: string) {
  return client.mutate({
    mutation: RemoveAppFromUser,
    variables: { userId, app },
    errorPolicy: 'all',
  });
}

export function checkAccess(user: UserNode, permission: string[]) {
  if (!user) {
    return false;
  }

  const checkPermission = (permissions: string[]) => permissions.map((per) => permission.includes(per)).some((v) => v);

  return (
    user.groupsEdge?.edges.reduce((pv: boolean, cv) => pv || checkPermission(cv.permissions), false) ||
    checkPermission(user.permissions)
  );
}
