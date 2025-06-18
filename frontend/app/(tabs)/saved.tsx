import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    Image,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    Modal,
    ScrollView,
    ImageBackground
} from 'react-native';
import { useRouter } from "expo-router";
import { Feather } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import destinations from '../destinations.json';

type SavedItem = {
    id: string;
    category: 'Plans' | 'Destinations' | 'Restaurants';
    title: string;
    description: string;
    image: string;
    price: number;
    rating: number;
    tags: string[];
};

type FilterOptions = {
    budget: number;
    rating: number | null;
    tags: string[];
};

export default function SavedPage() {
    const [activeTab, setActiveTab] = useState<'Shopping' | 'Destinations' | 'Restaurants'>('Shopping');
    const router = useRouter();
    const tabs: Array<'Shopping' | 'Destinations' | 'Restaurants'> = [
        'Shopping',
        'Destinations',
        'Restaurants',
    ];
    const [searchTerm, setSearchTerm] = useState('');

    // Filter states
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [filterOptions, setFilterOptions] = useState<FilterOptions>({
        budget: 1000,
        rating: null,
        tags: [],
    });
    const [tempFilterOptions, setTempFilterOptions] = useState<FilterOptions>({
        budget: 1000,
        rating: null,
        tags: [],
    });

    // Available tags for filtering
    const availableTags = [
        'Ocean View', 'Luxury', 'Night View', 'Family Friendly', 'Hotel Dining',
        'Romantic', 'Outdoor', 'Indoor', 'Historical', 'Cultural', 'Shopping',
        'Food', 'Art', 'Photography', 'Hiking', 'Free Entry', 'Paid Entry'
    ];

    const [savedItems, setSavedItems] = useState<SavedItem[]>([]);

    // Apply filters function
    const applyFilters = () => {
        setFilterOptions(tempFilterOptions);
        setShowFilterModal(false);
    };

    // Reset filters function
    const resetFilters = () => {
        const resetOptions = {
            budget: 1000,
            rating: null,
            tags: [],
        };
        setTempFilterOptions(resetOptions);
        setFilterOptions(resetOptions);
    };

    // Toggle tag selection
    const toggleTag = (tag: string) => {
        setTempFilterOptions(prev => {
            if (prev.tags.includes(tag)) {
                return { ...prev, tags: prev.tags.filter(t => t !== tag) };
            } else {
                return { ...prev, tags: [...prev.tags, tag] };
            }
        });
    };

    // Filter saved items based on all criteria
    // const filteredItems = savedItems.filter((item) => {
    //     // Filter by tab
    //     const matchesTab = item.category === activeTab;

    //     // Filter by search term
    //     const matchesSearch = searchTerm
    //         ? item.title.toLowerCase().includes(searchTerm.toLowerCase())
    //         : true;

    //     // Filter by budget
    //     const matchesBudget = filterOptions.budget >= 1000 || item.price <= filterOptions.budget;

    //     // Filter by rating
    //     let matchesRating = true;
    //     if (filterOptions.rating !== null) {
    //         if (filterOptions.rating === 1) {
    //             matchesRating = item.rating < 2;
    //         } else if (filterOptions.rating === 5) {
    //             matchesRating = item.rating > 4;
    //         } else {
    //             matchesRating = Math.floor(item.rating) === filterOptions.rating;
    //         }
    //     }

    //     // Filter by tags
    //     const matchesTags = filterOptions.tags.length === 0 || 
    //         filterOptions.tags.some(tag => item.tags.includes(tag));

    //     return matchesTab && matchesSearch && matchesBudget && matchesRating && matchesTags;
    // });


    // Abdellah Qodsi
    const categories = [
        { name: 'All', icon: 'grid' },
        { name: 'Landmarks', icon: 'map-pin' },
        { name: 'Restaurants', icon: 'coffee' },
        { name: 'Shopping', icon: 'shopping-bag' },
        { name: 'Nature', icon: 'sun' },
        { name: 'Nightlife', icon: 'moon' },
        { name: 'Museums', icon: 'book-open' },
        { name: 'Adventure', icon: 'activity' },
        { name: 'Transportation', icon: 'truck' },
        { name: 'Events', icon: 'calendar' },
    ];
    const [activeCategory, setActiveCategory] = useState('All');

    type EnrichedDestination = {
  name: string;
  description: string;
  images?: string;
  category: string;
  budget: number;
  destinationId: string;
  userId: string;
  savedId: string; 
};

    const [saved, setSaved] = useState<EnrichedDestination[]>([]);

    const fetchSavedDestinations = async () => {
        try {
            const userStr = await AsyncStorage.getItem('user');
            if (!userStr) return;
       
            const user = JSON.parse(userStr);
            const response = await fetch(`http://localhost:8082/api/savedDestinations/user/${user.id}`);
            const savedList = await response.json();

           
    const enriched = savedList.map((saved: any) => {
      const full = destinations.find((d) => d.id === saved.destinationId);
      return {
        ...full,
        savedId: saved.id, 
        destinationId: saved.destinationId,
        userId: saved.userId,
      };
    });
setSaved(enriched);

        } catch (err) {
            console.error(err);

        }
    };

    useEffect(() => {
        fetchSavedDestinations();
    }, []);


    const filteredItems = saved.filter(item => {
        const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesBudget = filterOptions.budget >= 1000 || item.budget <= filterOptions.budget;
        let matchesRating = true;
        if (filterOptions.rating !== null) {
            if (filterOptions.rating === 1) {
                matchesRating = item.rating < 2;
            } else if (filterOptions.rating === 5) {
                matchesRating = item.rating > 4;
            } else {
                matchesRating = Math.floor(item.rating) === filterOptions.rating;
            }
        }
        const matchesTags =
            filterOptions.tags.length === 0 ||
            filterOptions.tags.some(tag => (item.tags || []).includes(tag));
        return matchesCategory && matchesSearch && matchesBudget && matchesRating && matchesTags;
    });
const handleUnsave = async (savedId: string) => {
  try {
    await fetch(`http://localhost:8082/api/savedDestinations/${savedId}`, {
      method: 'DELETE',
    });
    // Mise à jour locale après suppression
    setSaved((prev) => prev.filter((item) => item.savedId !== savedId));
  } catch (error) {
    console.error("Erreur lors de la désenregistrement :", error);
  }
};

    // End Abdellah Qodsi

    const renderItem = ({ item }: { item: SavedItem }) => (
        <View style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.cardImage} />
            <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <View style={styles.ratingContainer}>
                    {[1, 2, 3, 4, 5].map((star) => (
                        <Feather
                            key={star}
                            name="star"
                            size={14}
                            color={star <= Math.floor(item.rating) ? "#FFD700" : "#D3D3D3"}
                        />
                    ))}
                    <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
                </View>
                <Text style={styles.priceText}>
                    {item.price === 0 ? 'Free' : `HK$${item.price}`}
                </Text>
                <Text style={styles.cardDescription}>{item.description}</Text>
                <View style={styles.cardActions}>
                    <TouchableOpacity>
                        <Text style={styles.viewMore}>View More</Text>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Feather name="trash-2" size={20} color="#ff4d4d" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Header */}
            <ImageBackground
                source={{
                    uri: "https://images.ctfassets.net/bth3mlrehms2/2qHworX4SxuqmcIVQ0BQhx/2bf600001f20beb5a584cf9fbdf49a18/China_Hong_Kong_Skyline.jpg",
                }} style={styles.hero} resizeMode="cover" >
                <View style={styles.overlay} />
                <View style={styles.heroContent}>
                    <Text style={styles.heroTitle}>Saved</Text>
                    <View style={styles.searchRow}>
                        <TextInput
                            placeholder={`Search By name`}
                            style={styles.searchInput}
                            placeholderTextColor="#aaa"
                            value={searchTerm}
                            onChangeText={setSearchTerm}
                        />
                        <TouchableOpacity
                            style={[
                                styles.filterButton,
                                (filterOptions.budget < 1000 || filterOptions.rating !== null || filterOptions.tags.length > 0) &&
                                styles.activeFilterButton
                            ]}
                            onPress={() => {
                                setTempFilterOptions({ ...filterOptions });
                                setShowFilterModal(true);
                            }}
                        >
                            <Feather
                                name="sliders"
                                size={20}
                                color={(filterOptions.budget < 1000 || filterOptions.rating !== null || filterOptions.tags.length > 0) ? "#fff" : "#fff"}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </ImageBackground>
            {/* Tabs */}
            <View style={styles.tabs}>
                {categories.map((category) => (
                    <TouchableOpacity
                        key={category.name}
                        style={[
                            styles.tab,
                            activeCategory === category.name && styles.activeTab,
                        ]}
                        onPress={() => setActiveCategory(category.name)}
                    >
                        <Feather name={category.icon} size={24} color="#fff" />

                        <Text
                            style={[
                                styles.tabText,
                                activeCategory === category.name && styles.activeTabText,
                            ]}
                        >
                            {category.name}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>


            {/* Saved Items */}
            <ScrollView contentContainerStyle={styles.container12}>
                 {filteredItems.length === 0 ? (
    <Text style={styles.emptyText}>Aucune destination dans cette catégorie.</Text>
  ) : (
    filteredItems.map((item) => (
      <View key={item.savedId} style={styles.card}>
        <TouchableOpacity onPress={() => router.push(`/destinations/${item.destinationId}`)}>
          {item.images ? (
            <Image source={{ uri: item.images }} style={styles.image} />
          ) : (
            <View style={[styles.image, styles.imagePlaceholder]}>
              <Text style={{ color: '#999' }}>Aucune image</Text>
            </View>
          )}
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.category}>{item.category}</Text>
          <Text style={styles.description}>{item.description}</Text>
          <Text style={styles.budget}>Budget : {item.budget} HKD</Text>
        </TouchableOpacity>

        {/* Bouton de suppression */}
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => {
  console.log("Deleting item ID:", item.savedId);
  handleUnsave(item.savedId);
}}

        >
          <Text style={styles.deleteButtonText}>✕</Text>
        </TouchableOpacity>
      </View>
    ))
  )}
            </ScrollView>



            {/* Filter Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={showFilterModal}
                onRequestClose={() => setShowFilterModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Filter Options</Text>
                            <TouchableOpacity onPress={() => setShowFilterModal(false)}>
                                <Feather name="x" size={24} color="#333" />
                            </TouchableOpacity>
                        </View>

                        {/* Budget Section */}
                        <View style={styles.filterSection}>
                            <Text style={styles.filterSectionTitle}>Budget (HKD)</Text>
                            <View style={styles.sliderContainer}>
                                <Slider
                                    style={styles.slider}
                                    minimumValue={0}
                                    maximumValue={1000}
                                    step={50}
                                    value={tempFilterOptions.budget}
                                    onValueChange={(value) => setTempFilterOptions(prev => ({ ...prev, budget: value }))}
                                    minimumTrackTintColor="#fe7f2d"
                                    maximumTrackTintColor="#d3d3d3"
                                    thumbTintColor="#fe7f2d"
                                />
                                <View style={styles.sliderLabels}>
                                    <Text style={styles.sliderValue}>HK${tempFilterOptions.budget}</Text>
                                    <Text style={styles.sliderMaxValue}>
                                        {tempFilterOptions.budget >= 1000 ? 'Any price' : ''}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        {/* Rating Section */}
                        <View style={styles.filterSection}>
                            <Text style={styles.filterSectionTitle}>Rating</Text>
                            <View style={styles.ratingOptions}>
                                {[
                                    { value: 1, label: '< 2 stars' },
                                    { value: 2, label: '2 stars' },
                                    { value: 3, label: '3 stars' },
                                    { value: 4, label: '4 stars' },
                                    { value: 5, label: '> 4 stars' }
                                ].map((option) => (
                                    <TouchableOpacity
                                        key={option.value}
                                        style={[
                                            styles.ratingOption,
                                            tempFilterOptions.rating === option.value && styles.activeRatingOption
                                        ]}
                                        onPress={() => setTempFilterOptions(prev => ({
                                            ...prev,
                                            rating: prev.rating === option.value ? null : option.value
                                        }))}
                                    >
                                        <Text style={[
                                            styles.ratingOptionText,
                                            tempFilterOptions.rating === option.value && styles.activeRatingOptionText
                                        ]}>
                                            {option.label}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {/* Tags Section */}
                        <View style={styles.filterSection}>
                            <Text style={styles.filterSectionTitle}>Features & Tags</Text>
                            <ScrollView style={styles.tagsContainer}>
                                <View style={styles.tagsList}>
                                    {availableTags.map((tag) => (
                                        <TouchableOpacity
                                            key={tag}
                                            style={[
                                                styles.tagOption,
                                                tempFilterOptions.tags.includes(tag) && styles.activeTagOption
                                            ]}
                                            onPress={() => toggleTag(tag)}
                                        >
                                            <Text style={[
                                                styles.tagOptionText,
                                                tempFilterOptions.tags.includes(tag) && styles.activeTagOptionText
                                            ]}>
                                                {tag}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </ScrollView>
                        </View>

                        {/* Action Buttons */}
                        <View style={styles.modalActions}>
                            <TouchableOpacity style={styles.resetButton} onPress={resetFilters}>
                                <Text style={styles.resetButtonText}>Reset</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.applyButton} onPress={applyFilters}>
                                <Text style={styles.applyButtonText}>Apply</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    deleteButton: {
  position: 'absolute',
  top: 10,
  right: 10,
  backgroundColor: '#ff4d4d',
  borderRadius: 20,
  padding: 5,
  zIndex: 1,
},
deleteButtonText: {
  color: 'white',
  fontWeight: 'bold',
  fontSize: 16,
},

    // header 
    hero: {
        height: 400,
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        zIndex: 1,
    },
    heroContent: {
        zIndex: 2,
        alignItems: "center",
        paddingHorizontal: 20,
        width: '100%',
    },
    heroTitle: {
        fontSize: 56,
        fontWeight: "bold",
        color: "#fff",
        marginBottom: 8,
        textAlign: "center",
    },
    heroSubtitle: {
        fontSize: 18,
        color: "#f1f5f9",
        textAlign: "center",
        maxWidth: 600,
    },
    backBtn: {
        position: "absolute",
        top: 20,
        left: 20,
        zIndex: 10,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fe7f2d",
        paddingVertical: 10,
        paddingHorizontal: 25,
        borderRadius: 20,
        backdropFilter: "blur(4px)",
        gap: 6,
    },
    backText: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "500",
    },
    container1: {
        flex: 1,
        backgroundColor: "#f8fafc",
        padding: 0,
        margin: 0,
    },
    // end header
    emptyText: {
        textAlign: 'center',
        marginTop: 40,
        fontSize: 16,
        color: '#999',
    },
    card: {
        backgroundColor: '#fff',
        padding: 16,
        marginBottom: 20,
        borderRadius: 12,
        elevation: 2,
    },
    image: {
        width: '100%',
        height: 180,
        borderRadius: 12,
        marginBottom: 10,
    },
    imagePlaceholder: {
        backgroundColor: '#eee',
        justifyContent: 'center',
        alignItems: 'center',
    },
    name: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    category: {
        color: '#666',
        fontStyle: 'italic',
    },
    description: {
        marginTop: 8,
        color: '#444',
    },
    budget: {
        marginTop: 8,
        fontWeight: '600',
        color: '#fe7f2d',
    },

    container: {
        flex: 1,
        backgroundColor: '#f9f9f9',
    },
    container12: {
        flex: 1,
        backgroundColor: '#f9f9f9',
        paddingHorizontal: 35,
    },
    header: {
        padding: 20,
        backgroundColor: '#fe7f2d',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    headerTitle: {
        marginTop: 40,
        color: '#fff',
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    searchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '70%',
    },
    searchInput: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 10,
        height: 40,
        width: '80%',
        paddingHorizontal: 15,
        fontSize: 14,
        color: '#333',
        marginRight: 10,
    },
    filterButton: {
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    activeFilterButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
    },
    tabs: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: 15,
        paddingHorizontal: 26,
        gap: 15,
    },
    tab: {
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 20,
        backgroundColor: '#8d99ae',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    activeTab: {
        backgroundColor: '#fe7f2d',
    },
    tabText: {
        fontSize: 14,
        color: 'white',
    },
    activeTabText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    listContainer: {
        flex: 1,
        paddingHorizontal: 20,
    },
    cardImage: {
        width: 100,
        height: 100,
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
    },
    cardContent: {
        flex: 1,
        padding: 10,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    ratingText: {
        marginLeft: 5,
        fontSize: 12,
        color: '#666',
    },
    priceText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#fe7f2d',
        marginBottom: 4,
    },
    cardDescription: {
        fontSize: 12,
        color: '#666',
        marginBottom: 10,
    },
    cardActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    viewMore: {
        fontSize: 14,
        color: '#fe7f2d',
        fontWeight: 'bold',
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    emptySubText: {
        fontSize: 14,
        color: '#aaa',
        marginTop: 5,
        textAlign: 'center',
    },
    // Modal styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingHorizontal: 20,
        paddingBottom: 30,
        maxHeight: '80%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    filterSection: {
        marginTop: 20,
    },
    filterSectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 15,
    },
    sliderContainer: {
        marginBottom: 10,
    },
    slider: {
        width: '100%',
        height: 40,
    },
    sliderLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: -5,
    },
    sliderValue: {
        fontSize: 14,
        color: '#fe7f2d',
        fontWeight: '600',
    },
    sliderMaxValue: {
        fontSize: 14,
        color: '#666',
    },
    ratingOptions: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 10,
    },
    ratingOption: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#f0f0f0',
        marginRight: 8,
        marginBottom: 8,
    },
    activeRatingOption: {
        backgroundColor: '#fe7f2d',
    },
    ratingOptionText: {
        fontSize: 14,
        color: '#333',
    },
    activeRatingOptionText: {
        color: '#fff',
    },
    tagsContainer: {
        maxHeight: 150,
    },
    tagsList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 10,
    },
    tagOption: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#f0f0f0',
        marginRight: 8,
        marginBottom: 8,
    },
    activeTagOption: {
        backgroundColor: '#fe7f2d',
    },
    tagOptionText: {
        fontSize: 14,
        color: '#333',
    },
    activeTagOptionText: {
        color: '#fff',
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 30,
        paddingTop: 15,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
    },
    resetButton: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#fe7f2d',
    },
    resetButtonText: {
        fontSize: 16,
        color: '#fe7f2d',
        fontWeight: '600',
    },
    applyButton: {
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 8,
        backgroundColor: '#fe7f2d',
    },
    applyButtonText: {
        fontSize: 16,
        color: '#fff',
        fontWeight: '600',
    },
});