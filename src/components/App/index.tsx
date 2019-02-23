/*
 * Package Import
 */
import React from 'react';
import { Switch, Route } from 'react-router-dom';

/*
 * Local Import
 */
// import Layout from 'src/components/Layout';
import routes from 'app/config/routes';

/*
 * Component
 */
const App = () => (
  // <Layout>
    <Switch>
      {routes.map(({ exact, path, component: Component }) => (
        <Route key={path} exact={exact} path={path} component={Component} />
      ))}
    </Switch>
  // </Layout>
);

/*
 * Export
 */
export default App;