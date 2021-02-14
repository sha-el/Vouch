import { Link, RouteComponentProps, Router } from '@reach/router';
import React, { useEffect, useState } from 'react';
import { MdApps, MdDevicesOther, MdGroup, MdNaturePeople } from 'react-icons/md';
import { RiLogoutBoxFill } from 'react-icons/ri';
import { SiAuthy } from 'react-icons/si';
import { Button, Container, Content, SidePanel, Tooltip } from 'sha-el-design/lib';
import { logout, me } from '../../service/user';
import { QueryRoot } from '../../typings/schema';
import { Application } from '../Application';
import { Group } from '../Group';
import { Organization } from '../Organization';
import { User } from '../User';

const Home: React.FC<RouteComponentProps> = () => <div>Home</div>;

export const Dashboard: React.FC<RouteComponentProps> = () => {
  const [user, updateUser] = useState<Pick<QueryRoot, 'me' | 'currentOrganization'> | null>(null);

  useEffect(() => {
    me().then((v) => updateUser(v));
  }, []);

  return (
    <Container>
      <SidePanel
        bottom={
          <Tooltip overlay="Logout">
            <Button flat displayBlock size="big" onClick={logout} icon={<RiLogoutBoxFill />} />
          </Tooltip>
        }
        logo={<SiAuthy size="50px" style={{ background: 'var(--primary)' }} />}
      >
        <Tooltip overlay="Users" placement="right">
          <Button
            primary={location.href.includes('users')}
            flat
            displayBlock
            size="big"
            icon={<MdNaturePeople />}
            component={<Link to="users" />}
          />
        </Tooltip>
        <Tooltip overlay="Groups" placement="right">
          <Button
            primary={location.href.includes('groups')}
            flat
            displayBlock
            size="big"
            icon={<MdGroup />}
            component={<Link to="groups" />}
          />
        </Tooltip>
        <Tooltip overlay="Organization" placement="right">
          <Button
            primary={location.href.includes('organizations')}
            flat
            displayBlock
            size="big"
            icon={<MdDevicesOther />}
            component={<Link to="organizations" />}
          />
        </Tooltip>
        <Tooltip overlay="Application" placement="right">
          <Button
            primary={location.href.includes('applications')}
            flat
            displayBlock
            size="big"
            icon={<MdApps />}
            component={<Link to="applications" />}
          />
        </Tooltip>
      </SidePanel>
      <Content>
        <Router>
          <Home path="/" />
          <User path="users/*" />
          <Group path="groups/*" />
          <Organization path="organizations/*" />
          <Application path="applications/*" />
        </Router>
      </Content>
    </Container>
  );
};
