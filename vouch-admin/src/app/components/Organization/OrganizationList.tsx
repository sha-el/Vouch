import { useQuery } from '@apollo/client';
import { Link, RouteComponentProps } from '@reach/router';
import React from 'react';
import { MdFilter, MdHome } from 'react-icons/md';
import {
  Breadcrumb,
  Button,
  Col,
  Drawer,
  FlexTable,
  Input,
  Page,
  Pagination,
  Popover,
  Row,
  Text,
} from 'sha-el-design/lib';
import { client } from '../../config';
import { OrganizationListQuery } from '../../gql/organization';
import { TimeSince } from '../../helpers/Date';
import { OrganizationNode } from '../../typings/Organization';
import { QueryRoot } from '../../typings/schema';
import { CreateOrganization } from './CreateOrganization';

export const OrganizationList: React.FC<RouteComponentProps> = () => {
  const [pageNumber, updatePageNumber] = React.useState(1);
  const [pageSize, updatePageSize] = React.useState(10);
  const [addOpen, updateAddOpen] = React.useState(false);
  const [organization, updateOrganization] = React.useState<OrganizationNode | null>(null);

  const [search, updateSearch] = React.useState('');
  const { loading, error, data, refetch } = useQuery<Pick<QueryRoot, 'organizationEdge'>>(OrganizationListQuery, {
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
          <Link to="#">Organization List</Link>
        </Breadcrumb>
      }
      extra={
        <Button primary onClick={() => updateAddOpen(true)}>
          Add Organization
        </Button>
      }
    >
      <FlexTable
        data={data?.organizationEdge.edges || []}
        loading={loading}
        pagination={
          <Pagination
            totalCount={data?.organizationEdge.count || 0}
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
      >
        <FlexTable.Column
          key="name"
          span={4}
          header={
            <>
              <Text>Name</Text>
              <Popover
                preserveOnClose
                content={
                  <Row justifyContent="flex-end">
                    <Col>
                      <Input
                        defaultValue={search}
                        borderless
                        placeholder="Press enter to search"
                        onKeyDown={(e) => e.key === 'Enter' && updateSearch((e.target as HTMLInputElement).value)}
                      />
                    </Col>
                    <Col flex="0 1 auto" alignSelf="flex-end">
                      <Button primary flat onClick={() => updateSearch('')}>
                        Clear
                      </Button>
                    </Col>
                  </Row>
                }
              >
                <Button size="small" icon={<MdFilter />} secondary={!!search} flat />
              </Popover>
            </>
          }
        >
          {(data?: OrganizationNode) => (
            <Button
              link
              flat
              primary
              onClick={() => {
                data && updateOrganization(data);
                updateAddOpen(true);
              }}
            >
              {data?.name}
            </Button>
          )}
        </FlexTable.Column>
        <FlexTable.Column header="Contact" span={6} key="contact">
          {(data?: OrganizationNode) => data?.contact}
        </FlexTable.Column>
        <FlexTable.Column header="Address" span={10} key="address">
          {(data?: OrganizationNode) => data?.address}
        </FlexTable.Column>
        <FlexTable.Column header="Last update" key="last update" span={4}>
          {(data?: OrganizationNode) => data && <TimeSince>{new Date(data?.updatedAt)}</TimeSince>}
        </FlexTable.Column>
      </FlexTable>
      <Drawer style={{ container: { width: '500px' } }} isVisible={addOpen}>
        <CreateOrganization
          organization={organization || undefined}
          onCancel={() => {
            refetch();
            updateOrganization(null);
            updateAddOpen(false);
          }}
        />
      </Drawer>
    </Page>
  );
};
