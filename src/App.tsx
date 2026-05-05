import { ResultsSection, SearchSection } from "./components";
import './App.css';

function App() {
    return (
        <div className="app-container">
            <div className="top-controls">
                <SearchSection />
            </div>
            <div className="bottom-results">
                <ResultsSection />
            </div>
        </div>
    );
}

export default App;