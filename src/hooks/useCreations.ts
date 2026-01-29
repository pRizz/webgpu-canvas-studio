import { useState, useEffect, useCallback } from 'react';
import { UserCreation } from '@/types/webgpu';

const STORAGE_KEY = 'webgpu-playground-creations';

export const useCreations = () => {
  const [creations, setCreations] = useState<UserCreation[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setCreations(JSON.parse(saved));
      }
    } catch (err) {
      console.error('Failed to load creations:', err);
    }
  }, []);

  // Save to localStorage whenever creations change
  const saveToStorage = useCallback((newCreations: UserCreation[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newCreations));
    } catch (err) {
      console.error('Failed to save creations:', err);
    }
  }, []);

  const addCreation = useCallback((name: string, code: string, thumbnail?: string) => {
    const newCreation: UserCreation = {
      id: `creation-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      code,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      thumbnail,
    };
    setCreations(prev => {
      const updated = [newCreation, ...prev];
      saveToStorage(updated);
      return updated;
    });
    return newCreation;
  }, [saveToStorage]);

  const updateCreation = useCallback((id: string, updates: Partial<Pick<UserCreation, 'name' | 'code' | 'thumbnail'>>) => {
    setCreations(prev => {
      const updated = prev.map(c => 
        c.id === id 
          ? { ...c, ...updates, updatedAt: Date.now() }
          : c
      );
      saveToStorage(updated);
      return updated;
    });
  }, [saveToStorage]);

  const deleteCreation = useCallback((id: string) => {
    setCreations(prev => {
      const updated = prev.filter(c => c.id !== id);
      saveToStorage(updated);
      return updated;
    });
  }, [saveToStorage]);

  const getCreation = useCallback((id: string) => {
    return creations.find(c => c.id === id);
  }, [creations]);

  const forkExample = useCallback((name: string, code: string) => {
    return addCreation(`${name} (Fork)`, code);
  }, [addCreation]);

  return {
    creations,
    addCreation,
    updateCreation,
    deleteCreation,
    getCreation,
    forkExample,
  };
};
