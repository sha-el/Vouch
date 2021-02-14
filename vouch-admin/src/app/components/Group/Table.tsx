import React from 'react';
import { AiOutlineUserAdd } from 'react-icons/ai';
import { ApolloQueryResult } from '@apollo/client';
import { RouteComponentProps } from '@reach/router';
import { Button, FlexTable, Pagination } from 'sha-el-design/lib';
import { TimeSince } from '../../helpers/Date';
import { GroupNode } from '../../typings/group';
import { QueryRoot } from '../../typings/schema';

interface Props extends RouteComponentProps {
  data: Pick<QueryRoot, 'groupEdge'> | undefined;
  pageNumber: number;
  updatePageNumber: (pageNumber: number) => void;
  search: string;
  updateSearch: (search: string) => void;
  refetch: () => Promise<ApolloQueryResult<Pick<QueryRoot, 'groupEdge'>>>;
  onGroupSelect: (group: GroupNode | null) => void;
}

export const GroupTable: React.FC<Props> = (props) => {
  return (
    <FlexTable
      data={props.data?.groupEdge.edges || []}
      pagination={
        <Pagination
          justify="flex-end"
          totalCount={props.data?.groupEdge.count || 0}
          batchSize={8}
          currentPage={props.pageNumber}
          onChange={props.updatePageNumber}
        />
      }
    >
      <FlexTable.Column span={6} header="Name" key="name">
        {(data?: GroupNode) => (
          <Button flat primary link onClick={() => props.onGroupSelect(data || null)}>
            {data?.name}
          </Button>
        )}
      </FlexTable.Column>
      <FlexTable.Column span={8} header="Created By" key="createdBy">
        {(data?: GroupNode) => data?.createdBy?.email}
      </FlexTable.Column>
      <FlexTable.Column span={5} header="Last update" key="lastupdate">
        {(data?: GroupNode) => data && <TimeSince>{new Date(data?.updatedAt)}</TimeSince>}
      </FlexTable.Column>
    </FlexTable>
  );
};
