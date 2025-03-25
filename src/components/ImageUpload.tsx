import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Loader2 } from 'lucide-react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../lib/firebase';

interface ImageUploadProps {
  onImageUpload: (url: string) => void;
  currentImage?: string;
}

const ImageUpload = ({ onImageUpload, currentImage }: ImageUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const compressImage = async (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Calculate new dimensions while maintaining aspect ratio
          const maxSize = 1200; // Max width/height
          if (width > height && width > maxSize) {
            height = Math.round((height * maxSize) / width);
            width = maxSize;
          } else if (height > maxSize) {
            width = Math.round((width * maxSize) / height);
            height = maxSize;
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Could not get canvas context'));
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);
          
          // Convert to blob with reduced quality
          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(blob);
              } else {
                reject(new Error('Could not compress image'));
              }
            },
            'image/jpeg',
            0.7 // Quality (0.7 = 70% quality)
          );
        };
        img.onerror = reject;
      };
      reader.onerror = reject;
    });
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setError(null);
      setUploadProgress(0);
      
      // Show preview immediately
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
      
      // Compress image before upload
      const compressedBlob = await compressImage(file);
      
      // Create a unique filename
      const timestamp = Date.now();
      const filename = `${timestamp}-${file.name.replace(/\.[^/.]+$/, '')}.jpg`;
      
      // Upload to Firebase Storage
      const storageRef = ref(storage, `project-images/${filename}`);
      await uploadBytes(storageRef, compressedBlob);
      
      // Get the download URL
      const downloadURL = await getDownloadURL(storageRef);
      
      // Update preview with the Firebase URL
      setPreview(downloadURL);
      onImageUpload(downloadURL);
      
      // Clean up the temporary preview URL
      URL.revokeObjectURL(previewUrl);
    } catch (error) {
      console.error('Error uploading image:', error);
      setError('Failed to upload image. Please try again.');
      setPreview(null);
      onImageUpload('');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  }, [onImageUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024 // 10MB max size
  });

  const handleRemove = () => {
    setPreview(null);
    setError(null);
    onImageUpload('');
  };

  return (
    <div className="space-y-2">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}
          ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
          ${error ? 'border-destructive' : ''}`}
      >
        <input {...getInputProps()} />
        {preview ? (
          <div className="relative">
            <img
              src={preview}
              alt="Preview"
              className="max-h-48 mx-auto rounded-lg"
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleRemove();
              }}
              className="absolute top-2 right-2 p-1 bg-destructive text-white rounded-full hover:bg-destructive/90"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <Upload className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">
              {isDragActive
                ? 'Drop the image here'
                : 'Drag & drop an image here, or click to select'}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Max size: 10MB. Supported formats: PNG, JPG, GIF
            </p>
          </div>
        )}
      </div>
      {isUploading && (
        <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Uploading image...</span>
          {uploadProgress > 0 && <span>({uploadProgress}%)</span>}
        </div>
      )}
      {error && (
        <p className="text-sm text-destructive text-center">
          {error}
        </p>
      )}
    </div>
  );
};

export default ImageUpload; 