import React, { useCallback } from 'react';
import { observer } from 'mobx-react';
import { View, FlatList, Text, Image } from 'react-native';
import { MoviesStore } from '../../Stores/Movies/MoviesStore';
import MovieTitle from '../MovieTitle/MovieTitle';
import LoadingScreen from '../LoadingScreen/LoadingScreen';

interface MovieListProps {
  navigateToDetails: () => void;
}

const MovieList: React.FC<MovieListProps> = observer(props => {
  const handlePress = useCallback<(index: number) => void>((index: number) => {
    MoviesStore.fetchDetails(index);
    props.navigateToDetails();
  }, []);
  if (MoviesStore.isLoading) {
    return <LoadingScreen />;
  }
  return (
    <FlatList
      data={MoviesStore.allMovies}
      keyExtractor={item => item.imdbId}
      renderItem={({ item, index }) => {
        return (
          <MovieTitle
            title={item.title}
            year={item.year}
            poster={item.poster}
            imdbId={item.imdbId}
            onPress={handlePress.bind(null, index)}
          />
        );
      }}
    />
  );
});

export default MovieList;
