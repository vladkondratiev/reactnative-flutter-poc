import { useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export function DetailsScreen({ route }: any) {
  const { name } = route.params;
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      title: name,
    });
  }, [navigation, name]);

  return (
    <View style={styles.screen}>
      <Text style={styles.label}>The content of {name} screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    padding: 10,
  },
  label: {
    marginVertical: 10,
    fontSize: 20,
  },
  button: {
    paddingVertical: 16,
  },
  buttonText: {
    fontSize: 20,
    // color: 'blue',
  },
});
