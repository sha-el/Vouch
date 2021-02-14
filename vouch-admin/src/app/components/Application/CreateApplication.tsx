import React from 'react';
import { Row, Col, Input, Button, Card, CardHeader, notify, AutoComplete, CheckBox, Text } from 'sha-el-design';
import { useForm, Controller } from 'react-hook-form';
import { PermissionDropDown } from '../Permission/Dropdown';
import { ApplicationMutationInput } from '../../typings/application';
import { createApplication } from '../../service/application';

export type CreateApplicationsProps = {
  onCancel: () => void;
  application?: ApplicationMutationInput;
};

const saveApplication = (data: ApplicationMutationInput) =>
  createApplication(data)
    .then(() => {
      notify({
        type: 'success',
        title: 'Application Added',
      });
    })
    .catch(() =>
      notify({
        type: 'error',
        title: 'Something went wrong',
      }),
    );

export const CreateApplication: React.FC<CreateApplicationsProps> = (props) => {
  const { handleSubmit, errors, control } = useForm<ApplicationMutationInput>({
    defaultValues: props.application || {
      name: '',
      permissions: [],
      features: [],
    },
  });
  const [isLoading, updateLoading] = React.useState(false);

  const onSubmit = (data: ApplicationMutationInput) => {
    updateLoading(true);
    data.id = props.application?.id;
    saveApplication(data)
      .then(() => {
        updateLoading(false);
        props.onCancel();
      })
      .catch(() => updateLoading(false));
  };

  return (
    <Card elevation={0}>
      <CardHeader>Add Application</CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Row gutter={[0, '10px 0']}>
          <Col>
            <Controller
              rules={{ required: 'Name is required' }}
              control={control}
              name="name"
              render={({ onChange, value, onBlur }) => (
                <Input
                  required
                  label="Name"
                  onChange={(e) => onChange(e.target.value)}
                  value={value}
                  error={errors.name}
                  onBlur={onBlur}
                />
              )}
            />
          </Col>
          <Col>
            <Controller
              control={control}
              name="withOrganization"
              render={({ onChange, value }) => (
                <CheckBox checked={value} onChange={(e) => onChange(e.target.checked)} label="With Organization" />
              )}
            />
            <Text variant="p" color="error">
              {errors.withOrganization?.message}
            </Text>
          </Col>
          <Col>
            <Controller
              control={control}
              name="permissions"
              render={({ onChange, value }) => (
                <PermissionDropDown
                  value={value || []}
                  onChange={(e) => onChange(e)}
                  error={errors.permissions?.join(',')}
                />
              )}
            />
          </Col>
          <Col>
            <Controller
              control={control}
              name="features"
              render={({ value, onChange }) => (
                <AutoComplete
                  mode="multiple"
                  value={value || []}
                  onChange={onChange}
                  error={errors.features?.map((v) => v?.message).join(',')}
                  listDisplayProp={(e) => e}
                  uniqueIdentifier={(e) => e}
                  displayValue={(e) => e}
                  label="Select Features"
                  data={(e) => [e.toUpperCase()]}
                />
              )}
            />
          </Col>
          <Col>
            <Controller
              control={control}
              name="redirectUrl"
              render={({ onChange, value }) => (
                <Input label="Redirect Url" value={value} onChange={onChange} error={errors.redirectUrl?.message} />
              )}
            />
          </Col>
          <Col offset={15} span={4}>
            <Button displayBlock type="danger" onClick={props.onCancel}>
              Cancel
            </Button>
          </Col>
          <Col span={1} />
          <Col span={4}>
            <Button displayBlock type="primary" loading={isLoading}>
              Submit
            </Button>
          </Col>
        </Row>
      </form>
    </Card>
  );
};
