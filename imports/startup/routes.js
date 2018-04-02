import React from 'react';
import { Router, Route, Switch } from 'react-router';
import createBrowserHistory from 'history/createBrowserHistory';
import { render } from 'react-dom';

import './accounts.js';

// route components
import App		from '../ui/App.js';
import Settings from '../ui/Settings.js';
import Chart 	from '../ui/Chart.js';
import NotFound from '../ui/NotFound.js';

const browserHistory = createBrowserHistory();

Meteor.startup(() => {
  render(
     <Router history={browserHistory}>
        <App history={history} />
     </Router>,
  document.getElementById('render-target'));
});
