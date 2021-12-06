import React, {useMemo} from 'react';

import './style.scss';

export const TeachNumbers = ({countriesCount, universitiesCount}) => {

  return (
    <div className="teach-numbers">
      <div className="teach-number">
        <div className="teach-number__title">
          <div className="ktl-hero">
            {countriesCount}
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
            {universitiesCount}
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