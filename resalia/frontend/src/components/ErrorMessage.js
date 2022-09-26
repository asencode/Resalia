import React from 'react';

export default function ErrorMessage(props) {
  return (
    <div className="products">
      <p>Error: {props.children}</p>
    </div>
  );
}
