import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import AppWrapper from './imports/components/AppWrapper.jsx';

Meteor.startup(() => {
  render(<AppWrapper />, document.getElementById('render-target'));
});
