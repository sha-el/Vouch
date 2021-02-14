import { client } from '../config';
import { AddOrganizationMutation } from '../gql/organization';
import { OrganizationMutationInput } from '../typings/Organization';
import { MutationRoot } from '../typings/schema';

export function createOrganization(organization: OrganizationMutationInput) {
  return client.mutate<Pick<MutationRoot, 'addOrganization'>>({
    mutation: AddOrganizationMutation,
    variables: { organization },
    errorPolicy: 'all',
  });
}
