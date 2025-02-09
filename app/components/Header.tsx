import Image from 'next/image';

export default function Header() {
  return (
    <header className="header">
      <div className="header-content">
        <Image 
          src="/images/buildclub-long.png" 
          alt="BuildClub Logo" 
          width={180} 
          height={45} 
          className="logo"
        />
        <h1>Global Events Map</h1>
      </div>
    </header>
  );
} 