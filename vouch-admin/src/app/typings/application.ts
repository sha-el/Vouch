import { UserNode } from './user';

export type ApplicationNode = {
  id: string;
  name: string;
  withOrganization: boolean;
  updatedAt: string;
  features: string[];
  permissions: string[];
  redirectUrl: string;
  users: UserNode[];
};

export type ApplicationMutationInput = {
  id?: string;
  name: string;
  withOrganization: boolean;
  features: string[];
  redirectUrl: string;
  permissions: string[];
};
