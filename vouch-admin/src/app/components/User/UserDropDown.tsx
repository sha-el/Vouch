import * as React from 'react';
import { AutoComplete } from 'sha-el-design';
import { UserNode } from '../../typings/user';
import { client } from '../../config';
import { UserDropDownQuery } from '../../gql/user';
import { QueryRoot } from '../../typings/schema';

export type UserDropDownProps =
  | {
      mode: 'single';
      value?: UserNode;
      onChange?: (user: UserNode) => void;
      children?: React.ReactElement;
    }
  | {
      mode: 'multiple';
      value?: UserNode[];
      onChange?: (user: UserNode[]) => void;
      children?: React.ReactElement;
    };

const fetchUsers = async (email: string) => {
  const resp = await client.query<Pick<QueryRoot, 'userEdge'>>({
    query: UserDropDownQuery,
    variables: { email },
    errorPolicy: 'all',
  });

  return new Promise<UserNode[]>((resolve, reject) => {
    if (resp.data) {
      resolve(resp.data.userEdge.edges);
    }
    if (resp.errors) {
      reject(resp.errors);
    }
  });
};

export const UserDropdown: React.FC<UserDropDownProps> = (props) => {
  return (
    <AutoComplete<UserNode>
      {...props}
      data={fetchUsers}
      uniqueIdentifier={(e) => e.id || ((e as unknown) as string)}
      listDisplayProp={(e) => `${e.email}, ${e.id}`}
      displayValue={(e) => e?.email || ((e as unknown) as string)}
      clearable={false}
      searchValue={(e) => e?.email}
      label="Select User"
    />
  );
};
