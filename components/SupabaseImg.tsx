
import React, { useState, useEffect, useMemo } from 'react';
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

    // Reset error state if filename changes
    useEffect(() => {
        setError(false);
    }, [filename]);

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
            src={src} 
            alt={alt} 
            className={className} 
            onError={(e) => {
                console.warn(`[SupabaseImg] Failed to load image: ${filename}`);
                // Don't warn about bucket here, just set error state
                setError(true);
            }}
            {...props} 
        />
    );
};
