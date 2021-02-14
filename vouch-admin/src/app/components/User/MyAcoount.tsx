import * as React from 'react';
import { Row, Col, Skeleton, Card, CardHeader, CardBody, Transfer, Button, notify, Drawer } from 'sha-el-design';
import { useQuery } from '@apollo/client';
import { UserDetailQuery } from '../../gql/user';
import { client } from '../../config';
import { QueryRoot } from '../../typings/schema';
import { FetchGroupData } from '../Group/FetchGroupData';
import {
  addGroupsToUser,
  addPermissionsToUser,
  addApplicationToUser,
  removeApplicationFromUser,
} from '../../service/user';
import { UpdatePersonalDetails } from './UpdatePersonalDetails';
import { UpdatePassword } from './UpdatePassword';
import { UserDropdown } from './UserDropDown';
import { UserNode } from '../../typings/user';
import { UserAvatar } from './UserAvatar';
import { VouchPermissions } from '../Permission/Dropdown';
import { RouteComponentProps } from '@reach/router';
import { applicationListQuery } from '../../service/application';
import { ApplicationNode } from '../../typings/application';

const updateGroups = (userId: string, groups: string[], refetch: () => unknown) => {
  addGroupsToUser(userId, groups)
    .then(() =>
      notify({
        type: 'success',
        title: 'Groups Updated',
      }),
    )
    .then(refetch)
    .catch(() =>
      notify({
        type: 'error',
        title: 'Error updating groups',
      }),
    );
};

const updatePermission = (userId: string, permissions: string[], refetch: () => unknown) => {
  addPermissionsToUser(userId, permissions)
    .then(() =>
      notify({
        type: 'success',
        title: 'Permissions Updated',
      }),
    )
    .then(refetch)
    .catch(() =>
      notify({
        type: 'error',
        title: 'Error updating permissions',
      }),
    );
};

const addAppToUser = (userId: string, application: string, refetch: () => unknown) => {
  addApplicationToUser(userId, application)
    .then(() =>
      notify({
        type: 'success',
        title: 'Access Granted',
      }),
    )
    .then(refetch)
    .catch(() =>
      notify({
        type: 'error',
        title: 'Error updating permissions',
      }),
    );
};

const removeAppFromUser = (userId: string, application: string, refetch: () => unknown) => {
  removeApplicationFromUser(userId, application)
    .then(() =>
      notify({
        type: 'success',
        title: 'Access Removed',
      }),
    )
    .then(refetch)
    .catch(() =>
      notify({
        type: 'error',
        title: 'Error updating permissions',
      }),
    );
};

const handleAppChange = (
  currentApplications: ApplicationNode[],
  updatedApplications: ApplicationNode[],
  userId: string,
  refetch: () => unknown,
) => {
  const newApp = updatedApplications.find((v) => v.updatedAt);
  if (newApp) {
    return addAppToUser(userId, newApp.id, refetch);
  }
  const removedApp = currentApplications.find((v) => !updatedApplications.find((e) => e.id === v.id));
  if (!removedApp) {
    return;
  }
  return removeAppFromUser(userId, removedApp.id, refetch);
};

