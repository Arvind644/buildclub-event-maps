import dynamic from 'next/dynamic';

const EventMap = dynamic(() => import('./components/EventMap'), {
  ssr: false, // Disable server-side rendering for this component
  loading: () => <div>Loading map...</div>
});

export default function Home() {
  return (
    <main className="main-container">
      <EventMap />
    </main>
  );
}
