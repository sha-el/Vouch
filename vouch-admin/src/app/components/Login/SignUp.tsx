import * as React from 'react';
import { CardHeader, CardBody, Row, Col, Input, Button, Divider, notify } from 'sha-el-design';
import { RiLockPasswordLine, RiUser3Line } from 'react-icons/ri';
import { SignUpMutation } from '../../typings/user';
import { signUp } from '../../service/user';
import { useForm, Controller } from 'react-hook-form';
import { APP_NAME } from '../../helpers/queryParams';

export type SignUpProps = {
  onTabChange: () => void;
};

export const Signup: React.FC<SignUpProps> = (props) => {
  const { onTabChange } = props;
  const { handleSubmit, errors, control, setError, getValues } = useForm<SignUpMutation>();
  console.log(errors);

  const onSubmit = (data: SignUpMutation) => {
    signUp(
      {
        email: data.email,
      },
      data.password,
    )
      .then((v) => {
        if (v.data) {
          notify({
            title: 'Sign up Success',
            message: `Your new account for ${APP_NAME} is ready. Please Login`,
            type: 'success',
            callBack: () => v.data,
            duration: 6000,
          });
          return;
        }
        const error = v.errors?.map((e) => e.message).join(',');
        error?.toLowerCase().includes('email already exists') &&
          setError('email', { message: 'Email already exists', type: 'validate' });

        notify({
          title: v.errors?.map((e) => e.message).join(','),
          type: 'error',
          message: 'Please contact system admin for further details',
          duration: 10000,
        });
      })
      .catch(() =>
        notify({
          title: 'Error',
          type: 'error',
          message: 'Something went wrong',
          duration: 10000,
        }),
      );
  };

  return (
    <>
      <CardHeader subtitle="Adventure starts here 🚀">Hello Traveler 👋</CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Row gutter={[0, '10px 0']}>
            <Col>
              <Controller
                rules={{ required: 'Email is required' }}
                control={control}
                name="email"
                render={({ onChange, value }) => (
                  <Input
                    type="text"
                    label="Email"
                    placeholder="Enter your email address"
                    before={<RiUser3Line />}
                    value={value}
                    onChange={({ target: { value } }) => onChange(value)}
                    error={errors.email?.message}
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
                rules={{
                  required: 'Please confirm Password',
                  validate: (value) => (getValues('password') === value ? true : 'Password mismatch'),
                }}
                control={control}
                name="password2"
                render={({ onChange, value, onBlur }) => (
                  <Input
                    type="password"
                    label="Password"
                    placeholder="Confirm Password"
                    before={<RiLockPasswordLine />}
                    value={value}
                    onChange={({ target: { value } }) => onChange(value)}
                    error={errors.password2?.message}
                    onBlur={onBlur}
                  />
                )}
              />
            </Col>
          </Row>
          <Row>
            <Button displayBlock type="submit" primary>
              Submit
            </Button>
          </Row>
          <Divider color="#6870a0" />
          <Button displayBlock flat secondary onClick={onTabChange}>
            Already has a account? Login
          </Button>
        </form>
      </CardBody>
    </>
  );
};
