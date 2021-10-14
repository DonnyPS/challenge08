import React, { Component } from "react";
import { getMovies } from "../services/fakeMovieService";
import { getGenres } from "../services/fakeGenreService";
import ListGroup from "./common/list-group";
import Paging from "./common/pagination";
import { pagination } from "./utils/pagination";
import { Link } from "react-router-dom";
import Search from "./common/search";
import MoviesTable from "./moviesTable";
import * as _ from "lodash";

class Movies extends Component {
  state = {
    movies: [],
    genres: [],
    pageSize: 5,
    currentPage: 1,
    searchQuery: "",
    selectedGenre: { _id: 0, name: "All Genres" },
    sortPath: { sort: "title", order: "asc" },
  };

  componentDidMount() {
    const genres = [{ _id: 0, name: "All Genres" }, ...getGenres()];
    this.setState({ movies: getMovies(), genres });
  }

  handleDelete = (movie) => {
    const movies = this.state.movies.filter((m) => m._id !== movie._id);
    this.setState({ movies });
  };

  handleLike = (movie) => {
    const movies = [...this.state.movies];
    const index = movies.indexOf(movie);
    movies[index].liked = !movies[index].liked;
    this.setState({ movies });
  };

  handleChangePage = (page) => {
    this.setState({ currentPage: page });
  };

  handleSelectGenre = (genre) => {
    this.setState({ selectedGenre: genre, searchQuery: "", currentPage: 1 });
  };

  handleSearch = (query) => {
    this.setState({ searchQuery: query, selectedGenre: null, currentPage: 1 });
  };

  handleSort = (sortPath) => {
    this.setState({ sortPath });
  };

  getPageItem = () => {
    const {
      pageSize,
      currentPage,
      movies: allMovies,
      selectedGenre,
      searchQuery,
      sortPath,
    } = this.state;

    // Initial data
    let filtered = allMovies;
    // Searching
    if (searchQuery)
      filtered = allMovies.filter((m) =>
        m.title.toLowerCase().startsWith(searchQuery.toLowerCase())
      );
    // Filtering
    else if (selectedGenre && selectedGenre._id !== 0)
      filtered = allMovies.filter(
        (movie) => movie.genre._id === selectedGenre._id
      );
    // Sorting
    const sorted = _.orderBy(filtered, sortPath.sort, sortPath.order);
    // Paginating
    const movies = pagination(sorted, currentPage, pageSize);

    return { data: movies, length: filtered.length };
  };

  render() {
    const { length: count } = this.state.movies;
    const { pageSize, currentPage, sortPath } = this.state;

    if (count === 0) return <p>There are no movie in the database.</p>;

    const { data: movies, length } = this.getPageItem();

    return (
      <div className="row">
        <div className="col-sm-12 col-md-3 mb-3">
          <ListGroup
            genres={this.state.genres}
            onSelectGenre={this.handleSelectGenre}
            selectedGenre={this.state.selectedGenre}
          />
        </div>
        <div className="col">
          <Link to={`/movies/new`}>
            <button className="btn btn-primary">New Movies</button>
          </Link>
          <div className="mt-2">
            <p>Showing {length} movies in the database</p>
          </div>
          <Search onSearch={this.handleSearch} />
          <MoviesTable
            movies={movies}
            onLike={this.handleLike}
            onDelete={this.handleDelete}
            onSort={this.handleSort}
            sortPath={sortPath}
          />
          <Paging
            totalNumbers={length}
            pageSize={pageSize}
            currentPage={currentPage}
            onChangePage={this.handleChangePage}
          />
        </div>
      </div>
    );
  }
}

export default Movies;
