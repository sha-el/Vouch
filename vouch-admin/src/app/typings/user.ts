import { Edge } from './schema';
import { GroupNode } from './group';
import { OrganizationNode } from './Organization';
import {ApplicationNode} from './application';

export type LoginMutationInput = {
  email: string;
  password: string;
  application: string;
  saveSession: boolean;
};

export type LoginMutationResponse = {
  token: string;
};

export type SignUpMutation = {
  email: string;
  password: string;
  password2: string;
};

export type UserMutationInput = {
  id?: string;
  email: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
};

export type AddUserParams = {
  user: UserMutationInput;
};

export type UserNode = {
  id: string;
  email: string;
  password: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  applications: string[];
  lastLogin?: string;
  permissions: string[];
  groups: string[];
  image?: string;
  updatedAt: string;

  groupsEdge?: Edge<GroupNode>;
  organizationEdge?: Edge<OrganizationNode>;
  defaultOrganization?: OrganizationNode;
  applicationEdge?: Edge<ApplicationNode>;
};
