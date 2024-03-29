'use client';

import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';

// Type definitions (for Artwork, etc.) should be imported or defined above

const fetchArtworkById = async (id: number): Promise<Artwork> => {
    const res = await fetch(`https://api.artic.edu/api/v1/artworks/${id}`);
    if (!res.ok) {
      throw new Error('Failed to fetch data');
    }
    const json = await res.json();
    return json.data; // Ensure the API response structure matches
};

const ArtworkPage = () => {
    const { id } = useParams();

    const [artwork, setArtwork] = useState<Artwork | null>(null);
    const [showDescription, setShowDescription] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Ensure `id` is present and is a number
        const artworkId = Number(id);
        if (!id || isNaN(artworkId)) {
            setError('Invalid artwork ID');
            return;
        }

        setLoading(true);
        fetchArtworkById(artworkId)
            .then((data) => {
                setArtwork(data);
                setError(null); // Reset error state in case of successful fetch
            })
            .catch((error) => {
                console.error("Failed to fetch artwork:", error);
                setError('Failed to fetch artwork');
            })
            .finally(() => setLoading(false));
    }, [id]); // Depend on `id` to trigger useEffect

    if (error) return <div>Error: {error}</div>;
    if (loading) return <div>Loading...</div>;
    if (!artwork) return <div>No artwork found</div>;

    return (
        <div>
            <h1>{artwork.title}</h1>
            <Image
            src={artwork.thumbnail.lqip} // Ensure this is a valid URL
            alt={artwork.title || 'Artwork image'}
            width={500}
            height={500}
            // Add this prop if you're using external images not optimized by Next.js by default
            unoptimized={true}
          />
            <button onClick={() => setShowDescription(!showDescription)}>
                {showDescription ? 'Hide' : 'Show'} Description
            </button>
            {showDescription && <p>{artwork.description}</p>} {/* Show dimensions as placeholder for description */}
        </div>
    );
};

export default ArtworkPage;
