import React from 'react';
import { Router } from 'react-router';
import { createBrowserHistory } from 'history'
import { render } from 'react-dom';

const browserHistory = createBrowserHistory();

import App from '/imports/ui/router.js';

Meteor.startup(() => {
  render(
     <Router history={browserHistory}>
        <App history={history} />
     </Router>,
  document.getElementById('render-target'));
});
