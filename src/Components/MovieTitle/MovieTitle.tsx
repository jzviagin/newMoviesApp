import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { styles } from './MovieTitle.styles';

interface MovieTitleProps {
  title: string;
  poster: string;
  year: string;
  imdbId: string;
  onPress: () => void;
}

const MovieTitle: React.FC<MovieTitleProps> = (props: MovieTitleProps) => {
  return (
    <TouchableOpacity style={styles.container} onPress={props.onPress}>
      <Image source={{ uri: props.poster }} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{props.title}</Text>
        <Text>{props.year}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default MovieTitle;
