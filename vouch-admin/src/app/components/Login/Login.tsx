import * as React from 'react';
import { CardHeader, Col, Row, CardBody, Input, Button, Divider, CheckBox, ButtonGroup, notify } from 'sha-el-design';
import { RiUser3Line, RiLockPasswordLine } from 'react-icons/ri';
import { login as loginService } from '../../service/user';
import { LoginMutationInput } from '../../typings/user';
import { useForm, Controller } from 'react-hook-form';
import { APP_NAME } from '../../helpers/queryParams';
import { RouteComponentProps } from '@reach/router';

export interface LoginProps extends RouteComponentProps {
  onTabChange: () => void;
}

const login = async (data: LoginMutationInput) => {
  try {
    const response = await loginService(data.email, data.password);
    if (!response.ok) {
      notify({
        title: 'Something went wrong',
        type: 'error',
      });
      return response;
    }
    notify({
      title: 'Login Success',
      type: 'success',
    });
    return response;
  } catch (e) {
    throw e;
  }
};

export const Login: React.FunctionComponent<LoginProps> = (props) => {
  const { onTabChange } = props;

  const { handleSubmit, errors, control } = useForm<LoginMutationInput>({
    defaultValues: {
      email: '',
      password: '',
      saveSession: false,
    },
  });
  const [isLoading, updateLoading] = React.useState(false);

  const onSubmit = (data: LoginMutationInput) => {
    updateLoading(true);
    login(data)
      .then(() => {
        const redirect = new URLSearchParams(location.search).get('redirect');
        if (redirect) {
          location.href = redirect;
        }
        props.navigate?.('/dashboard');
        updateLoading(false);
      })
      .catch(() => updateLoading(false));
  };

  return (
    <>
      <CardHeader subtitle={`Login to ${APP_NAME}`}>Welcome back</CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Row gutter={[0, '10px 0']}>
            <Col>
              <Controller
                rules={{ required: 'Email is required' }}
                control={control}
                name="email"
                render={({ onChange, value, onBlur }) => (
                  <Input
                    type="text"
                    label="Email"
                    placeholder="Enter your email address"
                    before={<RiUser3Line />}
                    value={value}
                    onChange={({ target: { value } }) => onChange(value)}
                    error={errors.email?.message}
                    onBlur={onBlur}
                  />
                )}
              />
            </Col>
            <Col>
              <Controller
                rules={{ required: 'Password is required' }}
                control={control}
                name="password"
                render={({ onChange, value, onBlur }) => (
                  <Input
                    type="password"
                    label="Password"
                    placeholder="Enter your Password"
                    before={<RiLockPasswordLine />}
                    value={value}
                    onChange={({ target: { value } }) => onChange(value)}
                    error={errors.password?.message}
                    onBlur={onBlur}
                  />
                )}
              />
            </Col>
            <Col>
              <Controller
                control={control}
                name="saveSession"
                render={({ onChange, value, onBlur }) => (
                  <CheckBox
                    label="Keep me signed in"
                    checked={value}
                    onChange={({ target: { checked } }) => onChange(checked)}
                    onBlur={onBlur}
                  />
                )}
              />
            </Col>
          </Row>
          <Row>
            <Button displayBlock type="primary" loading={isLoading}>
              Submit
            </Button>
          </Row>
        </form>
        <Divider color="#6870a0" />
        <ButtonGroup>
          <Button style={{ width: '50%' }} flat type="secondary">
            Forget Password
          </Button>
          <Button style={{ width: '50%' }} flat type="primary" onClick={onTabChange}>
            Sign up
          </Button>
        </ButtonGroup>
      </CardBody>
    </>
  );
};
