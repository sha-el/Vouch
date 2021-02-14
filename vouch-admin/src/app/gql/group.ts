import { gql } from 'apollo-boost';

export const GroupListQuery = gql`
  query GroupListQuery($first: Int!, $offset: Int!, $name: String) {
    groupEdge(first: $first, offset: $offset, nameIContains: $name) {
      count
      edges {
        id
        name
        updatedAt
        permissions
        features
        createdBy {
          email
          firstName
        }
      }
    }
  }
`;

export const CreateGroupMutation = gql`
  mutation AddGroup($group: GroupMutationInput!) {
    addGroup(group: $group) {
      id
    }
  }
`;
