import * as React from 'react';
import { useQuery, ApolloQueryResult } from '@apollo/client';
import { GroupListQuery } from '../../gql/group';
import { client } from '../../config';
import { QueryRoot } from '../../typings/schema';
import { Skeleton } from 'sha-el-design/lib';

export type FetchGroupDataProps = {
  first?: number;
  children: (params: {
    data: Pick<QueryRoot, 'groupEdge'> | undefined;
    pageNumber: number;
    updatePageNumber: (pageNumber: number) => void;
    search: string;
    updateSearch: (search: string) => void;
    refetch: () => Promise<ApolloQueryResult<Pick<QueryRoot, 'groupEdge'>>>;
  }) => React.ReactNode;
};

export const FetchGroupData: React.FC<FetchGroupDataProps> = (props) => {
  const { first = 20 } = props;
  const [pageNumber, updatePageNumber] = React.useState(1);
  const [search, updateSearch] = React.useState('');

  const { loading, error, data, refetch } = useQuery<Pick<QueryRoot, 'groupEdge'>>(GroupListQuery, {
    variables: { first, offset: (pageNumber - 1) * 20, name: search },
    client,
  });

  if (error) {
    return <div>Something went wrong</div>;
  }

  return (
    <Skeleton
      isLoading={loading}
      render={() => <div>{props.children({ data, pageNumber, updatePageNumber, search, updateSearch, refetch })}</div>}
    />
  );
};
