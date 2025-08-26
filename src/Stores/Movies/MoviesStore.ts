import {
  makeObservable,
  observable,
  action,
  reaction,
  computed,
  runInAction,
} from 'mobx';
import { MovieDetails, MovieTitle } from '../../Types/Movie';
import { OMDB_API_KEY } from '@env';

class MoviesStoreType {
  movies: MovieTitle[];
  searchTerm: string;
  movieDetails: MovieDetails | undefined = undefined;
  timeout: number = 0;
  loading: boolean = false;

  constructor() {
    this.movies = [];
    this.searchTerm = '';

    makeObservable(this, {
      movies: observable,
      searchTerm: observable,
      fetch: action,
      clearMovies: action,
      setSearchTerm: action,
      currentTerm: computed,
      allMovies: computed,
      fetchDetails: action,
      movieDetails: observable,
      currentMovie: computed,
      loading: observable,
      isLoading: computed,
      setLoading: action,
    });
  }

  fetchDetails(index: number) {
    this.movieDetails = undefined;
    this.setLoading(true);
    fetch(
      `https://www.omdbapi.com/?i=${this.movies[index].imdbId}&apikey=${OMDB_API_KEY}`,
    )
      .then(res => {
        return res.json();
      })
      .then(data => {
        console.log('data', data);
        runInAction(() => {
          this.movieDetails = {
            title: data.Title,
            year: data.Year,
            runtime: data.Runtime,
            genre: data.Genre,
            director: data.Director,
            writer: data.Writer,
            actors: data.Actors,
            plot: data.Plot,
            language: data.Language,
            poster: data.Poster,
          };
        });
        this.setLoading(false);
      })
      .catch(error => {
        this.setLoading(false);
      });
  }

  get currentMovie() {
    return this.movieDetails;
  }

  get isLoading() {
    return this.loading;
  }

  setLoading(value: boolean) {
    this.loading = value;
  }

  fetch() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.timeout = setTimeout(() => {
      this.setLoading(true);
      this.timeout = 0;
      console.log('api key', OMDB_API_KEY);
      fetch(
        `https://www.omdbapi.com/?s=${this.searchTerm}&apikey=${OMDB_API_KEY}`,
      )
        .then(res => {
          return res.json();
        })
        .then(data => {
          console.log('data', data);
          if (data.Search && data.Search.length) {
            let newMovies: MovieTitle[] = [];
            data.Search.forEach(
              (item: {
                Title: string;
                Year: string;
                Poster: string;
                imdbID: string;
              }) => {
                newMovies.push({
                  title: item.Title,
                  year: item.Year,
                  poster: item.Poster,
                  imdbId: item.imdbID,
                });
              },
            );
            runInAction(() => {
              this.movies = newMovies;
            });
            this.setLoading(false);
            return;
          }
          this.setLoading(false);
          this.clearMovies();
        })
        .catch(error => {
          this.setLoading(false);
        });
    }, 1500);
  }
  clearMovies() {
    this.movies = [];
  }

  get currentTerm() {
    return this.searchTerm;
  }

  get allMovies() {
    return this.movies;
  }

  setSearchTerm(term: string) {
    this.searchTerm = term;
  }
}

export const MoviesStore = new MoviesStoreType();

reaction(
  () => MoviesStore.searchTerm,
  (searchTerm, prevSearchTerm) => {
    if (MoviesStore.currentTerm.trim() == '') {
      MoviesStore.clearMovies();
      return;
    }
    MoviesStore.fetch();
  },
);
