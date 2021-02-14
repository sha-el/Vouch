import { RouteComponentProps, Router } from '@reach/router';
import React from 'react';
import { ApplicationList } from './ApplicationList';

export const Application: React.FC<RouteComponentProps> = () => {
  return (
    <Router>
      <ApplicationList path="/" />
    </Router>
  );
};
