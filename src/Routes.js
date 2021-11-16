import { Routes as Switch, Route } from 'react-router-dom';

import Home from './pages/Home';
import NewContact from './pages/NewContact';
import EditContact from './pages/EditContact';

export default function Routes() {
  return (
    <Switch>
      <Route exact path="/" element={<Home/>}/>
      <Route path="/new" element={<NewContact/>}/>
      <Route path="/edit/:id" element={<EditContact/>}/>
    </Switch>
  );
}
