import * as React from 'react';
import { Row, Col, Input, Button, notify } from 'sha-el-design';
import { RiLockPasswordLine } from 'react-icons/ri';
import { updatePassword } from '../../service/user';

export type UpdatePasswordProps = {
  onCancel: () => void;
  userId: string;
};

export const UpdatePassword: React.FC<UpdatePasswordProps> = (props) => {
  const [state, setState] = React.useState({ password: '', confirmPassword: '', error: '' });

  const onSubmit = () => {
    updatePassword(props.userId, state.password)
      .then(() =>
        notify({
          type: 'success',
          title: 'Password Updated',
        }),
      )
      .then(() => props.onCancel())
      .catch(() =>
        notify({
          type: 'error',
          title: 'Something went wrong',
        }),
      );
  };

  return (
    <Row gutter={[0, '10px']}>
      <Col>
        <Input
          type="password"
          label="Password"
          placeholder="Enter your Password"
          before={<RiLockPasswordLine />}
          value={state.password}
          onChange={({ target: { value } }) => setState({ ...state, password: value })}
        />
      </Col>
      <Col>
        <Input
          type="password"
          label="Confirrm Password"
          placeholder="Re-enter Password"
          before={<RiLockPasswordLine />}
          value={state.confirmPassword}
          onChange={({ target: { value } }) => setState({ ...state, confirmPassword: value })}
          error={state.error}
        />
      </Col>
      <Col offset={16} span={4}>
        <Button displayBlock type="danger" onClick={props.onCancel}>
          Cancel
        </Button>
      </Col>
      <Col span={4}>
        <Button displayBlock type="primary" onClick={onSubmit} disabled={!!state.error}>
          Submit
        </Button>
      </Col>
    </Row>
  );
};
