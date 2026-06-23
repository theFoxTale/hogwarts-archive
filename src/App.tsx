import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { HomePage } from '@pages';
import { CharacterDetails } from '@features';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/:page?" element={<HomePage />}>
          <Route path=":characterId?" element={<CharacterDetails />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
