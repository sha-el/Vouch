import { RouteComponentProps } from '@reach/router';
import React from 'react';
import { Loading } from 'sha-el-design/lib';
import { logout } from '../../service/user';

export const Logout: React.FC<RouteComponentProps> = () => {
  console.log(location.search);
  logout(location.search);
  return <Loading isLoading size="big" />;
};
