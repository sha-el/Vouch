import { RouteComponentProps, Router } from '@reach/router';
import React from 'react';
import { MyAccount } from './MyAcoount';
import { UserList } from './UserList';

export const User: React.FC<RouteComponentProps> = () => {
  return (
    <Router>
      <UserList path="/" />
      <MyAccount path=":id" />
    </Router>
  );
};
