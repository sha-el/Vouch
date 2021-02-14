import React from 'react';
import { Row, Col, Input, Button, Card, CardHeader, notify, AutoComplete, Textarea } from 'sha-el-design';
import { useForm, Controller } from 'react-hook-form';
import { OrganizationMutationInput } from '../../typings/Organization';
import { createOrganization } from '../../service/organization';
import { UserDropdown } from '../User/UserDropDown';
import { UserNode } from '../../typings/user';

export type CreateOrganizationsProps = {
  onCancel: () => void;
  organization?: OrganizationMutationInput;
};

const saveOrganization = (data: OrganizationMutationInput) =>
  createOrganization(data)
    .then(() => {
      notify({
        type: 'success',
        title: 'Organization Added',
      });
    })
    .catch(() =>
      notify({
        type: 'error',
        title: 'Something went wrong',
      }),
    );

export const CreateOrganization: React.FC<CreateOrganizationsProps> = (props) => {
  const { handleSubmit, errors, control } = useForm<OrganizationMutationInput>({
    defaultValues: props.organization || {
      name: '',
      features: [],
      users: [],
    },
  });
  const [isLoading, updateLoading] = React.useState(false);

  const onSubmit = (data: OrganizationMutationInput) => {
    updateLoading(true);
    data.id = props.organization?.id;
    saveOrganization(data)
      .then(() => {
        updateLoading(false);
        props.onCancel();
      })
      .catch(() => updateLoading(false));
  };

  return (
    <Card elevation={0}>
      <CardHeader>Add Organization</CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Row gutter={[0, '10px 0']}>
          <Col>
            <Controller
              rules={{ required: 'Name is required' }}
              control={control}
              name="name"
              render={({ onChange, value }) => (
                <Input
                  required
                  label="Name"
                  onChange={(e) => onChange(e.target.value)}
                  value={value}
                  error={errors.name?.message}
                />
              )}
            />
          </Col>
          <Col>
            <Controller
              control={control}
              name="contact"
              render={({ onChange, value }) => (
                <Input
                  label="Contact"
                  onChange={(e) => onChange(e.target.value)}
                  value={value}
                  error={errors.contact?.message}
                />
              )}
            />
          </Col>
          <Col>
            <Controller
              control={control}
              name="gstCode"
              render={({ onChange, value }) => (
                <Input
                  label="GST Code"
                  onChange={(e) => onChange(e.target.value)}
                  value={value}
                  error={errors.gstCode?.message}
                />
              )}
            />
          </Col>
          <Col>
            <Controller
              control={control}
              name="gstRate"
              render={({ onChange, value }) => (
                <Input
                  label="GST Rate"
                  onChange={(e) => onChange(e.target.value)}
                  value={value}
                  error={errors.gstRate?.message}
                />
              )}
            />
          </Col>
          <Col>
            <Controller
              control={control}
              name="hsnCode"
              render={({ onChange, value }) => (
                <Input
                  label="HSN Code"
                  onChange={(e) => onChange(e.target.value)}
                  value={value}
                  error={errors.hsnCode?.message}
                />
              )}
            />
          </Col>
          <Col>
            <Controller
              control={control}
              name="amtPerPointSale"
              render={({ onChange, value }) => (
                <Input
                  label="Amount Per Point Sale"
                  onChange={(e) => onChange(e.target.value)}
                  value={value}
                  error={errors.amtPerPointSale?.message}
                />
              )}
            />
          </Col>
          <Col>
            <Controller
              control={control}
              name="amtReady"
              render={({ onChange, value }) => (
                <Input
                  label="Amount Ready"
                  onChange={(e) => onChange(e.target.value)}
                  value={value}
                  error={errors.amtReady?.message}
                />
              )}
            />
          </Col>
          <Col>
            <Controller
              control={control}
              name="address"
              render={({ onChange, value }) => (
                <Textarea label="Address" onChange={onChange} value={value} error={errors.address?.message} />
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
              name="users"
              render={({ value, onChange }) => (
                <UserDropdown
                  mode="multiple"
                  value={value || []}
                  onChange={(e: UserNode[]) => onChange(e.map((v) => v.id || v))}
                />
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
