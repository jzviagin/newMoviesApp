import React, { useCallback } from 'react';
import { observer } from 'mobx-react';
import { View, TextInput, FlatList, Text, Image } from 'react-native';
import { MoviesStore } from '../../Stores/Movies/MoviesStore';
import { styles } from './HomeScreen.styles';
import MovieList from '../../Components/MovieList/MovieList';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type HomeScreenNavigationProp = NativeStackNavigationProp<
  { Home: undefined; Details: undefined },
  'Home'
>;

type HomeScreenProps = {
  navigation: HomeScreenNavigationProp;
};

const HomeScreen: React.FC<HomeScreenProps> = observer(props => {
  const insets = useSafeAreaInsets();
  const navigateToDetails = useCallback(() => {
    props.navigation.navigate('Details');
  }, []);
  console.log('insets', insets, props);
  return (
    <View
      style={{ marginBottom: insets.bottom, flex: 1, backgroundColor: 'white' }}
    >
      <TextInput
        style={styles.textInput}
        value={MoviesStore.currentTerm}
        placeholder="Search"
        onChangeText={text => {
          MoviesStore.setSearchTerm(text);
        }}
      />
      <MovieList navigateToDetails={navigateToDetails} />
    </View>
  );
});

export default HomeScreen;
