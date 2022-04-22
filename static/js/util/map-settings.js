export const settings = {
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