import * as React from 'react';
import { RouteComponentProps } from '@reach/router';
import { Card, Col, Row, CardMedia, TabPanelContainer, TabPanel } from 'sha-el-design';

import { Login } from './Login';
import { Signup } from './SignUp';

const tabs = [
  {
    title: 'Login',
    key: 'login',
  },
  {
    title: 'Signup',
    key: 'signup',
  },
];

export const LoginSignup: React.FC<RouteComponentProps> = (props) => {
  const [activeTab, changeTab] = React.useState('login');

  if (localStorage.user) {
    location.href = '/dashboard';
  }

  return (
    <Row
      alignItems="center"
      justifyContent="center"
      style={{
        background: '#e7d9fb14',
        height: '100vh',
        boxShadow:
          '0px 8px 9px -5px rgba(0,0,0,0.2), 0px 15px 22px 2px rgba(0,0,0,0.14), 0px 6px 28px 5px rgba(0,0,0,0.12)',
      }}
    >
      <Col flex="0 1 400px">
        <Card>
          <CardMedia
            image="https://image.freepik.com/free-vector/clouds-background-with-stars-text-soace_1017-25499.jpg"
            height="300px"
          />
          <TabPanelContainer titles={tabs} activeKey={activeTab} unMountOnChange={false}>
            <TabPanel title="Login" key="login">
              <Login onTabChange={() => changeTab('signup')} {...props} />
            </TabPanel>
            <TabPanel title="Sign Up" key="signup">
              <Signup onTabChange={() => changeTab('login')} />
            </TabPanel>
          </TabPanelContainer>
        </Card>
      </Col>
    </Row>
  );
};
