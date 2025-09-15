import * as React from 'react';
import { FlatList, Pressable, StyleSheet, Text } from 'react-native';

const websites = [
  { name: 'Dashboard' },
  { name: 'My Investments' },
  { name: 'Wallet' },
];

export function ListScreen({ navigation }: any) {
  return (
    <FlatList
      data={websites}
      automaticallyAdjustContentInsets
      renderItem={({ item }) => {
        return (
          <ListItem
            {...item}
            onPress={() => navigation.navigate('Details', item)}
          />
        );
      }}
    />
  );
}

function ListItem({ name, onPress }: any) {
  return (
    <Pressable style={styles.listItem} onPress={onPress}>
      <Text style={styles.title}>{name}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  listItem: {
    padding: 16,
  },
  title: {
    fontSize: 20,
  },
});
