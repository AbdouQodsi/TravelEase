import { useLocalSearchParams, useRouter } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert
} from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

import data from "../destinations.json";
const DestinationDetail = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [saved, setSaved] = useState(false);

  const destination = data.find(d => d.id === id);

  if (!destination) {
    return (
      <View style={styles.card}>
        <Text style={styles.description}>Destination not found.</Text>
      </View>
    );
  }

  const handleSave = async () => {
    const userStr = await AsyncStorage.getItem('user');
    // if (!userStr) return Alert.alert("You must be logged in to save a destination");
 if (!userStr) {
        // Redirige vers la page de login
        window.location.href = "http://localhost:8081/profile";
        return;
        }
    const user = JSON.parse(userStr);

    const savedDestination = {
      destinationId: destination.id,
      name: destination.name,
      description: destination.description,
      category: destination.category,
      budget: destination.budget,
      userId: user.id,
    };

    try {
      const response = await fetch('http://localhost:8082/api/savedDestinations/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(savedDestination),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Server error:", errorData);
        Alert.alert("Error", "Could not save destination.");
        return;
      }

      router.push("/saved");
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Could not save destination.");
    }
  };



  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: destination.images }} style={styles.heroImage} />
        <View style={styles.overlay} />
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.heroTitle}>{destination.name}</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.row}>
          <Ionicons name="star" size={18} color="#facc15" />
          <Text style={styles.rating}>{destination.rating} / 5</Text>
          <Text style={styles.category}>• {destination.category}</Text>
        </View>

        <Text style={styles.budget}>💸 Budget : {destination.budget} HKD</Text>
        <Text style={styles.description}>{destination.description}</Text>

        <View style={styles.tags}>
          {destination.tags.map((tag, i) => (
            <View key={i} style={styles.tag}>
              <Text style={styles.tagText}>#{tag}</Text>
            </View>
          ))}
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.btnPrimary} onPress={handleSave}>
            <Ionicons name="bookmark-outline" size={16} color="#fff" />
            <Text style={styles.btnText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnOutline} onPress={() => Linking.openURL(destination.mapUrl)}>
            <Ionicons name="map-outline" size={16} color="#fe7f2d" />
            <Text style={styles.btnOutlineText}>Map</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default DestinationDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },

  header: {
    position: "relative",
    height: 400,

  },

  heroImage: {
    width: "100%",
    height: "100%",
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },

  heroTitle: {
    position: "absolute",
    bottom: 60,
    left: 30,
    color: "#fff",
    fontSize: 39,
    fontWeight: "bold",
    textAlign: "center",
  },

  backBtn: {
    position: "absolute",
    top: 50,
    left: 26,
    backgroundColor: "#00000066",
    borderRadius: 24,
    padding: 12,
  },

  card: {
    backgroundColor: "#fff",
    padding: 30,
    marginHorizontal: 22,
    borderRadius: 20,
    marginTop: -40,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },

  rating: {
    marginLeft: 6,
    fontWeight: "600",
    color: "#333",
  },

  category: {
    marginLeft: 10,
    color: "#6b7280",
  },

  budget: {
    fontSize: 14,
    color: "#4b5563",
    marginBottom: 10,
  },

  description: {
    color: "#374151",
    lineHeight: 22,
    marginVertical: 10,
  },

  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 6,
  },

  tag: {
    backgroundColor: "#e0e7ff",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },

  tagText: {
    color: "#fe7f2d",
    fontSize: 12,
    fontWeight: "600",
  },

  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },

  btnPrimary: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fe7f2d",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
  },

  btnText: {
    color: "#fff",
    marginLeft: 6,
    fontWeight: "bold",
  },

  btnOutline: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#fe7f2d",
    borderWidth: 1.5,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },

  btnOutlineText: {
    color: "#fe7f2d",
    marginLeft: 6,
    fontWeight: "bold",
  },

});
