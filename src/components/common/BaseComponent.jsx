import React from 'react';
import './CommonComponents.css';

export class BaseComponent extends React.Component {
  renderError(error) {
    return error && <div className="error">{error}</div>;
  }

  renderLoading(isLoading, text = 'Loading...') {
    return isLoading && <div className="loading">{text}</div>;
  }
}
