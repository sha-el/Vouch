import { Link, RouteComponentProps } from '@reach/router';
import React, { useState } from 'react';
import { MdHome } from 'react-icons/md';
import { Breadcrumb, Button, Drawer, Page } from 'sha-el-design/lib';
import { GroupMutationInput } from '../../typings/group';
import { CreateGroup } from './CreateGroup';
import { FetchGroupData } from './FetchGroupData';
import { GroupTable } from './Table';

export const GroupList: React.FC<RouteComponentProps> = (props) => {
  const [addOpen, updateAddOpen] = useState(false);
  const [group, updateGroup] = useState<GroupMutationInput | null>(null);
  return (
    <Page
      title={
        <Breadcrumb>
          <Link to="/">
            <MdHome />
          </Link>
          <Link to="#">Group List</Link>
        </Breadcrumb>
      }
      extra={
        <Button primary onClick={() => updateAddOpen(true)}>
          Add Group
        </Button>
      }
    >
      <FetchGroupData>
        {(params) => (
          <>
            <GroupTable
              {...params}
              {...props}
              onGroupSelect={(data) => {
                updateGroup(data);
                data && updateAddOpen(true);
              }}
            />
            <Drawer style={{ container: { width: '500px' } }} isVisible={addOpen}>
              <CreateGroup
                group={group || undefined}
                onCancel={() => {
                  params.refetch();
                  updateGroup(null);
                  updateAddOpen(false);
                }}
              />
            </Drawer>
          </>
        )}
      </FetchGroupData>
    </Page>
  );
};
