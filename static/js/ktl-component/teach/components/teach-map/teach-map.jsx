import React, {useCallback, useEffect, useState} from 'react';
import GoogleMapReact from 'google-map-react';
import {TeachMapMarker} from './teach-map-marker.jsx';
import './teach-map.scss';

const settings = {
  key: 'AIzaSyAMF-gJllft62W5l9xfgE6DBhaa6YmIJs0',
  defaultCenter: {
    lat: 20,
    lng: 0
  },
  defaultZoom: 2,
  options: {
    fullscreenControl: false,
    styles: [
      {
        featureType: 'all',
        'stylers': [
          {'visibility': 'simplified'}
        ]
      },
      {
        'featureType': 'administrative.country',
        'stylers': [
          {'visibility': 'off'}
        ]
      },
      {
        'featureType': 'road.arterial',
        'stylers': [
          {'visibility': 'off'}
        ]
      },
      {
        'featureType': 'water',
        'stylers': [
          {'color': '#75cff0'},
          {'visibility': 'on'}
        ]
      },
      {
        'featureType': 'water',
        'elementType': 'labels.text',
        'stylers': [
          {'visibility': 'off'}
        ]
      }
    ],
    minZoom: 2
  }
};

export const TeachMap = () => {
  const [universities, setUniversities] = useState([]);
  const [activeId, setActiveId] = useState('');

  const handleChildClick = useCallback((key) => {
    setActiveId(key);
  }, []);

  useEffect(() => {
    fetch('/data/universities.json')
      .then(response => {
        return response.json();
      })
      .then(data => {
        const items = data.map(university => {
          return {
            ...university,
            id: `${university.title}-${university.location}`
          }
        });
        setUniversities(items)
      });
  }, []);

  return (
    <div className="teach-map">
      <GoogleMapReact
        bootstrapURLKeys={{key: settings.key}}
        defaultCenter={settings.defaultCenter}
        defaultZoom={settings.defaultZoom}
        options={settings.options}
        onChildClick={handleChildClick}
      >
        {universities.map(item => (
          <TeachMapMarker
            key={item.id}
            lat={item.geo.lat}
            lng={item.geo.lng}
            university={item}
            showTooltip={item.id === activeId}
            onClose={handleChildClick}
          />
        ))}

      </GoogleMapReact>
    </div>
  );
}