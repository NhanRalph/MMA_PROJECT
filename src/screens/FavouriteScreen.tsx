import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, ScrollView, TextInput, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useFavorite } from './context/FavoriteContext';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { Swipeable } from 'react-native-gesture-handler';


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

type RootStackParamList = {
  Detail: { id: string };
};

const FavouriteScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { favoriteItems, removeFavorite, clearFavorites, isFavorite } = useFavorite();

  const handleDelete = (id: string) => {
    removeFavorite(id);
  };

  const handleClearFavorites = () => {
    Alert.alert(
      "Clear All Favorites",
      "Are you sure you want to remove all favorite items?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => clearFavorites(),
        },
      ]
    );
  };

  
  const handleHeartPress = (item: ArtTool) => {
    if (isFavorite(item.id)) {
      removeFavorite(item.id);
    }
  };

  
  const highlightKeyword = (text: string, keyword: string) => {
    if (!keyword) return text;
    const parts = text.split(new RegExp(`(${keyword})`, 'gi'));
    return (
      <Text>
        {parts.map((part, index) =>
          part.toLowerCase() === keyword.toLowerCase() ? (
            <Text key={index} style={styles.highlight}>{part}</Text>
          ) : (
            part
          )
        )}
      </Text>
    );
  };

  

  const renderRightActions = (id: string) => (
    <TouchableOpacity onPress={() => handleDelete(id)} style={styles.deleteButton}>
      <Icon name="trash-o" size={24} color="white" />
      <Text style={styles.deleteButtonText}>Delete</Text>
    </TouchableOpacity>
  );

  const renderItem = ({ item }: { item: ArtTool }) => (
    <TouchableOpacity onPress={() => navigation.navigate('Detail', { id: item.id })} style={styles.itemContainer}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.infoContainer}>
        <Text
         style={styles.title}
          numberOfLines={2} 
          ellipsizeMode='tail'
        >
          {highlightKeyword(item.artName, '')}
        </Text>
        <Text style={styles.price}>${item.price}</Text>
        <Text style={styles.deal}>Deal: {item.limitedTimeDeal * 100}% off</Text>
      </View>
      <TouchableOpacity onPress={() => handleHeartPress(item)} style={styles.heartIconContainer}>
        <Icon
          name="heart"
          size={24}
          color={isFavorite(item.id) ? "#ff6347" : "#ccc"}
          style={styles.heartIcon}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, paddingVertical: 20 }}>
      
      <FlatList
        data={favoriteItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContainer}
      />    
      
      {/* Add Clear All Button */}
      {favoriteItems.length > 0 && (
        <TouchableOpacity style={styles.clearButton} onPress={handleClearFavorites}>
          <Icon name="trash-o" size={20} color="white" />
          <Text style={styles.clearButtonText}>Clear All</Text>
        </TouchableOpacity>
      )}

      {favoriteItems.length === 0 && (
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={{ fontSize: 24 }}>No favorite items found.</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  searchBar: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#D3D3D3',
    borderRadius: 25,
    margin: 8,
    marginTop: 50,
    fontSize: 18,
    backgroundColor: '#F8F8F8',
  },
  highlight: {
    backgroundColor: '#FFEB3B',
  },
  row: {
    justifyContent: 'space-evenly',
    paddingHorizontal: 15,
  },
  itemContainer: {
    maxWidth: '45%',
    flex: 1,
    margin: 12,
    backgroundColor: '#FAFAFA',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
    padding: 15,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 160,
    borderRadius: 10,
    backgroundColor: '#E0E0E0',
  },
  infoContainer: {
    marginTop: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 8,
  },
  price: {
    fontSize: 16,
    color: '#FF6347',
    fontWeight: '700',
    marginBottom: 8,
  },
  deal: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '500',
  },
  heartIconContainer: {
    position: 'absolute',
    top: 15,
    right: 15,
  },
  heartIcon: {
    marginLeft: 12,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
  },
  
  // brandFilterContainer: {
  //   paddingVertical: 15,
  //   paddingHorizontal: 25,
  //   backgroundColor: '#F0F0F0',
  //   marginBottom: 15,
  // },
  brandFilterContainer2: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center', 
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    marginBottom: 10,
    marginLeft: 10,
  },
  listContainer: {
    paddingBottom: 15,
  },
  brandButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    marginRight: 15,
    borderWidth: 1,
    borderColor: '#B0BEC5',
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 5,
  },
  selectedBrandButton: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
    color: '#FFFFFF',
  },
  selectedBrandText: {
    color: '#FFFFFF',
  },
  brandButtonText: {
    color: '#4CAF50',
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    width: '30%',
    height: '100%',
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
    flexDirection: 'row',
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 5,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 25,
    margin: 10,
  },
  clearButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 5,
  },
});

export default FavouriteScreen;