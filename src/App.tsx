import { Component } from 'react';
import './App.css';

class SearchSection extends Component {
    render() {
        return (
            <div className="search-section">
                <input type="text" placeholder="Search..." className="search-input" />
                <button className="search-button">Search</button>
            </div>
        );
    }
}

class ResultsSection extends Component {
    render() {
        return (
            <div className="results-section">
                <p>Results will appear here...</p>
            </div>
        );
    }
}

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