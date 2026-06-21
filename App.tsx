import {useRef, useState } from "react";
import { StyleSheet, View, Text, Pressable } from "react-native";
import MapView, { Marker, Region } from "react-native-maps";

const points = [
  { id: 1, title: "Truck Parking", category: "parking", latitude: 51.8862, longitude: 5.4297 },
  { id: 2, title: "Fuel Station", category: "fuel", latitude: 51.887, longitude: 5.43 },
  { id: 3, title: "Restaurant", category: "food", latitude: 51.888, longitude: 5.431 },
  { id: 4, title: "Shower", category: "shower", latitude: 51.889, longitude: 5.432 },
  { id: 5, title: "Service", category: "service", latitude: 51.89, longitude: 5.433 },
  { id: 6, title: "Truck Parking 2", category: "parking", latitude: 51.891, longitude: 5.434 },
{
  id: 7,
  title: "Arnhem Parking",
  category: "parking",
  latitude: 51.9851,
  longitude: 5.8987,
},
{
  id: 8,
  title: "Arnhem Fuel",
  category: "fuel",
  latitude: 51.986,
  longitude: 5.899,
},
{
  id: 9,
  title: "Utrecht Truck Stop",
  category: "parking",
  latitude: 52.0907,
  longitude: 5.1214,
},
{
  id: 10,
  title: "Utrecht Food",
  category: "food",
  latitude: 52.091,
  longitude: 5.122,
},
{
  id: 11,
  title: "Amsterdam Service",
  category: "service",
  latitude: 52.3676,
  longitude: 4.9041,
},
{
  id: 12,
  title: "Amsterdam Shower",
  category: "shower",
  latitude: 52.368,
  longitude: 4.905,
},
];



function getIcon(category: string) {
  switch (category) {
    case "parking": return "🅿️";
    case "fuel": return "⛽";
    case "food": return "🍔";
    case "shower": return "🚿";
    case "service": return "🔧";
    default: return "📍";
  }
}


type Point = {
  id: number;
  title: string;
  category: string;
  latitude: number;
  longitude: number;
};

function createClusters(items: Point[], precision: number) {
  const groups: Record<string, Point[]> = {};

  items.forEach((point) => {
    const latKey = point.latitude.toFixed(precision);
    const lngKey = point.longitude.toFixed(precision);
    const key = `${latKey}-${lngKey}`;

    if (!groups[key]) {
      groups[key] = [];
    }

    groups[key].push(point);
  });

  return Object.values(groups).map((group, index) => {
    const latitude =
      group.reduce((sum, point) => sum + point.latitude, 0) / group.length;

    const longitude =
      group.reduce((sum, point) => sum + point.longitude, 0) / group.length;

    return {
      id: `cluster-${index}`,
      latitude,
      longitude,
      count: group.length,
      points: group,
    };
  });
}

export default function App() {
  const [selectedPoint, setSelectedPoint] = useState<Point | null>(null);
  const mapRef = useRef<MapView>(null);
  const [region, setRegion] = useState<Region>({
    latitude: 51.889,
    longitude: 5.432,
    latitudeDelta: 0.5,
    longitudeDelta: 0.5,
  });

const shouldCluster = region.latitudeDelta > 0.08;

const precision = region.latitudeDelta > 0.5 ? 1 : 2;

const clusters = createClusters(points, precision);

  return (
    <View style={styles.container}>
      <MapView
      ref={mapRef}
        style={styles.map}
        initialRegion={region}
        onRegionChangeComplete={setRegion}
      >
       {shouldCluster
  ? clusters.map((cluster) => (
     <Marker
  key={cluster.id}
  coordinate={{
    latitude: cluster.latitude,
    longitude: cluster.longitude,
  }}
  onPress={() => {
    mapRef.current?.animateToRegion(
      {
        latitude: cluster.latitude,
        longitude: cluster.longitude,
        latitudeDelta: region.latitudeDelta / 3,
        longitudeDelta: region.longitudeDelta / 3,
      },
      500
    );
  }}
>
        <View style={styles.cluster}>
          <Text style={styles.clusterText}>{cluster.count}</Text>
        </View>
      </Marker>
    ))
  : points.map((point) => (
      <Marker
        key={point.id}
        coordinate={{
          latitude: point.latitude,
          longitude: point.longitude,
        }}
        onPress={() => setSelectedPoint(point)}
      >
        <View style={styles.marker}>
          <Text style={styles.icon}>{getIcon(point.category)}</Text>
        </View>
      </Marker>
    ))}
      </MapView>
    {selectedPoint && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{selectedPoint.title}</Text>

          <Text style={styles.cardCategory}>
            {getIcon(selectedPoint.category)} {selectedPoint.category}
          </Text>

          <Pressable
            style={styles.closeButton}
            onPress={() => setSelectedPoint(null)}
          >
            <Text style={styles.closeText}>Close</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
} 


const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },

marker: {
  width: 42,
  height: 42,
  borderRadius: 21,
  backgroundColor: "#2563eb",
  alignItems: "center",
  justifyContent: "center",
  borderWidth: 3,
  borderColor: "white",
  elevation: 8,
  shadowColor: "#000",
  shadowOpacity: 0.3,
  shadowRadius: 5,
},

icon: {
  fontSize: 20,
},

  cluster: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#2563eb",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "white",
    elevation: 8,
  },

  clusterText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  card: {
  position: "absolute",
  left: 16,
  right: 16,
  bottom: 24,
  backgroundColor: "white",
  padding: 18,
  borderRadius: 20,
  elevation: 10,
},

cardTitle: {
  fontSize: 20,
  fontWeight: "bold",
  color: "#111827",
},

cardCategory: {
  marginTop: 6,
  fontSize: 16,
  color: "#4b5563",
},

closeButton: {
  marginTop: 14,
  alignSelf: "flex-start",
  backgroundColor: "#2563eb",
  paddingHorizontal: 16,
  paddingVertical: 10,
  borderRadius: 12,
},

closeText: {
  color: "white",
  fontWeight: "bold",
},
  
});