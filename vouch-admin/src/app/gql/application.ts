import { gql } from 'apollo-boost';

export const ApplicationListQuery = gql`
  query ApplicationListQuery($first: Int, $offset: Int, $name: String) {
    applicationEdge(first: $first, offset: $offset, nameIContains: $name) {
      count
      edges {
        id
        name
        withOrganization
        features
        permissions
        redirectUrl
        updatedAt
      }
    }
  }
`;

export const CreateApplicationMutation = gql`
  mutation CreateApplicationMutation($application: ApplicationMutationInput!) {
    addApplication(application: $application) {
      id
      name
      withOrganization
      features
      permissions
      redirectUrl
    }
  }
`;
