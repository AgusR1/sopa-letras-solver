import React from "react";

interface WordsListProps {
  palabras: string[];
}

const WordsList: React.FC<WordsListProps> = ({ palabras }) => {
  return (
    <div className="palabras-container">
      <h2 className="subtitle">Palabras a encontrar:</h2>
      <ul className="palabras-list">
        {palabras.map((word, index) => (
          <li key={index} className="palabra-item">
            {word}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WordsList;
