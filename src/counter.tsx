import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export const Counter = () => {
  const [count, setCount] = React.useState(0);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Count: {count}</Text>
      <View style={styles.buttonContainer}>
        <Pressable style={styles.button} onPress={() => setCount((c) => c + 1)}>
          <Text style={styles.buttonText}>+</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={() => setCount((c) => c - 1)}>
          <Text style={styles.buttonText}>−</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },
  button: {
    alignSelf: 'center',
    backgroundColor: 'grey',
    padding: 10,
    borderColor: 'black',
    borderWidth: 1,
    marginHorizontal: 10,
  },
  buttonText: {
    fontSize: 18,
  },
});
