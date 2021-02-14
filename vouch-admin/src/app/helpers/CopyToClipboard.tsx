import React from 'react';
import { MdContentCopy } from 'react-icons/md';
import { Button, Popover, Tooltip, Text, notify } from 'sha-el-design/lib';

export const CopyToClipboard: React.FC<{ children?: string }> = (props) => {
  return (
    <Popover
      content={
        <>
          <Text margin="2px">{props.children}</Text>
          <Tooltip overlay="Copy to Clipboard">
            <Button
              onClick={() => copyToClipBoard(props.children || '')}
              secondary
              flat
              icon={<MdContentCopy />}
              shape="circle"
            />
          </Tooltip>
        </>
      }
      position="top"
      trigger="onHover"
    >
      <span>{props.children}</span>
    </Popover>
  );
};

function copyToClipBoard(text: string) {
  const textArea = document.createElement('textarea');
  textArea.value = text;

  // Avoid scrolling to bottom
  textArea.style.top = '0';
  textArea.style.left = '0';
  textArea.style.position = 'fixed';

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    if (document.execCommand('copy')) {
      notify({
        type: 'info',
        title: 'Copied to clipboard',
      });
    } else {
      notify({
        type: 'warning',
        title: 'Failed to Copy',
      });
    }
  } catch (err) {
    notify({
      type: 'warning',
      title: 'Failed to Copy',
    });
  }

  document.body.removeChild(textArea);
}
