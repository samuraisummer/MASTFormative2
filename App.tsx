import React, { useState } from 'react';
import {SafeAreaView, Text, TextInput, StyleSheet, FlatList, TouchableOpacity, Button, ScrollView, View, Image} from 'react-native';
import { Picker } from '@react-native-picker/picker';

type DishDetails = {
  name: string;
  description: string;
  course: string;
  price: string;
};

type Screen = 'Home' | 'Menus' | 'Drinks' | 'Bookings';

const predefinedDishes = [
  { id: '1', name: 'Spaghetti Bolognese' },
  { id: '2', name: 'Caesar Salad' },
  { id: '3', name: 'Grilled Salmon' },
  { id: '4', name: 'Chocolate Lava Cake' },
];

const courseOptions = ['Appetizer', 'Main', 'Dessert'];

/*Menus Screen*/

function MenusScreen({
  onBack,
  predefined,
  courseOptions,
  menuDetails,
  setMenuDetails,
}: {
  onBack: () => void;
  predefined: { id: string; name: string }[];
  courseOptions: string[];
  menuDetails: Record<string, DishDetails>;
  setMenuDetails: React.Dispatch<React.SetStateAction<Record<string, DishDetails>>>;
}) {
  const [selectedDishId, setSelectedDishId] = useState<string | null>(null);

  const handleDishSelect = (dish: { id: string; name: string }) => {
    setSelectedDishId(dish.id);
    setMenuDetails(prev => ({
      ...prev,
      [dish.id]: prev[dish.id] ?? {
        name: dish.name,
        description: '',
        course: courseOptions[1] ?? 'Main',
        price: '',
      },
    }));
  };

  const updateDetail = (field: keyof DishDetails, value: string) => {
    if (!selectedDishId) return;
    setMenuDetails(prev => ({
      ...prev,
      [selectedDishId]: {
        ...prev[selectedDishId],
        [field]: value,
      },
    }));
  };

  const selectedDetails = selectedDishId ? menuDetails[selectedDishId] : null;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.backText}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Menus</Text>
        <View style={{ width: 60 }} />
      </View>

      <Text style={styles.subTitle}>Select a Dish:</Text>
      <FlatList
        data={predefined}
        horizontal
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.dishButton, item.id === selectedDishId && styles.selectedDish]}
            onPress={() => handleDishSelect(item)}
          >
            <Text style={styles.dishText}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />

      {selectedDetails && (
        <ScrollView style={styles.formContainer}>
          <Text style={styles.label}>Dish Name</Text>
          <TextInput
            style={styles.input}
            value={selectedDetails.name}
            onChangeText={text => updateDetail('name', text)}
          />

          <Text style={styles.label}>Description</Text>
          <TextInput
            style={styles.input}
            value={selectedDetails.description}
            onChangeText={text => updateDetail('description', text)}
            multiline
          />

          <Text style={styles.label}>Course</Text>
          <Picker
            selectedValue={selectedDetails.course}
            style={styles.picker}
            onValueChange={(itemValue: string | number) => updateDetail('course', String(itemValue))}
          >
            {courseOptions.map(course => (
              <Picker.Item key={course} label={course} value={course} />
            ))}
          </Picker>

          <Text style={styles.label}>Price ($)</Text>
          <TextInput
            style={styles.input}
            value={selectedDetails.price}
            onChangeText={text => updateDetail('price', text)}
            keyboardType="numeric"
          />

          <Button title="Save" onPress={() => alert('Menu saved')} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

/*Home Screen*/

function HomeScreen({
  onNavigate,
  menuDetails,
}: {
  onNavigate: (s: Screen) => void;
  menuDetails: Record<string, DishDetails>;
}) {
  const items = Object.values(menuDetails);
  const totalAvailable = predefinedDishes.length; // total number of menu items to select from

  return (
    <View style={styles.screen}>
      {/* NEW: App title above the options */}
      <Text style={styles.title}>Cristoffel's Kitchen: Westville's Premier Diner</Text>

      <View style={styles.homeMenuContainer}>
        <TouchableOpacity style={styles.menuButton} onPress={() => onNavigate('Menus')}>
          <Text style={styles.menuButtonText}>Menus</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuButton} onPress={() => onNavigate('Drinks')}>
          <Text style={styles.menuButtonText}>Drinks & Appetizers</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuButton} onPress={() => onNavigate('Bookings')}>
          <Text style={styles.menuButtonText}>Bookings</Text>
        </TouchableOpacity>
      </View>

      <Image
        source={{ uri: 'https://placekitten.com/400/300' }}
        style={{ width: 220, height: 160, resizeMode: 'cover', marginTop: 24, borderRadius: 8 }}
      />

      <Text style={{ fontSize: 22, fontWeight: '600', marginTop: 12, color: '#fff' }}>Prepared Menu</Text>

      <Text style={{ color: '#ccc', marginTop: 8 }}>
        Available items to select from: {totalAvailable}
      </Text>

      {items.length === 0 ? (
        <Text style={{ color: '#ccc', marginTop: 12 }}>No menu items yet. Add items in Menus.</Text>
      ) : (
        <ScrollView style={{ width: '100%', marginTop: 12, paddingHorizontal: 20 }}>
          {items.map((it, idx) => (
            <View key={idx} style={styles.menuItem}>
              <Text style={styles.menuItemTitle}>
                {it.name} — {it.course}
              </Text>
              <Text style={styles.menuItemSubtitle}>{it.description}</Text>
              <Text style={styles.menuItemPrice}>{it.price ? `$${it.price}` : 'Price not set'}</Text>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

/*Drinks / Bookings*/

function DrinksScreen({ onBack }: { onBack: () => void }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.backText}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Drinks & Appetizers</Text>
        <View style={{ width: 60 }} />
      </View>
      <View style={{ padding: 16 }}>
        <Text style={styles.title}>Drinks & Appetizers</Text>
        <Text style={{ color: '#555', marginTop: 8 }}>Placeholder screen — add drink/appetizer editor here.</Text>
      </View>
    </SafeAreaView>
  );
}

function BookingsScreen({ onBack }: { onBack: () => void }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.backText}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bookings</Text>
        <View style={{ width: 60 }} />
      </View>
      <View style={{ padding: 16 }}>
        <Text style={styles.title}>Bookings</Text>
        <Text style={{ color: '#555', marginTop: 8 }}>Placeholder screen — add bookings list/management here.</Text>
      </View>
    </SafeAreaView>
  );
}

/* ---------------------------
   App (root) - lifted menu state
   --------------------------- */
export default function App() {
  const [screen, setScreen] = useState<Screen>('Home');
  const [menuDetails, setMenuDetails] = useState<Record<string, DishDetails>>({});

  if (screen === 'Home') return <HomeScreen onNavigate={s => setScreen(s)} menuDetails={menuDetails} />;
  if (screen === 'Menus')
    return (
      <MenusScreen
        onBack={() => setScreen('Home')}
        predefined={predefinedDishes}
        courseOptions={courseOptions}
        menuDetails={menuDetails}
        setMenuDetails={setMenuDetails}
      />
    );
  if (screen === 'Drinks') return <DrinksScreen onBack={() => setScreen('Home')} />;
  return <BookingsScreen onBack={() => setScreen('Home')} />;
}

/*Styles*/

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // app background -> black
  },
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#000', //Makes the app's background black*/
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff',
  },
  subTitle: {
    fontSize: 18,
    marginBottom: 10,
    color: '#ddd',
  },
 
  homeMenuContainer: {
    width: '100%',
    alignItems: 'center',
  },
  /*tyles for the menu buttons used on HomeScreen*/

  menuButton: {
    width: '90%',
    backgroundColor: '#fff',
    paddingVertical: 14,
    borderRadius: 8,
    marginVertical: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  menuButtonText: {
    color: '#000', //Text on white box//
    fontSize: 16,
    fontWeight: '600',
  },

  menuItem: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
  },
  menuItemSubtitle: {
    fontSize: 13,
    color: '#333',
    marginTop: 6,
  },
  menuItemPrice: {
    marginTop: 8,
    color: '#333',
    fontWeight: '600',
  },

  navButton: {
    backgroundColor: '#007bff',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  navButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  dishButton: {
    backgroundColor: '#eee',
    padding: 10,
    marginRight: 10,
    borderRadius: 6,
  },
  selectedDish: {
    backgroundColor: '#cce5ff',
  },
  dishText: {
    fontSize: 16,
  },
  formContainer: {
    marginTop: 20,
  },
  label: {
    fontSize: 16,
    marginTop: 10,
    color: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    marginTop: 5,
    backgroundColor: '#fff',
    color: '#000',
  },
  picker: {
    height: 50,
    width: '100%',
    marginTop: 5,
    backgroundColor: '#fff',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingTop: 6,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  backText: {
    color: '#4da6ff',
    fontSize: 18,
    width: 60,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
});