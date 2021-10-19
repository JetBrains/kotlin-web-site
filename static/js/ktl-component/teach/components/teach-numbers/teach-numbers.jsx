import React from 'react';

export const TeachNumbers = ({universities}) => {

  const getUniversitiesCount = () => universities.length;

  const getCountriesCount = () => {
    const locations = [];
    universities.forEach(university => {
      const data = /\(([^)]*)\)/.exec(university.location)[1];
      locations.push(data);
    })
    const countries = new Set(locations);
    return countries.size;
  }

  return (
    <div className="teach-numbers">
      <div className="teach-number">
        <div className="teach-number__title">
          <div className="ktl-hero">
            {getCountriesCount()}
          </div>
        </div>
        <div className="teach-number__subtitle">
          <div className="ktl-text-2">
            countries
          </div>
        </div>
      </div>
      <div className="teach-number">
        <div className="teach-number__title">
          <div className="ktl-hero">
            {getUniversitiesCount()}
          </div>
        </div>
        <div className="teach-number__subtitle">
          <div className="ktl-text-2">
            universities
          </div>
        </div>
      </div>
    </div>
  )
}