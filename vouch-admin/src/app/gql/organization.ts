import { gql } from 'apollo-boost';

export const OrganizationListQuery = gql`
  query OrganizationListQuery($first: Int, $offset: Int, $name: String) {
    organizationEdge(first: $first, offset: $offset, nameIContains: $name) {
      count
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
        users
      }
    }
  }
`;

export const AddOrganizationMutation = gql`
  mutation AddOrganizationMutation($organization: OrganizationMutationInput!) {
    addOrganization(organization: $organization) {
      id
      name
      address
      contact
      gstCode
      gstRate
      hsnCode
      amtReady
      amtPerPointSale
      features
      updatedAt
      users
    }
  }
`;
