import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import {
  View,
  TextInput,
  FlatList,
  Text,
  Image,
  ScrollView,
} from 'react-native';
import { MoviesStore } from '../../Stores/Movies/MoviesStore';
import { styles } from './DetailsScreen.styles';
import MovieList from '../../Components/MovieList/MovieList';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import FullWidthImage from '../../Components/FullWidthImage/FullWidthImage';
import LoadingScreen from '../../Components/LoadingScreen/LoadingScreen';

type DetailsScreenNavigationProp = NativeStackNavigationProp<
  { Home: undefined; Details: undefined },
  'Details'
>;

type DetailscreenProps = {
  navigation: DetailsScreenNavigationProp;
};

const DetailsScreen: React.FC<DetailscreenProps> = observer(props => {
  const insets = useSafeAreaInsets();
  useEffect(() => {
    props.navigation.setOptions({
      title: MoviesStore.currentMovie?.title || '',
      headerTitleAlign: 'center',
    });
  }, [MoviesStore.currentMovie?.title]);
  console.log('insets', insets);
  if (MoviesStore.isLoading) {
    return <LoadingScreen />;
  }
  return (
    <ScrollView
      style={{ marginBottom: insets.bottom, flex: 1, backgroundColor: 'white' }}
    >
      <Text style={[styles.bigText, { marginTop: 10 }]}>
        {MoviesStore.currentMovie?.genre +
          ', ' +
          MoviesStore.currentMovie?.year}
      </Text>
      <Text style={styles.bigText}>
        {'Cast: ' + MoviesStore.currentMovie?.actors}
      </Text>
      <Text style={styles.bigText}>
        {'Director: ' + MoviesStore.currentMovie?.director}
      </Text>
      <FullWidthImage
        style={{ marginVertical: 20 }}
        source={{ uri: MoviesStore.currentMovie?.poster }}
      />
      <Text style={styles.smallText}>{MoviesStore.currentMovie?.plot}</Text>
    </ScrollView>
  );
});

export default DetailsScreen;
