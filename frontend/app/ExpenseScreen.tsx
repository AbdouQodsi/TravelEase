import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, ImageBackground, Platform } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLinkTo } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

type Expense = {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
};

export default function ExpenseScreen() {
  const linkTo = useLinkTo();
  const [expenses, setExpenses] = useState([]);
  const [filtered, setFiltered] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [dateFilter, setDateFilter] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    const fetchExpenses = async () => {
      const userStr = await AsyncStorage.getItem("user");
      if (!userStr) return;
      const user = JSON.parse(userStr);

      try {
        const res = await fetch(`http://localhost:8082/api/expenses/user/${user.id}`);
        const data = await res.json();
        setExpenses(data);
        setFiltered(data);
      } catch (err) {
        console.error("Failed to load expenses:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  useEffect(() => {
    let data = expenses;
    if (selectedCategory !== "All") {
      data = data.filter((item) => item.category === selectedCategory);
    }
    if (dateFilter) {
      const formatted = dateFilter.toISOString().split("T")[0];
      data = data.filter((item) => item.date.startsWith(formatted));
    }

    setFiltered(data);
  }, [selectedCategory, dateFilter, expenses]);
  const categories = ["All", "Landmarks", "Restaurants", "Shopping", "Nature", "Nightlife", "Adventure", "Transportation", "Events"];


  const renderRow = ({ item }: { item: Expense }) => (
    <View style={styles.tableRow}>
      <Text style={styles.tableCell}>{item.description}</Text>
      <Text style={[styles.tableCell, { color: "#16a34a", fontWeight: 'bold' }]}>+{item.amount} HKD</Text>
      <Text style={styles.tableCell}>{item.category}</Text>
      <Text style={styles.tableCell}>{item.date}</Text>
    </View>
  );

  return (
    <View style={styles.container1}>
      <ImageBackground
        source={{
          uri: "https://images.ctfassets.net/bth3mlrehms2/2qHworX4SxuqmcIVQ0BQhx/2bf600001f20beb5a584cf9fbdf49a18/China_Hong_Kong_Skyline.jpg",
        }} style={styles.hero} resizeMode="cover" >
        <View style={styles.overlay} />
        <TouchableOpacity onPress={() => linkTo('/profile')} style={styles.backBtn}>
          <Ionicons name="arrow-back-outline" size={24} color="#fff" />
        </TouchableOpacity>

        <View style={styles.heroContent}>
          <Text style={styles.heroTitle}>Saved Expense</Text>
          <Text style={styles.heroSubtitle}>View and filter all your transactions easily</Text>
        </View>
      </ImageBackground>




      {/* Filter Section */}
      <View style={styles.filters}>
        <View style={styles.chipsContainer}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              onPress={() => setSelectedCategory(cat)}
              style={[
                styles.chip,
                selectedCategory === cat && styles.chipActive,
              ]}
            >
              <Text style={[
                styles.chipText,
                selectedCategory === cat && styles.chipTextActive
              ]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View >
          {Platform.OS === "web" && (
            <input
              type="date"
              value={dateFilter ? dateFilter.toISOString().split("T")[0] : ""}
              onChange={(e) => setDateFilter(new Date(e.target.value))}
              className="custom-date-input"
            />


          )}


        </View>


      </View>

      {/* Content */}
      <View style={styles.container}>
        {loading ? (
          <ActivityIndicator size="large" style={{ marginTop: 50 }} />
        ) : filtered.length === 0 ? (
          <Text style={styles.empty}>Aucune dépense trouvée.</Text>
        ) : (
          <>
            <View style={styles.tableHeader}>
              <Text style={styles.headerCell}>Description</Text>
              <Text style={styles.headerCell}>Montant</Text>
              <Text style={styles.headerCell}>Catégorie</Text>
              <Text style={styles.headerCell}>Date</Text>
            </View>

            <FlatList
              data={filtered}
              keyExtractor={(item) => item.id}
              renderItem={renderRow}
              contentContainerStyle={{ paddingBottom: 100 }}
            />
          </>

        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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


  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1e293b",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#e2e8f0",
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  headerCell: {
    flex: 1,
    fontWeight: "bold",
    fontSize: 14,
    color: "#1e293b",
  },
  tableRow: {
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    borderRadius: 6,
  },
  tableCell: {
    flex: 1,
    fontSize: 13,
    color: "#334155",
  },

  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 14,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: "#3b82f6",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  desc: {
    fontSize: 15,
    fontWeight: "500",
    color: "#1e293b",
    marginBottom: 8,
  },
  amount: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#16a34a",
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  category: {
    fontSize: 13,
    color: "#475569",
  },
  date: {
    fontSize: 13,
    color: "#94a3b8",
  },

  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    padding: 16,
    paddingHorizontal: 35,
  },

  filters: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
    marginTop: 25,
    paddingHorizontal: 35,
    gap: 10,
  },
  chipsContainer: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    backgroundColor: "#e2e8f0",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  chipActive: {
    backgroundColor: "#fe7f2d",
  },
  chipText: {
    fontSize: 16,
    color: "#334155",
  },
  chipTextActive: {
    color: "#fff",
    fontWeight: "bold",
  },
  dateBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0ea5e9",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  dateBtnText: {
    color: "#fff",
    marginLeft: 6,
    fontSize: 14,
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  cardBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  empty: {
    marginTop: 40,
    textAlign: "center",
    fontSize: 16,
    color: "#94a3b8",
  },
});
