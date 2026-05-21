import { Link } from 'react-router-dom';
import './AboutPage.css';

export function AboutPage() {
  return (
    <div className="about-container">
      <h1>About Hogwarts Archive</h1>
      <p>This application is a test page for HarryPotter API.</p>
      <p>
        Author:{' '}
        <a
          href="https://github.com/theFoxTale"
          target="_blank"
          rel="noopener noreferrer"
        >
          Annie theFoxTale
        </a>
      </p>
      <p>
        Course:{' '}
        <a
          href="https://rs.school/react/"
          target="_blank"
          rel="noopener noreferrer"
        >
          RS School React
        </a>
      </p>
      <Link to="/">← Back to Home</Link>
    </div>
  );
}
