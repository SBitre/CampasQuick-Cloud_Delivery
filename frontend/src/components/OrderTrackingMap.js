import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GoogleMap, LoadScript, Marker, DirectionsRenderer } from '@react-google-maps/api';
import './OrderTrackingMap.css';

const GOOGLE_MAPS_API_KEY = 'AIzaSyD2zK4TGxudo-bDjonrEFSrzHzBVUpoFzA';

// College Convenience Store location (Northeastern University area)
const STORE_LOCATION = {
  lat: 42.3398,
  lng: -71.0892
};

const mapContainerStyle = {
  width: '100%',
  height: '300px',
  borderRadius: '12px'
};

const mapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: true,
  styles: [
    {
      featureType: 'poi',
      elementType: 'labels',
      stylers: [{ visibility: 'off' }]
    }
  ]
};

function OrderTrackingMap({ 
  deliveryAddress, 
  orderStatus, 
  isSimulating = false,
  onSimulationComplete 
}) {
  const [deliveryLocation, setDeliveryLocation] = useState(null);
  const [runnerLocation, setRunnerLocation] = useState(null);
  const [directions, setDirections] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [simulationProgress, setSimulationProgress] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState(null);
  const simulationRef = useRef(null);
  const routePathRef = useRef([]);

  // Geocode delivery address to coordinates
  const geocodeAddress = useCallback(async (address) => {
    if (!window.google) return null;
    
    const geocoder = new window.google.maps.Geocoder();
    
    return new Promise((resolve) => {
      // Add "Boston, MA" to help with local addresses
      const fullAddress = address.includes('Boston') || address.includes('MA') 
        ? address 
        : `${address}, Boston, MA`;
      
      geocoder.geocode({ address: fullAddress }, (results, status) => {
        if (status === 'OK' && results[0]) {
          resolve({
            lat: results[0].geometry.location.lat(),
            lng: results[0].geometry.location.lng()
          });
        } else {
          // Default to a location near campus if geocoding fails
          resolve({
            lat: 42.3385 + (Math.random() * 0.005),
            lng: -71.0880 + (Math.random() * 0.005)
          });
        }
      });
    });
  }, []);

  // Get directions from store to delivery
  const getDirections = useCallback(async (destination) => {
    if (!window.google || !destination) return;

    const directionsService = new window.google.maps.DirectionsService();

    directionsService.route(
      {
        origin: STORE_LOCATION,
        destination: destination,
        travelMode: window.google.maps.TravelMode.WALKING
      },
      (result, status) => {
        if (status === 'OK') {
          setDirections(result);
          
          // Extract route path for simulation
          const path = result.routes[0].overview_path.map(point => ({
            lat: point.lat(),
            lng: point.lng()
          }));
          routePathRef.current = path;
          
          // Get estimated time
          const duration = result.routes[0].legs[0].duration.text;
          setEstimatedTime(duration);
        }
      }
    );
  }, []);

  // Initialize map and geocode address
  useEffect(() => {
    if (mapLoaded && deliveryAddress) {
      geocodeAddress(deliveryAddress).then(location => {
        if (location) {
          setDeliveryLocation(location);
          getDirections(location);
        }
      });
    }
  }, [mapLoaded, deliveryAddress, geocodeAddress, getDirections]);

  // Set runner location based on order status
  useEffect(() => {
    if (!deliveryLocation) return;

    switch (orderStatus) {
      case 'pending':
      case 'accepted':
        setRunnerLocation(null);
        break;
      case 'picking':
        setRunnerLocation(STORE_LOCATION);
        break;
      case 'out_for_delivery':
        // Runner is somewhere between store and delivery
        if (!isSimulating) {
          // Show runner at midpoint if not simulating
          setRunnerLocation({
            lat: (STORE_LOCATION.lat + deliveryLocation.lat) / 2,
            lng: (STORE_LOCATION.lng + deliveryLocation.lng) / 2
          });
        }
        break;
      case 'delivered':
        setRunnerLocation(deliveryLocation);
        break;
      default:
        break;
    }
  }, [orderStatus, deliveryLocation, isSimulating]);

  // Simulation logic
  useEffect(() => {
    if (isSimulating && routePathRef.current.length > 0) {
      const totalSteps = routePathRef.current.length;
      let currentStep = 0;

      simulationRef.current = setInterval(() => {
        currentStep++;
        const progress = (currentStep / totalSteps) * 100;
        setSimulationProgress(progress);

        if (currentStep < totalSteps) {
          setRunnerLocation(routePathRef.current[currentStep]);
        } else {
          // Simulation complete
          clearInterval(simulationRef.current);
          setRunnerLocation(routePathRef.current[totalSteps - 1]);
          if (onSimulationComplete) {
            onSimulationComplete();
          }
        }
      }, 500); // Move every 500ms

      return () => {
        if (simulationRef.current) {
          clearInterval(simulationRef.current);
        }
      };
    }
  }, [isSimulating, onSimulationComplete]);

  const onMapLoad = useCallback(() => {
    setMapLoaded(true);
  }, []);

  const getStatusMessage = () => {
    switch (orderStatus) {
      case 'pending':
        return '⏳ Waiting for store to accept...';
      case 'accepted':
        return '✅ Order accepted! Preparing items...';
      case 'picking':
        return '🛒 Runner is picking up your order...';
      case 'out_for_delivery':
        return `🚴 Runner is on the way! ${estimatedTime ? `(~${estimatedTime})` : ''}`;
      case 'delivered':
        return '🎉 Order delivered!';
      default:
        return '';
    }
  };

  // Calculate map center
  const mapCenter = deliveryLocation 
    ? {
        lat: (STORE_LOCATION.lat + deliveryLocation.lat) / 2,
        lng: (STORE_LOCATION.lng + deliveryLocation.lng) / 2
      }
    : STORE_LOCATION;

  return (
    <div className="order-tracking-map">
      <div className="map-header">
        <h4>📍 Live Order Tracking</h4>
        <span className="status-message">{getStatusMessage()}</span>
      </div>

      <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={mapCenter}
          zoom={15}
          options={mapOptions}
          onLoad={onMapLoad}
        >
          {/* Store Marker */}
          <Marker
            position={STORE_LOCATION}
            icon={{
              url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
                  <circle cx="20" cy="20" r="18" fill="#1a5e3a" stroke="white" stroke-width="3"/>
                  <text x="20" y="26" text-anchor="middle" font-size="18">🏪</text>
                </svg>
              `),
              scaledSize: mapLoaded && window.google 
                ? new window.google.maps.Size(40, 40)
                : null
            }}
            title="College Convenience Store"
          />

          {/* Delivery Location Marker */}
          {deliveryLocation && (
            <Marker
              position={deliveryLocation}
              icon={{
                url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
                    <circle cx="20" cy="20" r="18" fill="#e74c3c" stroke="white" stroke-width="3"/>
                    <text x="20" y="26" text-anchor="middle" font-size="18">🏠</text>
                  </svg>
                `),
                scaledSize: mapLoaded && window.google 
                  ? new window.google.maps.Size(40, 40)
                  : null
              }}
              title="Delivery Location"
            />
          )}

          {/* Runner Marker */}
          {runnerLocation && ['picking', 'out_for_delivery'].includes(orderStatus) && (
            <Marker
              position={runnerLocation}
              icon={{
                url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                  <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50">
                    <circle cx="25" cy="25" r="22" fill="#3498db" stroke="white" stroke-width="3"/>
                    <text x="25" y="32" text-anchor="middle" font-size="22">🚴</text>
                  </svg>
                `),
                scaledSize: mapLoaded && window.google 
                  ? new window.google.maps.Size(50, 50)
                  : null
              }}
              title="Runner"
              zIndex={1000}
            />
          )}

          {/* Route Line */}
          {directions && (
            <DirectionsRenderer
              directions={directions}
              options={{
                polylineOptions: {
                  strokeColor: '#1a5e3a',
                  strokeWeight: 4,
                  strokeOpacity: 0.7
                },
                suppressMarkers: true
              }}
            />
          )}
        </GoogleMap>
      </LoadScript>

      {/* Progress Bar for Simulation */}
      {isSimulating && (
        <div className="simulation-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${simulationProgress}%` }}
            />
          </div>
          <span className="progress-text">
            Runner en route... {Math.round(simulationProgress)}%
          </span>
        </div>
      )}

      {/* Map Legend */}
      <div className="map-legend">
        <div className="legend-item">
          <span className="legend-icon">🏪</span>
          <span>College Convenience</span>
        </div>
        <div className="legend-item">
          <span className="legend-icon">🏠</span>
          <span>Your Location</span>
        </div>
        {runnerLocation && (
          <div className="legend-item">
            <span className="legend-icon">🚴</span>
            <span>Runner</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default OrderTrackingMap;