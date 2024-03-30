'use client';

import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import DOMPurify from 'isomorphic-dompurify';

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
    const router = useRouter();
    const goToCollections = () => {
        router.push('/');
    };

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
                const sanitizedDescription = DOMPurify.sanitize(data.description || '');
                setArtwork({ ...data, description: sanitizedDescription });
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
            <div className="mb-4">
                <button
                    onClick={goToCollections}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-200 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
                >
                    &#8592; Back to Collections
                </button>
            </div>

            <h1 className="text-3xl font-bold text-center mb-8">
                {artwork.title}
            </h1>
            <div className="relative w-full overflow-hidden bg-gray-100/50" style={{ paddingTop: '56.25%' }}>
                <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center">
                    <Image
                        src={imageUrl}
                        alt={artwork.title || 'Artwork image'}
                        layout="fill"
                        objectFit="contain"
                        unoptimized={true}
                        className="rounded-lg"
                    />
                </div>
            </div>

            <div className="text-center my-4">
                <button
                    onClick={() => setShowDescription(!showDescription)}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold rounded-lg text-sm px-5 py-2.5"
                >
                    {showDescription ? 'Hide Description' : 'Show Description'}
                </button>
            </div>

            {showDescription && (
                <div className="mt-4 bg-gray-100 rounded-lg shadow px-4 py-6">
                    {/* Render sanitized HTML content */}
                    <div className="text-gray-700 text-base md:text-lg leading-relaxed" dangerouslySetInnerHTML={{ __html: artwork.description || "This Art piece has no description" }}></div>
                </div>
            )}
        </div>
    );
};

export default ArtworkPage;
