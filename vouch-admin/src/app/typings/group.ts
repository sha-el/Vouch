import { UserNode } from './user';

export type GroupNode = {
  id: string;
  name: string;
  permissions: string[];
  features: string[];
  createdById: string;
  createdBy: UserNode;
  updatedAt: string;
  users: UserNode[];
};

export type GroupMutationInput = {
  id?: string;
  name: string;
  permissions: string[];
  features: string[];
  createdById: string;
};
