import { Edge } from './schema';
import { UserNode } from './user';

export type OrganizationNode = {
  id: string;
  name: string;
  address: string;
  contact: string;
  gstCode: string;
  gstRate: string;
  hsnCode: string;
  amtPerPointSale: string;
  amtReady: string;
  features: string[];
  users: string[];
  userEdge: Edge<UserNode>;
  updatedAt: string;
};

export type OrganizationMutationInput = {
  id?: string;
  name: string;
  address?: string;
  contact?: string;
  gstCode?: string;
  gstRate?: string;
  hsnCode?: string;
  amtPerPointSale?: string;
  amtReady?: string;
  users: string[];
  features: string[];
};
