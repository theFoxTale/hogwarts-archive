import {Component} from "react";
import './SearchSection.css';

export class SearchSection extends Component {
    render() {
        return (
            <div className="search-section">
                <input type="text" placeholder="Search..." className="search-input" />
                <button className="search-button">Search</button>
            </div>
        );
    }
}