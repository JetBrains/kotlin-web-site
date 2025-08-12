export const settings = {
  key: 'AIzaSyD4Lyv4gCOMhDlWrdlcn3pOLSwCpnDtn9k',
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