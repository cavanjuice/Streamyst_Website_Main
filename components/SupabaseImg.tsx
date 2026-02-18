
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { getAssetUrl } from '../utils/supabaseClient';
import { ImageOff } from 'lucide-react';

interface SupabaseImgProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    filename: string;
    fallback?: React.ReactNode;
}

export const SupabaseImg: React.FC<SupabaseImgProps> = ({ filename, alt, className, fallback, ...props }) => {
    // Generate URL synchronously/immediately to start fetching as soon as possible
    const src = useMemo(() => filename ? getAssetUrl(filename) : '', [filename]);
    const [error, setError] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const imgRef = useRef<HTMLImageElement>(null);

    // Reset state if filename changes
    useEffect(() => {
        setError(false);
        setIsLoaded(false);
    }, [filename]);

    // Check if image is already loaded (e.g. from cache) immediately upon mount or src change
    useEffect(() => {
        if (imgRef.current && imgRef.current.complete) {
            // Check naturalWidth to ensure it's not a broken image 'complete' state
            if (imgRef.current.naturalWidth > 0) {
                setIsLoaded(true);
            }
        }
    }, [src]);

    if (error || !src) {
        if (fallback) return <>{fallback}</>;
        
        // Default fallback: A subtle placeholder box
        return (
            <div className={`flex flex-col items-center justify-center bg-white/5 border border-white/10 rounded overflow-hidden p-2 text-center ${className}`} title={`Failed to load: ${filename}`}>
                <ImageOff className="text-gray-600 w-6 h-6 mb-1" />
                <span className="text-[8px] text-gray-600 font-mono break-all px-1">Asset Missing</span>
            </div>
        );
    }

    return (
        <img 
            ref={imgRef}
            src={src} 
            alt={alt} 
            loading="lazy"
            decoding="async"
            // Reordered classes: Default transition first, then className overrides. 
            // This allows 'transition-all' in className to supersede 'transition-opacity'.
            className={`transition-opacity duration-700 ease-out ${isLoaded ? 'opacity-100' : 'opacity-0'} ${className}`} 
            onLoad={() => setIsLoaded(true)}
            onError={(e) => {
                console.warn(`[SupabaseImg] Failed to load image: ${filename}`);
                // Don't warn about bucket here, just set error state
                setError(true);
            }}
            {...props} 
        />
    );
};
