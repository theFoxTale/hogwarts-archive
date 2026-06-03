import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { AboutPage, HomePage, NotFoundPage } from '@pages';
import { CharacterDetails } from '@features';

const basename = import.meta.env.BASE_URL;

export function App() {
  return (
    <BrowserRouter basename={basename}>
      <Routes>
        <Route path="/:page?" element={<HomePage />}>
          <Route path=":characterId?" element={<CharacterDetails />} />
        </Route>
        <Route path="/about" element={<AboutPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
