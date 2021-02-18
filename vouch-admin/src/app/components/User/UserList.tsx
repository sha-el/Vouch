import { useQuery } from '@apollo/client';
import { Link, RouteComponentProps } from '@reach/router';
import React from 'react';
import { MdHome } from 'react-icons/md';
import { Breadcrumb, Button, FlexTable, Page, Pagination } from 'sha-el-design/lib';
import { client } from '../../config';
import { UserListQuery } from '../../gql/user';
import { TimeSince } from '../../helpers/Date';
import { QueryRoot } from '../../typings/schema';
import { UserNode } from '../../typings/user';

export const UserList: React.FC<RouteComponentProps> = () => {
  const [pageNumber, updatePageNumber] = React.useState(1);
  const [pageSize, updatePageSize] = React.useState(10);

  const [search] = React.useState('');
  const { loading, error, data } = useQuery<Pick<QueryRoot, 'userEdge'>>(UserListQuery, {
    variables: { pageSize, offset: (pageNumber - 1) * pageSize, name: search },
    client: client,
  });

  if (error) {
    return <div>Something went wrong</div>;
  }

  return (
    <Page
      title={
        <Breadcrumb>
          <Link to="/">
            <MdHome />
          </Link>
          <Link to="#">Users List</Link>
        </Breadcrumb>
      }
      extra={
        <Button primary component={<Link to="add" />}>
          Add Users
        </Button>
      }
    >
      <FlexTable
        pagination={
          <Pagination
            totalCount={data?.userEdge.count || 0}
            currentPage={pageNumber}
            batchSize={pageSize}
            itemsPerPage={[10, 20, 30]}
            onChange={(pn, ns) => {
              updatePageNumber(pn);
              updatePageSize(ns);
            }}
            justify="flex-end"
          />
        }
        data={data?.userEdge.edges || []}
        loading={loading}
      >
        <FlexTable.Column header="Name" key="name" span={6}>
          {(col?: UserNode) => (
            <>
              {col?.firstName} {col?.middleName} {col?.lastName}
            </>
          )}
        </FlexTable.Column>
        <FlexTable.Column header="Email" key="email" span={6}>
          {(col?: UserNode) => (
            <Button primary link flat component={<Link to={col?.id || '#'} />}>
              {col?.email}
            </Button>
          )}
        </FlexTable.Column>
        <FlexTable.Column header="Last Login" key="last login" span={3}>
          {(col?: UserNode) => (col?.lastLogin ? <TimeSince>{new Date(col?.lastLogin)}</TimeSince> : '-')}
        </FlexTable.Column>
        <FlexTable.Column header="Defaul Organization" key="do" span={8}>
          {(col?: UserNode) => col?.defaultOrganization?.name}
        </FlexTable.Column>
      </FlexTable>
    </Page>
  );
};
