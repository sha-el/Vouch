import * as React from 'react';
import { CardMedia } from 'sha-el-design';
import { shadow } from 'sha-el-design/lib/helpers/style';
import { ThemeConsumer } from 'sha-el-design/lib/components/Theme/Theme';
import { getColor } from 'sha-el-design/lib/helpers';

export type UserAvatarProps = {
  image?: string;
  style: React.CSSProperties;
  email: string;
};

export const UserAvatar: React.FC<UserAvatarProps> = (props) => {
  if (!props.image) {
    return (
      <ThemeConsumer>
        {(theme) => (
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
        )}
      </ThemeConsumer>
    );
  }

  return <CardMedia image={props.image} height="200px" style={props.style} />;
};
