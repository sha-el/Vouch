import { client } from '../config';
import { CreateGroupMutation } from '../gql/group';
import { MutationRoot } from '../typings/schema';
import { GroupMutationInput } from '../typings/group';

export function createGroup(group: GroupMutationInput) {
  return client.mutate<Pick<MutationRoot, 'addGroup'>>({
    mutation: CreateGroupMutation,
    variables: { group },
  });
}
