import * as React from 'react';
import { AutoComplete } from 'sha-el-design';

export type PermissionDropDownProps = {
  value: string[];
  onChange: (value: string[]) => void;
  error?: string;
};

export enum VouchPermissions {
  SUPER_USER = 'SUPER_USER',
  CAN_ADD_GROUP = 'CAN_ADD_GROUP',
  CAN_EDIT_GROUP = 'CAN_EDIT_GROUP',
  CAN_DELETE_GROUP = 'CAN_DELETE_GROUP',
  CAN_ADD_USER = 'CAN_ADD_USER',
}

export const PermissionDropDown: React.FC<PermissionDropDownProps> = (props) => {
  return (
    <AutoComplete<string>
      mode="multiple"
      value={props.value || []}
      data={(e) =>
        Object.keys(VouchPermissions)
          .concat([e.toUpperCase()])
          .filter((v) => v.toLowerCase().includes(e.toLowerCase()))
      }
      uniqueIdentifier={(e) => e}
      listDisplayProp={(e) => e}
      label="Select Permissions"
      onChange={(e: string[]) => props.onChange(e)}
      displayValue={(e) => e}
      error={props.error}
    />
  );
};
