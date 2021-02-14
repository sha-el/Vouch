import { RouteComponentProps, Router } from '@reach/router';
import React from 'react';
import { GroupList } from './GroupList';

export const Group: React.FC<RouteComponentProps> = () => {
  return (
    <Router>
      <GroupList path="/" />
    </Router>
  );
};
