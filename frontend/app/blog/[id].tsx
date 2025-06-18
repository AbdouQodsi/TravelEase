import React, { useState } from "react";
// import { useLocalSearchParams, useRouter } from "expo-router";

import travelNews from "../travelNews.json";
import { useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
// import travelNews from "../../assets/data/travelNews.json";
import { Ionicons } from "@expo/vector-icons";
const BlogDetail = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const blog = travelNews.find((item) => item.id === id);

  if (!blog) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Blog post not found.</Text>
      </View>
    );
  }

  return (
        <View style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: blog.image }} style={styles.heroImage} />
        <View style={styles.overlay} />
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.heroTitle}>{blog.title}</Text>
      </View>
      <View style={styles.card}>
                <Text style={styles.description}>{blog.content}</Text>
        
      </View>
</View>


   
  );
};

export default BlogDetail;

const styles = StyleSheet.create({
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

   description: {
    color: "#374151",
    lineHeight: 22,
    marginVertical: 10,
  },
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

  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: "#e11d48",
  },
  backButton: {
    marginBottom: 10,
  },
  backText: {
    color: "#3b82f6",
    fontWeight: "500",
    fontSize: 14,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 16,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginBottom: 20,
  },
  content: {
    fontSize: 16,
    color: "#334155",
    lineHeight: 24,
  },
});

