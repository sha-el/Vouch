import { client } from '../config';
import { ApplicationListQuery, CreateApplicationMutation } from '../gql/application';
import { MutationRoot, QueryRoot } from '../typings/schema';
import { ApplicationMutationInput } from '../typings/application';

export function createApplication(application: ApplicationMutationInput) {
  return client.mutate<Pick<MutationRoot, 'addApplication'>>({
    mutation: CreateApplicationMutation,
    variables: { application },
  });
}

export function applicationListQuery() {
  return client.query<Pick<QueryRoot, 'applicationEdge'>>({
    query: ApplicationListQuery,
  });
}
