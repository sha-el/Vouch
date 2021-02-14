import { gql } from 'apollo-boost';

export const LoginMutation = gql`
  mutation Login($email: String!, $password: String!, $application: String!) {
    login(email: $email, password: $password, application: $application)
  }
`;

export const AdduserMutation = gql`
  mutation AdduserMutation($user: UserMutationInput!) {
    addUser(user: $user) {
      id
      email
    }
  }
`;

export const SignUpMutation = gql`
  mutation SignUp($user: UserMutationInput!, $password: String!) {
    signUp(user: $user, password: $password) {
      id
    }
  }
`;

export const UserDetailQuery = gql`
  query UserDetails($id: ObjectId!) {
    user(id: $id) {
      id
      email
      firstName
      middleName
      lastName
      lastLogin
      permissions
      groups
      image
      applications
      groupsEdge {
        edges {
          id
          name
          permissions
          updatedAt
        }
      }
      applicationEdge {
        edges {
          id
          name
        }
      }
      permissions
    }
  }
`;

export const MeQuery = gql`
  query Me {
    me {
      id
      email
      firstName
      middleName
      lastName
      lastLogin
      permissions
      groupsEdge {
        edges {
          id
          name
          permissions
          updatedAt
        }
      }
      organizationEdge {
        edges {
          id
          name
          address
          contact
          gstCode
          gstRate
          hsnCode
          amtPerPointSale
          amtReady
          features
          updatedAt
        }
      }
    }

    currentOrganization {
      id
      name
      address
      contact
      gstCode
      gstRate
      hsnCode
      amtPerPointSale
      amtReady
      features
      updatedAt
    }
  }
`;

export const AddGroupsToUserMutation = gql`
  mutation AddGroupsToUserMutation($userId: String!, $groups: [String]!) {
    addGroupToUser(userId: $userId, group: $groups) {
      id
    }
  }
`;

export const UpdateUserPermissionsMutation = gql`
  mutation UpdateUserPermissionsMutation($userId: String!, $permissions: [String!]!) {
    addPermissionToUser(userId: $userId, permission: $permissions) {
      id
    }
  }
`;

export const UpdatePasswordMutation = gql`
  mutation UpdatePasswordMutation($userId: String!, $password: String!) {
    updatePassword(userId: $userId, password: $password) {
      id
    }
  }
`;

export const UserDropDownQuery = gql`
  query UserDropDownQuery($email: String!) {
    userEdge(emailIContains: $email, first: 5) {
      edges {
        id
        firstName
        lastName
        email
      }
    }
  }
`;

export const AddUserToApp = gql`
  mutation AddUserToApp($userId: String!, $app: String!) {
    addApplicationToUser(userId: $userId, applicationId: $app) {
      id
    }
  }
`;

export const RemoveAppFromUser = gql`
  mutation RemoveUserFromApp($userId: String!, $app: String!) {
    removeApplicationFromUser(userId: $userId, applicationId: $app) {
      id
    }
  }
`;

export const UserListQuery = gql`
  query UserListQuery($first: Int, $offset: Int, $email: String) {
    userEdge(first: $first, offset: $offset, emailIContains: $email) {
      count
      edges {
        id
        email
        firstName
        middleName
        lastName
        applications
        lastLogin
        permissions
        groups
        image
        defaultOrganization {
          id
          name
        }
        updatedAt
      }
    }
  }
`;
