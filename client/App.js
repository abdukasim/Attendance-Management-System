import React from 'react';
import {Text, View, StyleSheet} from 'react-native';

const App = () => {
  return (
    <View style={styles.center}>
      <Text>Hello, world!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ccc',
  },
});
export default App;
