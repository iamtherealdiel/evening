import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import { uploadImage, getImageUrl } from '../lib/supabase';

interface ImageUploadProps {
  onUploadComplete?: (url: string) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onUploadComplete }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setError(null);

      // Generate a unique file path
      const timestamp = new Date().getTime();
      const path = `uploads/${timestamp}-${file.name}`;

      // Upload the file
      await uploadImage(file, path);
      
      // Get the public URL
      const publicUrl = getImageUrl(path);
      
      onUploadComplete?.(publicUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="relative">
      <label 
        className={`flex items-center justify-center px-6 py-4 border-2 border-dashed rounded-lg cursor-pointer
          ${isUploading ? 'bg-gray-100 border-gray-300' : 'border-white/20 hover:border-white/40'}
          transition-colors duration-200`}
      >
        <input
          type="file"
          className="hidden"
          accept="image/*"
          onChange={handleUpload}
          disabled={isUploading}
        />
        <div className="flex flex-col items-center space-y-2">
          <Upload className="w-6 h-6 text-white/60" />
          <span className="text-sm text-white/60">
            {isUploading ? 'Uploading...' : 'Click to upload image'}
          </span>
        </div>
      </label>
      
      {error && (
        <p className="mt-2 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

export default ImageUpload;