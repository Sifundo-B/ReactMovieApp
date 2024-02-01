import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MovieSearchApp = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showPreviousResults, setShowPreviousResults] = useState(false);

  const handleSearch = async () => {
    try {
      const response = await axios.get(`https://localhost:7008/api/movies/search?title=${searchQuery}`);
      const responseData = response.data;
      const results = responseData && responseData.searchResults ? responseData.searchResults : [];
      setSearchResults(results);
      setSearchHistory((prevHistory) => [...prevHistory, searchQuery]);
      setSelectedMovie(null); // Clear selected movie when searching for a new movie
      setShowPreviousResults(false); // Hide previous results when searching for a new movie
    } catch (error) {
      console.error('Error fetching search results:', error.message);
    }
  };

  const handleMovieDetails = async (imdbId) => {
    try {
      const response = await axios.get(`https://localhost:7008/api/movies/details/${imdbId}`);
      setSelectedMovie(response.data);
      setSearchResults([]); // Clear search results when viewing movie details
      setShowPreviousResults(false); // Hide previous results when viewing movie details
    } catch (error) {
      console.error('Error fetching movie details:', error.message);
    }
  };

  const handleShowPreviousResults = () => {
    setShowPreviousResults(true);
  };

  return (
    <div>
      <h1>Movie Search App</h1>

      <div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Enter movie title"
        />
        <button onClick={handleSearch}>Search</button>
        <button onClick={handleShowPreviousResults}>Show Previous Results</button>
      </div>

      {showPreviousResults && (
        <div>
          <h2>Previous Searches</h2>
          <ul>
            {searchHistory.map((previousSearch, index) => (
              <li key={index}>{previousSearch}</li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <h2>Search Results</h2>
        <ul>
          {searchResults && searchResults.map((movie) => (
            <li key={movie.imdbID}>
              {movie.title} ({movie.year}){' '}
              <img src={movie.poster} alt="new" />
              <button onClick={() => handleMovieDetails(movie.imdbID)}>View Details</button>
            </li>
          ))}
        </ul>
      </div>

      {selectedMovie ? (
        <div>
          <h2>Selected Movie Details</h2>
          <p>Title: {selectedMovie.title}</p>
          <p>Year: {selectedMovie.year}</p>
          <p>Poster: <img src={selectedMovie.poster} alt="new" /></p>
          {/* Add more details as needed */}
        </div>
      ) : null}
    </div>
  );
};

export default MovieSearchApp;
