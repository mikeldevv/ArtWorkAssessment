'use client'

import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

async function fetchData(): Promise<ArtAPIResponseArtworks> {
  const res = await fetch('https://api.artic.edu/api/v1/artworks');
  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
  return await res.json();
}

const Home: React.FC = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);

  useEffect(() => {
    fetchData()
      .then(data => {
        setArtworks(data.data);
      })
      .catch(error => {
        console.error("Failed to fetch artworks:", error);
      });
  }, []);

  return (
    <main className="max-w-6xl mx-auto p-4">
      <h1 className="text-center text-4xl font-bold mb-12 text-gray-800">Artwork Collection</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {artworks.map((artwork) => (
          <Link key={artwork.id.toString()} href={`/artwork/${artwork.id}`} legacyBehavior>
            <a className="group cursor-pointer border rounded-lg overflow-hidden shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-2xl">
              <div className="relative h-60">
                {artwork.image_id ? (
                  <Image
                    src={`https://www.artic.edu/iiif/2/${artwork.image_id}/full/843,/0/default.jpg`}
                    alt={artwork.title || 'Artwork image'}
                    layout="fill"
                    objectFit="cover"
                    unoptimized={true}
                    className="transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="flex items-center justify-center bg-gray-200 h-full">
                    Image not available
                  </div>
                )}
              </div>
              <div className="p-4 bg-white">
                <h2 className="text-xl font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">{artwork.title}</h2>
              </div>
            </a>
          </Link>
        ))}
      </div>
    </main>
  );
};

export default Home;
