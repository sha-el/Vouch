import * as React from 'react';
import { Card, CardHeader, CardBody, Row, Col, Input, Button, notify } from 'sha-el-design';
import { UserMutationInput } from '../../typings/user';
import { addUser } from '../../service/user';

export type State = {
  value: UserMutationInput;
  error: {
    [key in keyof UserMutationInput]?: string;
  };
  isError: boolean;
};

export type UpdatePersonalDetailsProps = {
  onCancel: () => void;
  user: UserMutationInput;
};

export class UpdatePersonalDetails extends React.Component<UpdatePersonalDetailsProps, State> {
  constructor(props: UpdatePersonalDetailsProps) {
    super(props);

    this.state = {
      value: props.user,
      error: {},
      isError: false,
    };
  }

  onChange = (key: keyof UserMutationInput, value: UserMutationInput[keyof UserMutationInput]) => {
    this.setState({ value: { ...this.state.value, [key]: value } });
  };

  onSubmit = () => {
    addUser(this.state.value)
      .then(() =>
        notify({
          title: 'User Details Updated',
          type: 'success',
        }),
      )
      .then(() => this.props.onCancel())
      .catch(() =>
        notify({
          title: 'Something went wrong',
          type: 'error',
        }),
      );
  };

  render() {
    const { value, error, isError } = this.state;

    return (
      <Card elevation={0}>
        <CardHeader subtitle="Update personal details">User Personal Details Form</CardHeader>
        <CardBody>
          <Row gutter={[0, '10px']}>
            <Col>
              <Input
                value={value.firstName}
                label="First Name"
                error={error.firstName}
                onChange={(e) => this.onChange('firstName', e.target.value)}
              />
            </Col>
            <Col>
              <Input
                value={value.middleName}
                label="Middle Name"
                error={error.middleName}
                onChange={(e) => this.onChange('middleName', e.target.value)}
              />
            </Col>
            <Col>
              <Input
                value={value.lastName}
                label="Last Name"
                error={error.lastName}
                onChange={(e) => this.onChange('lastName', e.target.value)}
              />
            </Col>
            <Col offset={16} span={4}>
              <Button displayBlock type="danger" onClick={this.props.onCancel}>
                Cancel
              </Button>
            </Col>
            <Col span={4}>
              <Button displayBlock type="primary" onClick={this.onSubmit} disabled={isError}>
                Submit
              </Button>
            </Col>
          </Row>
        </CardBody>
      </Card>
    );
  }
}
