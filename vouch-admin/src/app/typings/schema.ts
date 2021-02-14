import { GQLError } from '.';
import { UserNode } from './user';
import { GroupNode } from './group';
import { OrganizationNode } from './Organization';
import { ApplicationNode } from './application';

export type MutationRoot = {
  login: string;
  addUser: UserNode;
  errors?: GQLError[];
  addGroup: GroupNode;
  addPermissionToUser: UserNode;
  addGroupToUser: UserNode;
  signUp: UserNode;
  addApplicationToUser: UserNode;
  addOrganization: OrganizationNode;
  addApplication: ApplicationNode;
};

export interface Edge<T> {
  count: number;
  edges: T[];
}

export type QueryRoot = {
  user: UserNode;
  groupEdge: Edge<GroupNode>;
  me: UserNode;
  userEdge: Edge<UserNode>;
  organizationEdge: Edge<OrganizationNode>;
  currentOrganization: OrganizationNode;
  applicationEdge: Edge<ApplicationNode>;
};
