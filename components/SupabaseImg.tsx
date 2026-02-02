
import React, { useState, useEffect } from 'react';
import { getAssetUrl } from '../utils/supabaseClient';
import { ImageOff } from 'lucide-react';

interface SupabaseImgProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    filename: string;
    fallback?: React.ReactNode;
}

export const SupabaseImg: React.FC<SupabaseImgProps> = ({ filename, alt, className, fallback, ...props }) => {
    const [src, setSrc] = useState<string>('');
    const [error, setError] = useState(false);

    useEffect(() => {
        if (filename) {
            const url = getAssetUrl(filename);
            setSrc(url);
            setError(false);
        }
    }, [filename]);

    if (error) {
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
                console.warn(`Check if the bucket 'assets' exists in Supabase and is set to PUBLIC.`);
                setError(true);
            }}
            {...props} 
        />
    );
};
