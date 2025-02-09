'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';

// Update interface to match actual Luma event structure
interface LumaEvent {
  api_id: string;
  name: string;
  location: {
    venue?: string;
    address?: string;
    city?: string;
    country?: string;
    geo?: {
      latitude: number;
      longitude: number;
    };
  };
  start_at: string;
  description?: string;
  cover_url?: string;
}

interface EventsByCountry {
  [country: string]: LumaEvent[];
}

export default function EventMap() {
  const [events, setEvents] = useState<LumaEvent[]>([]);
  const [eventsByCountry, setEventsByCountry] = useState<EventsByCountry>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize the icon with local files
  const customIcon = new Icon({
    iconUrl: '/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/events');
        const data = await response.json();
        console.log('Raw API response:', data); // Debug log

        if (!data.events) {
          throw new Error('No events data received');
        }

        const validEvents = data.events.filter((event: LumaEvent) => {
          const hasCoordinates = event.location?.geo?.latitude && event.location?.geo?.longitude;
          console.log(`Event ${event.name}:`, hasCoordinates ? 'has coordinates' : 'no coordinates');
          return hasCoordinates;
        });

        console.log('Valid events:', validEvents);

        const groupedEvents = validEvents.reduce((acc: EventsByCountry, event: LumaEvent) => {
          const country = event.location?.country || 'Unknown';
          if (!acc[country]) {
            acc[country] = [];
          }
          acc[country].push(event);
          return acc;
        }, {});

        setEvents(validEvents);
        setEventsByCountry(groupedEvents);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return <div className="loading">Loading events...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="map-container">
      <MapContainer
        center={[20, 0]}
        zoom={2}
        className="map"
        minZoom={2}
        maxZoom={18}
        worldCopyJump={false}
        maxBounds={[[-90, -180], [90, 180]]}
        zoomControl={true}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {events.length > 0 && events.map((event) => (
          <Marker
            key={event.api_id}
            position={[event.location.geo!.latitude, event.location.geo!.longitude]}
            icon={customIcon}
          >
            <Popup className="custom-popup">
              <div className="popup-content">
                <h3>{event.name}</h3>
                <p className="location">
                  {[
                    event.location.venue,
                    event.location.city,
                    event.location.country
                  ].filter(Boolean).join(', ')}
                </p>
                <p className="date">
                  {new Date(event.start_at).toLocaleDateString()}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <div className="events-summary">
        <h2>Upcoming Events by Country</h2>
        {Object.entries(eventsByCountry).map(([country, countryEvents]) => (
          <div key={country} className="country-events">
            <h3>{country} ({countryEvents.length})</h3>
            <div className="events-list">
              {countryEvents.map(event => (
                <div key={event.api_id} className="event-item">
                  <h4>{event.name}</h4>
                  <p>{new Date(event.start_at).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 