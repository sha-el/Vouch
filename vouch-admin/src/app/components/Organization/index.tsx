import { RouteComponentProps, Router } from '@reach/router';
import React from 'react';
import { OrganizationList } from './OrganizationList';

export const Organization: React.FC<RouteComponentProps> = () => {
  return (
    <Router>
      <OrganizationList path="/" />
    </Router>
  );
};
