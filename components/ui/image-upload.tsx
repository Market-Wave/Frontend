'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { X, Upload, Link as LinkIcon, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { cn } from '@/lib/utils/cn';

export interface MediaItem {
  id?: number;
  url: string;
  mediaType: string;
  mediaView: string;
  sortOrder: number;
  file?: File;
  isNew?: boolean;
}

interface ImageUploadProps {
  value: MediaItem[];
  onChange: (media: MediaItem[]) => void;
  mediaViews: { value: string; label: string }[];
  maxFiles?: number;
  accept?: string;
  className?: string;
}

export function ImageUpload({
  value = [],
  onChange,
  mediaViews,
  maxFiles = 10,
  accept = 'image/*',
  className,
}: ImageUploadProps) {
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [selectedView, setSelectedView] = useState(mediaViews[0]?.value || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const newMedia: MediaItem[] = files.map((file, index) => ({
      url: URL.createObjectURL(file),
      mediaType: file.type.startsWith('video/') ? 'VIDEO' : 'IMAGE',
      mediaView: selectedView || mediaViews[0]?.value || 'EXTERIOR',
      sortOrder: value.length + index,
      file,
      isNew: true,
    }));

    onChange([...value, ...newMedia].slice(0, maxFiles));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUrlAdd = () => {
    if (!urlInput.trim()) return;

    const newMedia: MediaItem = {
      url: urlInput.trim(),
      mediaType: urlInput.match(/\.(mp4|webm|ogg)$/i) ? 'VIDEO' : 'IMAGE',
      mediaView: selectedView || mediaViews[0]?.value || 'EXTERIOR',
      sortOrder: value.length,
      isNew: true,
    };

    onChange([...value, newMedia]);
    setUrlInput('');
    setShowUrlInput(false);
  };

  const handleRemove = (index: number) => {
    const newMedia = value.filter((_, i) => i !== index);
    // Reorder sort order
    const reordered = newMedia.map((item, i) => ({ ...item, sortOrder: i }));
    onChange(reordered);
  };

  const handleViewChange = (index: number, newView: string) => {
    const newMedia = [...value];
    newMedia[index] = { ...newMedia[index], mediaView: newView };
    onChange(newMedia);
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === value.length - 1)
    ) {
      return;
    }

    const newMedia = [...value];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newMedia[index], newMedia[targetIndex]] = [newMedia[targetIndex], newMedia[index]];
    
    // Update sort order
    const reordered = newMedia.map((item, i) => ({ ...item, sortOrder: i }));
    onChange(reordered);
  };

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <Label>Images & Media ({value.length}/{maxFiles})</Label>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowUrlInput(!showUrlInput)}
          >
            <LinkIcon className="w-4 h-4 mr-2" />
            Add URL
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={value.length >= maxFiles}
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload Files
          </Button>
        </div>
      </div>

      {showUrlInput && (
        <div className="flex gap-2 p-3 bg-gray-50 rounded-lg">
          <div className="flex-1">
            <Input
              placeholder="Enter image URL"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleUrlAdd())}
            />
          </div>
          <Select value={selectedView} onChange={(e) => setSelectedView(e.target.value)}>
            {mediaViews.map((view) => (
              <option key={view.value} value={view.value}>
                {view.label}
              </option>
            ))}
          </Select>
          <Button type="button" onClick={handleUrlAdd} size="sm">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
      />

      {value.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {value.map((item, index) => (
            <div
              key={index}
              className="relative group border rounded-lg p-3 bg-white hover:shadow-md transition-shadow"
            >
              <div className="aspect-video bg-gray-100 rounded overflow-hidden mb-2 relative">
                <Image
                  src={item.url}
                  alt={`Media ${index + 1}`}
                  fill
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label className="text-xs">View:</Label>
                  <Select
                    value={item.mediaView}
                    onChange={(e) => handleViewChange(index, e.target.value)}
                    className="text-xs flex-1"
                  >
                    {mediaViews.map((view) => (
                      <option key={view.value} value={view.value}>
                        {view.label}
                      </option>
                    ))}
                  </Select>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="text-gray-500">Order: {index + 1}</span>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => moveItem(index, 'up')}
                      disabled={index === 0}
                      className="text-blue-600 hover:text-blue-700 disabled:text-gray-300"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => moveItem(index, 'down')}
                      disabled={index === value.length - 1}
                      className="text-blue-600 hover:text-blue-700 disabled:text-gray-300"
                    >
                      ↓
                    </button>
                  </div>
                  <span
                    className={cn(
                      'ml-auto px-2 py-0.5 rounded text-xs',
                      item.isNew ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    )}
                  >
                    {item.isNew ? 'New' : 'Existing'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {value.length === 0 && (
        <div className="border-2 border-dashed rounded-lg p-8 text-center text-gray-500">
          <Upload className="w-12 h-12 mx-auto mb-3 text-gray-400" />
          <p>No media added yet</p>
          <p className="text-sm mt-1">Click "Upload Files" or "Add URL" to add images</p>
        </div>
      )}
    </div>
  );
}
