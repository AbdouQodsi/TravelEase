import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ImageBackground,
  Modal,
  RefreshControl,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import useLoadingState from "../useLoadingState";
import { Linking } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import featurePlaces from "../destinations.json";


type FeatherIconName = React.ComponentProps<typeof Feather>["name"];
type Location = {
  id: string;
  title: string;
  image: any;
};
const windowWidth = Dimensions.get("window").width;

export default function MainPage() {
  const router = useRouter(); // Initialize router for navigation
  const scrollViewRef = useRef<ScrollView>(null); // Initialize scrollViewRef
  const [currentIndex, setCurrentIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { isLoading, isError, errorMessage, startLoading, setError, reset } = useLoadingState();


  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        x: currentIndex * windowWidth,
        animated: true,
      });
    }
  }, [currentIndex]);

  useFocusEffect(
    React.useCallback(() => {
      setCurrentIndex(0);
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({ x: 0, animated: false });
      }
    }, [])
  );

  const handlePress = (location: Location) => {
    console.log(`Navigate to details of: ${location.title}`);
    // Add navigation logic here
  };



  const categories: { name: string; icon: FeatherIconName }[] = [
    { name: "Landmarks", icon: "map-pin" },
    { name: "Restaurants", icon: "coffee" },
    { name: "Shopping", icon: "shopping-bag" },
    { name: "Nature", icon: "sun" },
    { name: "Nightlife", icon: "moon" },
    { name: "Museums", icon: "book-open" },
    { name: "Adventure", icon: "activity" },
    { name: "Transportation", icon: "truck" },
    { name: "Events", icon: "calendar" },
  ];

 
  // Combined list of all searchable places
  const allPlaces = featurePlaces.map((item) => ({
  id: item.id,
  name: item.name,
}));


  // Search function
  const handleSearch = (text: string) => {
  setSearchQuery(text);

  if (text.trim() === "") {
    setSearchResults([]);
    setShowSearchResults(false);
    return;
  }

  const filteredResults = allPlaces.filter((place) =>
    place.name.toLowerCase().includes(text.toLowerCase())
  );

  setSearchResults(filteredResults);
  setShowSearchResults(true);
};


  // Handle search result selection
  const handleSelectSearchResult = (place: any) => {
    setSearchQuery("");
    setShowSearchResults(false);
    router.push(`/destinations/${place.id}`);
  };

  // Handle refresh
  const onRefresh = async () => {
    setRefreshing(true);

    try {
      // Simulate data fetching
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Reset to initial slide
      setCurrentIndex(0);
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({ x: 0, animated: false });
      }

      // You would typically fetch fresh data here
      // For example: const newLocations = await fetchLocations();
      // setLocations(newLocations);

      setRefreshing(false);
    } catch (error) {
      console.error("Refresh failed:", error);
      setRefreshing(false);
    }
  };


  // Code
    const [user, setUser] = useState<{ firstName: string; lastName: string } | null>(null);
  const [search, setSearch] = useState('');

    useEffect(() => {
      const fetchUser = async () => {
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        }
      };

      fetchUser();
    }, []);
      const [travelNews, setTravelNews] = useState([]);

     useEffect(() => {
    const fetchData = async () => {
      const news = require("../travelNews.json"); // Chemin relatif à ton fichier
      setTravelNews(news);
    };
    fetchData();
  }, []);


  return (

    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Image
          source={{
            uri: "https://www.agoda.com/wp-content/uploads/2024/02/Featured-image-Hong-Kong-skyline-from-Kow-Loon-1244x700.jpg",
          }}
          style={styles.headerImage}
        />
        <View style={styles.overlay} />
        <View style={styles.headerTextContainer}>
          <Text style={styles.greeting}>{user ? `Hi, ${user.firstName} ${user.lastName}!` : "Hi, Guest!"}</Text>
          <Text style={styles.subGreeting}>
            Explore The Beauty of Hong Kong
          </Text>
          <Text style={styles.searchLabel}>Where do you want to go?</Text>
        </View>
        <View style={styles.searchContainer}>
          <Feather name="search" size={20} color="gray" />
          <TextInput
            placeholder="Search all around Hong Kong"
            placeholderTextColor="gray"
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={handleSearch}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => {
                setSearchQuery("");
                setShowSearchResults(false);
              }}
            >
              <Feather name="x" size={18} color="gray" />
            </TouchableOpacity>
          )}
        </View>

        {/* Search Results Modal */}
        {showSearchResults && (
          <View style={styles.searchResultsContainer}>
            <ScrollView style={styles.searchResultsScroll}>
              {searchResults.length === 0 ? (
                <Text style={styles.noResultsText}>No places found</Text>
              ) : (
                searchResults.map((place) => (
                  <TouchableOpacity
                    key={place.id}
                    style={styles.searchResultItem}
                    onPress={() => handleSelectSearchResult(place)}
                  >
                    <Feather name="map-pin" size={16} color="#fe7f2d" />
                    <Text style={styles.searchResultText}>{place.name}</Text>
                  </TouchableOpacity>
                ))
              )}
            </ScrollView>
          </View>
        )}
      </View>

      {/* Scrollable Content */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#fe7f2d"]}
            tintColor="#fe7f2d"
            titleColor="#fe7f2d"
          />
        }
      >
        {/*Automation slider*/}
        {/* <View style={styles.sliderContainer}>
          <Text style={styles.title}>Discover Hong Kong</Text>
          <ScrollView
            horizontal
            pagingEnabled
            ref={scrollViewRef}
            showsHorizontalScrollIndicator={false}
            scrollEnabled={false}
          >
            {locations.map((location) => (
              <TouchableOpacity
                key={location.id}
                activeOpacity={0.8}
                onPress={() => router.push(`/destinations/${location.id}`)}
              >
                <Image source={location.image} style={styles.image} />
                <Text style={styles.imageTitle}>{location.title}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View> */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Discover Hong Kong Places</Text>
            <TouchableOpacity
              onPress={() => router.push({
                    pathname: "/destinations/categories",
                  })
              }
            >
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.sectionSubTitle}>
            Most Trending places in the last 2 weeks
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.horizontalScroll}
          >
            {featurePlaces.map((place) => (
              <TouchableOpacity
                key={place.id}
                style={styles.featureBox}
                onPress={() => router.push(`/destinations/${place.id}`)} // Navigate to [id]
              >
                <Image source={{ uri: place.images }} style={styles.featureImage} />
                <Text style={styles.featureTitle}>{place.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Categories Section */}
        <View style={styles.section}>
          {/* Section Header */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Categories</Text>
          </View>

          {/* Scrollable Categories */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.horizontalScroll}
          >
            {categories.map((category, index) => (
              <TouchableOpacity
                key={index}
                style={styles.categoryCircle}
                onPress={() =>
                  router.push({
                    pathname: "/destinations/categories",
                    params: { category: category.name },
                  })
                }
              >
                <Feather name={category.icon} size={24} color="#fff" />
                <Text style={styles.categoryText}>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/*New in HK*/}
        <View>
          <Text style={styles.title}>What's New in Hong Kong</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollContainer}
          >
            {travelNews.map((news) => (
              <TouchableOpacity key={news.id} style={styles.card} onPress={() => router.push(`/blog/${news.id}`)}>
                <Image source={{ uri: news.image }} style={styles.cardImage} />
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>{news.title}</Text>
                  <Text style={styles.cardDescription}>
                    {news.content}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Explore Map Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Explore Map</Text>
          <Text style={styles.sectionSubTitle}>
            Explore what is close to you
          </Text>
          <TouchableOpacity
            onPress={() =>
    Linking.openURL('https://www.google.com/maps/search/?api=1&query=22.3193,114.1694') // exemple : Hong Kong
  }
          >
            <ImageBackground
              source={{
                uri: "https://img.freepik.com/premium-vector/city-map-any-kind-digital-info-graphics-print-publication_403715-10.jpg?w=360",
              }}
              style={styles.mapPlaceholder}
              imageStyle={{ borderRadius: 10 }}
            >
              {/* Optional: Add text overlay */}
              <Text style={styles.placeholderText}>Open Map</Text>
            </ImageBackground>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  searchResultsContainer: {
    position: "absolute",
    top: 315,
    left: 20,
    right: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    maxHeight: 325,
    zIndex: 1000,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  searchResultsScroll: {
    paddingLeft: 18,
    paddingRight: 18,
    paddingTop: 8,
    paddingBottom: 8,
    zIndex: 1000,
  },
  searchResultItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    zIndex: 1000,
  },
  searchResultText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#333",
    zIndex: 1000,
  },
  noResultsText: {
    padding: 15,
    textAlign: "center",
    color: "#666",
    zIndex: 1000,
  },
  sliderContainer: {
    marginBottom: 22,
    zIndex: 1000,
  },
  image: {
    width: windowWidth,
    height: 222,
  },
  imageTitle: {
    position: "absolute",
    bottom: 10,
    left: 15,
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  scrollContainer: {
    flexDirection: "row",
    paddingRight: 15,
    marginBottom: 40,
  },
  card: {
    width: 250,
    backgroundColor: "#fff",
    borderRadius: 15,
    marginRight: 15,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardImage: {
    width: "100%",
    height: 150,
  },
  cardContent: {
    padding: 10,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  cardDescription: {
    fontSize: 12,
    color: "#666",
  },
  header: {
    height: 350,
    position: "relative",
    zIndex: 1000,
  },
  headerImage: {
    width: "100%",
    height: 350,
    zIndex: 1000,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTextContainer: {
    position: "absolute",
    bottom: 110,
    left: 30,
    zIndex: 1000,
  },
  greeting: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  subGreeting: {
    color: "#fff",
    fontSize: 25,
  },
  searchLabel: {
    fontSize: 16,
    color: "#fff",
    marginTop: 28,
  },
  searchContainer: {
    position: "absolute",
    bottom: 35,
    left: 20,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    width: '60%',
    zIndex: 1000,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
  },
  content: {
    flex: 1,
    marginTop: 28,
    paddingHorizontal: 22,
  },
  section: {
    marginBottom: 30,
    zIndex: 1,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  sectionSubTitle: {
    fontSize: 14,
    color: "gray",
    marginVertical: 5,
  },
  seeAllText: {
    fontSize: 14,
    color: "#fe7f2d",
  },
  horizontalScroll: {
    marginTop: 10,
  },
  featureBox: {
    width: 250,
    height: 250,
    borderRadius: 12,
    marginRight: 10,
    overflow: "hidden",
    backgroundColor: "#f9f9f9",
    shadowColor: "#000",
    // shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    // elevation: 5,
padding: 10,
margin: 15,
  },
  featureImage: {
    borderRadius: 12,
    width: "100%",
    height: "75%",
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 8,
  },
  categoryCircle: {
    width: 88,
    height: 88,
    backgroundColor: "#fe7f2d",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 22,
  },
  categoryText: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: "500",
    textAlign: "center",
    color: "#fff",
  },
  mapPlaceholder: {
    height: 350,
    backgroundColor: "#e0e0e0",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover", // Ensures the image covers the entire view
    justifyContent: "center", // Centers content vertically
    alignItems: "center", // Centers content horizontally
  },
  placeholderText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  text: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
});
