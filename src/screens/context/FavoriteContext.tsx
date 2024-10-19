import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ArtTool = {
  id: string;
  artName: string;
  price: number;
  description: string;
  glassSurface: boolean;
  image: string;
  brand: string;
  limitedTimeDeal: number;
};

type FavoriteContextType = {
  favoriteItems: ArtTool[];
  addFavorite: (item: ArtTool) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  clearFavorites: () => void; // Add clearFavorites to the context type
};

const FavoriteContext = createContext<FavoriteContextType | undefined>(undefined);

type FavoriteProviderProps = {
  children: ReactNode;
};

export const FavoriteProvider: React.FC<FavoriteProviderProps> = ({ children }) => {
  const [favoriteItems, setFavoriteItems] = useState<ArtTool[]>([]);

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const storedFavorites = await AsyncStorage.getItem('favorites');
        if (storedFavorites) {
          setFavoriteItems(JSON.parse(storedFavorites));
        }
      } catch (error) {
        console.error("Error loading favorites: ", error);
      }
    };

    loadFavorites();
  }, []);

  const addFavorite = (item: ArtTool) => {
    setFavoriteItems((prev) => {
      const newFavorites = [...prev, item];
      AsyncStorage.setItem('favorites', JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  const removeFavorite = (id: string) => {
    setFavoriteItems((prev) => {
      const newFavorites = prev.filter(favItem => favItem.id !== id);
      AsyncStorage.setItem('favorites', JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  const isFavorite = (id: string) => {
    return favoriteItems.some(favItem => favItem.id === id);
  };

  const clearFavorites = () => {
    setFavoriteItems([]);
    AsyncStorage.removeItem('favorites');
  };

  return (
    <FavoriteContext.Provider value={{ favoriteItems, addFavorite, removeFavorite, isFavorite, clearFavorites }}>
      {children}
    </FavoriteContext.Provider>
  );
};

export const useFavorite = () => {
  const context = useContext(FavoriteContext);
  if (!context) {
    throw new Error('useFavorite must be used within a FavoriteProvider');
  }
  return context;
};