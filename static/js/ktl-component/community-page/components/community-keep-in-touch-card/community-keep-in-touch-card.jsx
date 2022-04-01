import React from 'react';

import './style.scss';

export const CommunityKeepInTouchCard = ({icon, title, description, link}) => {

  return (
    <a href={link} target="_blank" rel="noreferrer noopener" className="community-keep-in-touch-card">
      <div className="community-keep-in-touch-card__icon">
        <img src={icon} alt={title}/>
      </div>

      <div className="community-keep-in-touch-card__bottom">
        <div className="community-keep-in-touch-card__title">
          <div className="ktl-h3">
            {title}
          </div>
        </div>
        <div className="community-keep-in-touch-card__description ktl-offset-top-xs">
          <div className="ktl-text-1 ktl-dimmed-text">
            {description}
          </div>
        </div>
      </div>
    </a>
  )
}
