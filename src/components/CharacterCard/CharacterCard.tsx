import { Component } from 'react';
import type { Character } from '../../api';

import './CharacterCard.css';
import { ANONYMOUS_IMAGE } from '../../constants';

interface CharacterCardProps {
  character: Character;
}

export class CharacterCard extends Component<CharacterCardProps> {
  render() {
    const { name, house, species, gender, image } = this.props.character;

    return (
      <div className="character-card">
        <img
          src={image || ANONYMOUS_IMAGE}
          onError={(e) => (e.currentTarget.src = ANONYMOUS_IMAGE)}
          alt={name}
          className="character-image"
        />
        <div className="character-info">
          <h3 className="character-name">{name}</h3>
          <div className="character-details">
            {house && (
              <p>
                <strong>House:</strong> {house}
              </p>
            )}
            {species && (
              <p>
                <strong>Species:</strong> {species}
              </p>
            )}
            {gender && (
              <p>
                <strong>Gender:</strong> {gender}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }
}
