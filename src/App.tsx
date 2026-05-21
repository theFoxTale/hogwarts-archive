import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AboutPage, HomePage, NotFoundPage } from './pages';
import { CharacterDetails } from './components';

const basename = import.meta.env.BASE_URL;

export function App() {
  return (
    <BrowserRouter basename={basename}>
      <Routes>
        <Route path="/" element={<HomePage />}>
          <Route path="details/:characterId" element={<CharacterDetails />} />
        </Route>
        <Route path="/about" element={<AboutPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
