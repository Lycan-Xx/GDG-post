import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { usePosts } from '../../contexts/PostContext';
import { mediaService } from '../../services/mediaService';
import type { MediaItem } from '../../types/models';
import { Button } from '../shared/Button';
import { LoadingSpinner } from '../shared/LoadingSpinner';
import './UploadFlow.css';

interface SelectedFile {
  file: File;
  preview: string;
  isVideo: boolean;
  duration?: number;
}

export function UploadFlow() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createPost } = usePosts();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFiles, setSelectedFiles] = useState<SelectedFile[]>([]);
  const [description, setDescription] = useState('');
  const [isCompressing, setIsCompressing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [compressionProgress, setCompressionProgress] = useState({ current: 0, total: 0 });
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (selectedFiles.length + files.length > 3) {
      setError('Maximum 3 files allowed');
      return;
    }

    setError(null);

    for (const file of files) {
      const validation = mediaService.validateFile(file);
      if (!validation.valid) {
        setError(validation.error || 'Invalid file');
        continue;
      }

      const isVideo = file.type.startsWith('video/');
      let preview = '';
      let duration: number | undefined;

      if (isVideo) {
        try {
          preview = await mediaService.generateThumbnail(file);
          duration = await mediaService.getVideoDuration(file);
        } catch (err) {
          console.error('Failed to process video:', err);
          setError('Failed to process video');
          continue;
        }
      } else {
        preview = URL.createObjectURL(file);
      }

      setSelectedFiles(prev => [...prev, { file, preview, isVideo, duration }]);
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles(prev => {
      const newFiles = [...prev];
      URL.revokeObjectURL(newFiles[index].preview);
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const handleAddMore = () => {
    fileInputRef.current?.click();
  };

  const handleCancel = () => {
    selectedFiles.forEach(sf => URL.revokeObjectURL(sf.preview));
    navigate('/timeline');
  };

  const handleReturn = () => {
    navigate('/timeline');
  };

  const handlePublish = async () => {
    if (!user || selectedFiles.length === 0) return;

    setIsCompressing(true);
    setCompressionProgress({ current: 0, total: selectedFiles.length });

    try {
      const compressedMedia: MediaItem[] = [];

      for (let i = 0; i < selectedFiles.length; i++) {
        const sf = selectedFiles[i];
        setCompressionProgress({ current: i + 1, total: selectedFiles.length });

        let blob: Blob;
        if (sf.isVideo) {
          blob = await mediaService.compressVideo(sf.file);
        } else {
          blob = await mediaService.compressImage(sf.file, 1920, 0.8);
        }

        // Convert blob to data URL for mock storage
        const reader = new FileReader();
        const dataUrl = await new Promise<string>((resolve) => {
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(blob);
        });

        compressedMedia.push({
          id: `media-${Date.now()}-${i}`,
          type: sf.isVideo ? 'video' : 'image',
          url: dataUrl,
          thumbnailUrl: sf.isVideo ? sf.preview : undefined,
          duration: sf.duration,
          fileSize: blob.size,
        });
      }

      setIsCompressing(false);
      setIsUploading(true);

      await createPost({
        userId: user.id,
        userName: user.displayName,
        userProfilePicture: user.profilePicture,
        description,
        media: compressedMedia,
        likes: 0,
        likedBy: [],
      });

      // Clean up
      selectedFiles.forEach(sf => URL.revokeObjectURL(sf.preview));

      // Show success and navigate
      setIsUploading(false);
      navigate('/timeline');
    } catch (err) {
      console.error('Upload failed:', err);
      setError('Upload failed. Check your connection and try again.');
      setIsCompressing(false);
      setIsUploading(false);
    }
  };

  const canPublish = selectedFiles.length > 0 && !isCompressing && !isUploading;

  return (
    <div className="upload-flow">
      {/* Return Button */}
      <button className="upload-return-button" onClick={handleReturn}>
        ← Back to Timeline
      </button>

      <div className="upload-container">
        {/* Header */}
        <div className="upload-header">
          <Button variant="secondary" onClick={handleCancel}>
            Cancel
          </Button>
          <h2 className="upload-title">Create Post</h2>
          <div style={{ width: '80px' }} /> {/* Spacer for centering */}
        </div>

        {/* File Input (Hidden) */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          multiple
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />

        {/* Content */}
        {selectedFiles.length === 0 ? (
          // Initial state - file selection
          <div className="upload-empty">
            <p className="upload-empty-text">Select photos or videos to share</p>
            <Button onClick={handleAddMore}>
              Select Files
            </Button>
          </div>
        ) : (
          // Files selected - preview and edit
          <>
            {/* Media Preview */}
            <div className="upload-media-preview">
              {selectedFiles.map((sf, index) => (
                <div key={index} className="upload-media-item">
                  <img 
                    src={sf.preview} 
                    alt={`Selected ${index + 1}`}
                    className="upload-media-thumbnail"
                  />
                  {sf.isVideo && (
                    <span className="upload-media-play-icon">▶</span>
                  )}
                  <button
                    className="upload-media-remove"
                    onClick={() => handleRemoveFile(index)}
                    aria-label="Remove file"
                  >
                    ×
                  </button>
                  <span className="upload-media-size">
                    {(sf.file.size / 1024 / 1024).toFixed(1)} MB
                  </span>
                </div>
              ))}

              {selectedFiles.length < 3 && (
                <button className="upload-add-more" onClick={handleAddMore}>
                  <span className="upload-add-icon">+</span>
                  <span>Add More</span>
                </button>
              )}
            </div>

            {/* Description */}
            <div className="upload-description">
              <label htmlFor="description" className="upload-label">
                Description
              </label>
              <textarea
                id="description"
                className="upload-textarea"
                placeholder="Share your experience... #EventName"
                value={description}
                onChange={(e) => setDescription(e.target.value.slice(0, 160))}
                maxLength={160}
              />
              <span className="upload-char-count">
                {description.length}/160
              </span>
            </div>

            {/* Compression Progress */}
            {isCompressing && (
              <div className="upload-progress">
                <LoadingSpinner size="small" />
                <span>
                  Compressing... {compressionProgress.current}/{compressionProgress.total} complete
                </span>
              </div>
            )}

            {/* Upload Progress */}
            {isUploading && (
              <div className="upload-progress">
                <LoadingSpinner size="small" />
                <span>Uploading your post...</span>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="upload-error">
                {error}
                <Button variant="secondary" onClick={() => setError(null)}>
                  Dismiss
                </Button>
              </div>
            )}

            {/* Publish Button */}
            <Button
              onClick={handlePublish}
              disabled={!canPublish}
              className="upload-publish-button"
            >
              Publish
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
