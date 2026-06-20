import { useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import MapView, { Marker, Region } from "react-native-maps";

const points = [
  { id: 1, title: "Truck Parking", category: "parking", latitude: 51.8862, longitude: 5.4297 },
  { id: 2, title: "Fuel Station", category: "fuel", latitude: 51.887, longitude: 5.43 },
  { id: 3, title: "Restaurant", category: "food", latitude: 51.888, longitude: 5.431 },
  { id: 4, title: "Shower", category: "shower", latitude: 51.889, longitude: 5.432 },
  { id: 5, title: "Service", category: "service", latitude: 51.89, longitude: 5.433 },
  { id: 6, title: "Truck Parking 2", category: "parking", latitude: 51.891, longitude: 5.434 },
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

const clusterCenter = {
  latitude: points.reduce((sum, p) => sum + p.latitude, 0) / points.length,
  longitude: points.reduce((sum, p) => sum + p.longitude, 0) / points.length,
};

export default function App() {
  const [region, setRegion] = useState<Region>({
    latitude: 51.889,
    longitude: 5.432,
    latitudeDelta: 0.5,
    longitudeDelta: 0.5,
  });

  const shouldCluster = region.latitudeDelta > 0.15;

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={region}
        onRegionChangeComplete={setRegion}
      >
        {shouldCluster ? (
          <Marker coordinate={clusterCenter}>
            <View style={styles.cluster}>
              <Text style={styles.clusterText}>{points.length}</Text>
            </View>
          </Marker>
        ) : (
          points.map((point) => (
            <Marker
              key={point.id}
              coordinate={{
                latitude: point.latitude,
                longitude: point.longitude,
              }}
              title={point.title}
            >
              <View style={styles.marker}>
                <Text style={styles.icon}>{getIcon(point.category)}</Text>
              </View>
            </Marker>
          ))
        )}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },

  marker: {
    backgroundColor: "red",
    padding: 8,
    borderRadius: 20,
    elevation: 5,
  },

  icon: {
    fontSize: 22,
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
});