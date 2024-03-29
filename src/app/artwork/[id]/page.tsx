'use client';

import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';

const BASE_IIIF_URL = 'https://www.artic.edu/iiif/2';

const fetchArtworkById = async (id: number): Promise<Artwork> => {
  const res = await fetch(`https://api.artic.edu/api/v1/artworks/${id}`);
  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
  const json = await res.json();
  return json.data;
};

const ArtworkPage = () => {
  const { id } = useParams();

  const [artwork, setArtwork] = useState<Artwork | null>(null);
  const [showDescription, setShowDescription] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const artworkId = Number(id);
    if (!id || isNaN(artworkId)) {
      setError('Invalid artwork ID');
      return;
    }

    setLoading(true);
    fetchArtworkById(artworkId)
      .then((data) => {
        setArtwork(data);
        setError(null);
      })
      .catch((error) => {
        console.error("Failed to fetch artwork:", error);
        setError('Failed to fetch artwork');
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (error) return <div>Error: {error}</div>;
  if (loading) return <div>Loading...</div>;
  if (!artwork) return <div>No artwork found</div>;

  const imageUrl = artwork.image_id 
      ? `${BASE_IIIF_URL}/${artwork.image_id}/full/843,/0/default.jpg`
      : artwork.thumbnail.lqip;

      return (
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-center mb-8">
            {artwork.title}
          </h1>
          
          <div className="relative w-full h-0 pb-[75%]"> {/* Aspect ratio container */}
            <Image
              src={imageUrl}
              alt={artwork.title || 'Artwork image'}
              layout="fill"
              objectFit="contain"
              unoptimized={true}
              className="rounded-lg shadow-lg"
            />
          </div>
          
          <div className="text-center my-4">
            <button 
              onClick={() => setShowDescription(!showDescription)}
              className="bg-blue-500 hover:bg-blue-700 text-white font-medium rounded-lg text-sm px-5 py-2.5"
            >
              {showDescription ? 'Hide Description' : 'Show Description'}
            </button>
          </div>
          
          {showDescription && (
            <div className="mt-4 bg-gray-100 rounded-lg shadow px-4 py-6">
              <p className="text-gray-700">{artwork.description}</p>
            </div>
          )}
        </div>
      );
      
};

export default ArtworkPage;
