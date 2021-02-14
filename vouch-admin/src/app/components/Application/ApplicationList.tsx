import { useQuery } from '@apollo/client';
import { Link, RouteComponentProps } from '@reach/router';
import React from 'react';
import { MdCheck, MdClose, MdFilter, MdHome } from 'react-icons/md';
import {
  Breadcrumb,
  Page,
  FlexTable,
  Popover,
  Pagination,
  Text,
  Row,
  Col,
  Input,
  Button,
  Drawer,
} from 'sha-el-design/lib';
import { client } from '../../config';
import { ApplicationListQuery } from '../../gql/application';
import { CopyToClipboard } from '../../helpers/CopyToClipboard';
import { TimeSince } from '../../helpers/Date';
import { ApplicationNode } from '../../typings/application';
import { QueryRoot } from '../../typings/schema';
import { CreateApplication } from './CreateApplication';

export const ApplicationList: React.FC<RouteComponentProps> = () => {
  const [pageNumber, updatePageNumber] = React.useState(1);
  const [pageSize, updatePageSize] = React.useState(10);
  const [addOpen, updateAddOpen] = React.useState(false);
  const [application, updateApplication] = React.useState<ApplicationNode | null>(null);

  const [search, updateSearch] = React.useState('');
  const { loading, error, data, refetch } = useQuery<Pick<QueryRoot, 'applicationEdge'>>(ApplicationListQuery, {
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
          <Link to="#">Application List</Link>
        </Breadcrumb>
      }
      extra={
        <Button primary onClick={() => updateAddOpen(true)}>
          Add Application
        </Button>
      }
    >
      <FlexTable
        data={data?.applicationEdge.edges || []}
        loading={loading}
        pagination={
          <Pagination
            totalCount={data?.applicationEdge.count || 0}
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
          {(data?: ApplicationNode) => (
            <Button
              link
              flat
              primary
              onClick={() => {
                data && updateApplication(data);
                updateAddOpen(true);
              }}
            >
              {data?.name}
            </Button>
          )}
        </FlexTable.Column>
        <FlexTable.Column header="Id" key="id" span={4}>
          {(data?: ApplicationNode) => <CopyToClipboard>{data?.id}</CopyToClipboard>}
        </FlexTable.Column>
        <FlexTable.Column header="Redirect Url" key="redirectUrl" span={8}>
          {(data?: ApplicationNode) => data?.redirectUrl}
        </FlexTable.Column>
        <FlexTable.Column header="With Organization" key="withOrganization" span={4}>
          {(data?: ApplicationNode) => (data?.withOrganization ? <MdCheck /> : <MdClose />)}
        </FlexTable.Column>
        <FlexTable.Column header="Last update" key="last update" span={4}>
          {(data?: ApplicationNode) => data && <TimeSince>{new Date(data?.updatedAt)}</TimeSince>}
        </FlexTable.Column>
      </FlexTable>
      <Drawer isVisible={addOpen} style={{ container: { width: '500px' } }}>
        <CreateApplication
          application={application || undefined}
          onCancel={() => {
            refetch();
            updateApplication(null);
            updateAddOpen(false);
          }}
        />
      </Drawer>
    </Page>
  );
};