export const MyAccount: React.FC<RouteComponentProps<{ id: string }>> = (props) => {
  const userId = props.id;
  const { loading, error, data, refetch } = useQuery<Pick<QueryRoot, 'user'>>(UserDetailQuery, {
    variables: { id: userId },
    client,
  });

  const [personalDetailsForm, togglePersonalDetailsForm] = React.useState(false);
  const [updatePassword, toggleUpdatePassword] = React.useState(false);

  if (error) {
    return <div>something went wrong</div>;
  }

  return (
    <Row style={{ height: '100vh' }} justifyContent="center">
      <Col style={{ paddingTop: '100px', width: '1000px' }} flex="0 1 1200px">
        <Skeleton
          isLoading={loading}
          render={() => (
            <>
              <Card
                style={{
                  borderRadius: '10px',
                }}
              >
                <UserAvatar
                  image={data?.user.image}
                  email={data?.user.email || ''}
                  style={{
                    width: '200px',
                    borderRadius: '50%',
                    margin: 'auto',
                    marginTop: '-100px',
                    height: '200px',
                  }}
                />
                <CardHeader
                  style={{
                    textAlign: 'center',
                  }}
                  subtitle={
                    <>
                      <div>{data?.user.email}</div>
                      <div>
                        <span>ID:</span>
                        <span>{data?.user.id}</span>
                      </div>
                    </>
                  }
                >
                  {data?.user.firstName} {data?.user.middleName} {data?.user.lastName}
                </CardHeader>
                <CardBody>
                  <Row justifyContent="flex-end">
                    <Col flex="0 1 auto">
                      <Button flat type="secondary" onClick={() => toggleUpdatePassword(true)}>
                        Change Password
                      </Button>
                    </Col>
                    <Col flex="0 1 auto">
                      <Button onClick={() => togglePersonalDetailsForm(true)} flat type="secondary">
                        Update Personal Details
                      </Button>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
              <Card style={{ marginTop: '20px' }}>
                <CardHeader subtitle="Applications" />
                <Transfer
                  values={data?.user.applicationEdge?.edges}
                  displayValue={(e) => e.name}
                  uniqueIdentifier={(e) => e.id}
                  listDisplayProp={(e) => e.name}
                  data={() => applicationListQuery().then((v) => v.data.applicationEdge.edges)}
                  onChange={(t) =>
                    handleAppChange(
                      data?.user.applicationEdge?.edges as ApplicationNode[],
                      t,
                      data?.user.id || '',
                      refetch,
                    )
                  }
                />
              </Card>
              <Card style={{ marginTop: '20px' }}>
                <CardHeader subtitle="User groups" />
                <FetchGroupData first={10000}>
                  {(groupData) => (
                    <Transfer
                      values={data?.user.groupsEdge?.edges}
                      displayValue={(e) => e.name}
                      uniqueIdentifier={(e) => e.id}
                      listDisplayProp={(e) => e.name}
                      data={() => groupData?.data?.groupEdge.edges || []}
                      onChange={(e) =>
                        data?.user &&
                        updateGroups(
                          data?.user.id,
                          e.map((v) => v.id),
                          refetch,
                        )
                      }
                    />
                  )}
                </FetchGroupData>
              </Card>
              <Card style={{ marginTop: '20px' }}>
                <CardHeader subtitle="User Permissions" />
                <Transfer
                  values={data?.user.permissions || []}
                  displayValue={(e) => e}
                  uniqueIdentifier={(e) => e}
                  listDisplayProp={(e) => e}
                  data={() => Object.keys(VouchPermissions)}
                  onChange={(e) => data?.user && updatePermission(data?.user.id, e, refetch)}
                />
              </Card>
              <Drawer
                style={{ container: { width: '500px' } }}
                onClose={() => togglePersonalDetailsForm(false)}
                isVisible={personalDetailsForm}
              >
                <UpdatePersonalDetails
                  onCancel={() => {
                    refetch();
                    togglePersonalDetailsForm(false);
                  }}
                  user={{
                    id: data?.user.id,
                    email: data?.user.email || '',
                    firstName: data?.user.firstName || '',
                    middleName: data?.user.middleName || '',
                    lastName: data?.user.lastName || '',
                  }}
                />
              </Drawer>
              <Drawer
                style={{ container: { width: '500px' } }}
                onClose={() => toggleUpdatePassword(false)}
                isVisible={updatePassword}
              >
                <UpdatePassword
                  onCancel={() => {
                    refetch();
                    toggleUpdatePassword(false);
                  }}
                  userId={data?.user.id || ''}
                />
              </Drawer>
            </>
          )}
        />
      </Col>
    </Row>
  );
};
