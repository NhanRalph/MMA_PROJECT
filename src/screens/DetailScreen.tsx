import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity, StyleSheet, Image, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { RouteProp, useRoute } from '@react-navigation/native';
import { useFavorite } from './context/FavoriteContext'; 

type Rating = {
  userId: string;
  userName: string;
  rating: number;
  ratingDate: string;
};

type Comment = {
  userId: string;
  userName: string;
  comment: string;
  commentDate: string;
};

type ArtTool = {
  id: string;
  artName: string;
  price: number;
  description: string;
  glassSurface: boolean;
  image: string;
  brand: string;
  limitedTimeDeal: number;
  ratings: Rating[];
  comments: Comment[];
};

type RootStackParamList = {
  Detail: { id: string };
};

type DetailScreenRouteProp = RouteProp<RootStackParamList, 'Detail'>;

const DetailScreen: React.FC = () => {
  const route = useRoute<DetailScreenRouteProp>();
  const { id } = route.params;
  const [artTool, setArtTool] = useState<ArtTool | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { addFavorite, removeFavorite, isFavorite } = useFavorite();

  const fetchArtToolDetail = async () => {
    try {
      const response = await fetch(`https://66e3e37dd2405277ed123139.mockapi.io/android/${id}`);
      const data: ArtTool = await response.json();
      setArtTool(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching art tool detail: ', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtToolDetail();
  }, [id]);

  const handleFavoritePress = () => {
    if (artTool) {
      if (isFavorite(artTool.id)) {
        removeFavorite(artTool.id);
      } else {
        addFavorite(artTool);
      }
    }
  };
  
  const handleHeartPress = (item: ArtTool) => {
    if (isFavorite(item.id)) {
      removeFavorite(item.id);
    } else {
      addFavorite(item);
    }
  };

  // Calculate average rating
  const calculateAverageRating = () => {
    if (artTool?.ratings.length) {
      const totalRating = artTool.ratings.reduce((sum, rating) => sum + rating.rating, 0);
      return (totalRating / artTool.ratings.length).toFixed(1); // Fix to 1 decimal place
    }
    return '0.0';
  };

  // Combine ratings and comments by userId
  const getCommentsWithRatings = () => {
    if (artTool) {
      return artTool.comments.map(comment => {
        const userRating = artTool.ratings.find(rating => rating.userId === comment.userId);
        return {
          ...comment,
          rating: userRating?.rating || 0,
        };
      });
    }
    return [];
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#ff6347" />
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!artTool) {
    return (
      <View style={styles.loading}>
        <Text style={styles.errorText}>Error loading art tool details.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image source={{ uri: artTool.image }} style={styles.image} />
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{artTool.artName}</Text>
        <TouchableOpacity onPress={() => handleHeartPress(artTool)} style={styles.heartIconContainer}>
        <Icon
          name="heart"
          size={24}
          color={isFavorite(artTool.id) ? "#ff6347" : "#ccc"}
          style={styles.heartIcon}
        />
      </TouchableOpacity>
      </View>
      <Text style={styles.description}>{artTool.description}</Text>
      <Text style={styles.price}>${artTool.price}</Text>
      
      {/* Average Rating */}
      <View style={styles.ratingContainer}>
        <Icon name="star" size={24} color="#FFD700" />
        <Text style={styles.averageRatingText}>{calculateAverageRating()} / 5</Text>
        <Text style={styles.totalRatings}>({artTool.ratings.length} ratings)</Text>
      </View>

      {/* Comments Section */}
      <Text style={styles.commentsTitle}>Comments & Ratings:</Text>
      <FlatList
        data={getCommentsWithRatings()}
        keyExtractor={(item) => item.userId}
        renderItem={({ item }) => (
          <View style={styles.commentItem}>
            <Text style={styles.commentUser}>{item.userName}</Text>
            <View style={styles.commentRatingContainer}>
              <Icon name="star" size={16} color="#FFD700" />
              <Text style={styles.userRatingText}>{item.rating} / 5</Text>
            </View>
            <Text style={styles.commentText}>{item.comment}</Text>
            <Text style={styles.commentDate}>{new Date(item.commentDate).toLocaleDateString()}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    width: '85%',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    marginBottom: 10,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: "red"
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  averageRatingText: {
    fontSize: 20,
    marginLeft: 10,
  },
  totalRatings: {
    marginLeft: 5,
    fontSize: 16,
    color: '#777',
  },
  favoriteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6495ED',
    padding: 10,
    borderRadius: 20,
    marginTop: 20,
  },
  favoriteButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 5,
  },
  commentsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
  },
  commentItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  commentUser: {
    fontWeight: 'bold',
  },
  commentRatingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  userRatingText: {
    marginLeft: 5,
    fontSize: 16,
    color: '#333',
  },
  commentText: {
    fontSize: 16,
    marginTop: 5,
  },
  commentDate: {
    fontSize: 12,
    color: '#888',
    marginTop: 5,
  },
  errorText: {
    fontSize: 18,
    color: '#ff6347',
  },
  heartIconContainer: {
    // position: 'absolute',
    // top: 15,
    // right: 15,
    width: "10%",
  },
  heartIcon: {
    marginLeft: 12,
  },
});

export default DetailScreen;
