'use client'

import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
// Assuming the types are imported or defined in the same file
// import { ArtAPIResponseArtworks, Artwork } from '../types';

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
        setArtworks(data.data); // Assuming the API returns the structure according to ArtAPIResponseArtworks
      })
      .catch(error => {
        console.error("Failed to fetch artworks:", error);
        // Ideally, you'd handle the error more gracefully
      });
  }, []);

  return (
    <main className="p-4">
      <h1 className="text-center text-4xl font-bold mb-8">Artwork Collection</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {artworks.map((artwork) => (
  <Link key={artwork.id.toString()} href={`/artwork/${artwork.id}`} legacyBehavior>
    <a className="cursor-pointer border rounded-lg overflow-hidden shadow-lg transform transition duration-300 hover:scale-105">
      <div className="relative h-60">
        {/* Ensure the artwork has a thumbnail and the lqip is a valid image URL */}
        {artwork.thumbnail && artwork.thumbnail.lqip ? (
          <Image
            src={artwork.thumbnail.lqip} // Ensure this is a valid URL
            alt={artwork.title || 'Artwork image'}
            layout="fill"
            objectFit="cover"
            // Add this prop if you're using external images not optimized by Next.js by default
            unoptimized={true}
          />
        ) : (
          // Placeholder for artworks without an image
          <div className="flex items-center justify-center bg-gray-200 h-full">
            Image not available
          </div>
        )}
      </div>
      <div className="p-4">
        <h2 className="text-xl font-semibold">{artwork.title}</h2>
      </div>
    </a>
  </Link>
))}
      </div>
    </main>
  );
};

export default Home;
