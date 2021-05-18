import * as React from 'react';
import { CardMedia } from 'sha-el-design';
import { shadow } from 'sha-el-design/lib/helpers/style';
import { getColor } from 'sha-el-design/lib/helpers';
import { useTheme } from 'sha-el-design/lib/components/Theme/Theme';

export type UserAvatarProps = {
  image?: string;
  style: React.CSSProperties;
  email: string;
};

export const UserAvatar: React.FC<UserAvatarProps> = (props) => {
  const theme = useTheme();
  if (!props.image) {
    return (
      <div
        style={{
          ...(props.style || {}),
          background: theme.secondary,
          boxShadow: shadow('2X', theme),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <h1 style={{ textAlign: 'center', color: getColor(theme.secondary) }}>
          {props.email.slice(0, 2).toUpperCase()}
        </h1>
      </div>
    );
  }

  return <CardMedia image={props.image} height="200px" style={props.style} />;
};
