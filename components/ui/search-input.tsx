'use client';

import { Search, X } from 'lucide-react';
import { Input } from './input';
import { useState } from 'react';
import { cn } from '@/lib/utils/cn';

interface SearchInputProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  className?: string;
}

export function SearchInput({
  placeholder = 'Search...',
  onSearch,
  className,
}: SearchInputProps) {
  const [value, setValue] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    onSearch(newValue);
  };

  const handleClear = () => {
    setValue('');
    onSearch('');
  };

  return (
    <div className={cn('relative', className)}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        className="pl-10 pr-10"
      />
      {value && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
