import React from 'react';

function Theme(props: {themeKey: string}) {
  if (!props.themeKey || props.themeKey === 'light') {
    return null;
  } else {
    const url = `${process.env.PUBLIC_URL}/themes/${props.themeKey}.css`;
    return <link href={url} rel="stylesheet" />;
  }
}

export default Theme;