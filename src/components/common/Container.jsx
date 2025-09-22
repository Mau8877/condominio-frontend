import React from 'react';
import "./styles/Container.css";

export default function Container({ children }) {
  return (
    <main className="main-container">
      <div className="content-wrapper">
        {children}
      </div>
    </main>
  );
}