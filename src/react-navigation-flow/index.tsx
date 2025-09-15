import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import { DetailsScreen } from './details-screen';
import { ListScreen } from './list-screen';

const RootStack = createStackNavigator();

export function ReactNavigationFlow() {
  return (
    <NavigationContainer>
      <RootStack.Navigator>
        <RootStack.Screen name='Menu' component={ListScreen} />
        <RootStack.Screen name='Details' component={DetailsScreen} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
