/**
 * @API - The Movie DB
 * @key - ab1108ff64d84d869773eb7692b0749f
 * @Root_url - https://api.themoviedb.org
 * @example - https://api.themoviedb.org/3/movie/550?api_key=${key}
 */

let HtmlElements = {
  main: document.querySelector('.info-block__main'),
  movie: document.querySelector('.info-block__movie'),
  movies: document.querySelectorAll('.info-block__movie')
};

const API = {
  url: 'https://api.themoviedb.org/3/',
  key: 'ab1108ff64d84d869773eb7692b0749f'
};

let configData, baseImgUrl;
let movies = [];
let genreList = {};
const switchTimer = 5000;
let nextMovie, backToStart;
const mainStyle = getComputedStyle(HtmlElements.main);
let distanceToScroll = mainStyle.width;

const getConfig = () => {
  let url = ''.concat(API.url, 'configuration?api_key=', API.key);
  fetch(url)
    .then(result => result.json())
    .then(data => {
      baseImgUrl = data.images.secure_base_url;
      configData = data.images;
      fetchMovies(configData);
    });
};

const getGenres = () =>
  fetch(`${API.url}genre/movie/list?api_key=${API.key}&language=en-US`)
    .then(response => response.json())
    .then(data => {
      let genreArray = data.genres;
      const arrayToObject = array =>
        array.reduce((obj, item) => {
          obj[item.id] = item;
          return obj;
        }, {});
      const genreObject = arrayToObject(genreArray);
      genreList = {
        ...genreObject
      };
    });

const getRandomPage = max => {
  return Math.floor(Math.random() * Math.floor(10));
};

const fetchMovies = config => {
  fetch(`${API.url}movie/top_rated?api_key=${API.key}&page=${getRandomPage()}`)
    .then(result => result.json())
    .then(data => {
      movies = data.results;
      movies.splice(movies.length / 2, movies.length / 2);
      renderMovies(movies, config);
      startScroll();
    });
};

const renderMovies = (movies, config) => {
  movies.map(movie => {
    markup = `
    <div class="info-block__movie">
      <div class="info-block__top">
        <div class="info-block__image">
          <img src="${config.secure_base_url}w154${movie.poster_path}" alt="${
      movie.title
    }" />
        </div>
        <div class="info-block__details">
          <h3>${movie.title}</h3>
          <p>${movie.genre_ids.map(genre => `${genreList[genre].name} `)}</p>
          <button class="info-block__button">&#10150; more</button>
        </div>
      </div>
      <div class="info-block__bottom">
        <div class="info-block__rating">
          <img src="./assets/star.png" alt="star" />
          <p>${movie.vote_average}</p>
        </div>
        <div class="info_block__description">
          <p class="info-block__paragraph">
           ${movie.overview}
          </p>
        </div>
      </div>
    </div>
    `;
    HtmlElements.main.insertAdjacentHTML('afterbegin', markup);
  });
};

const startScroll = () => {
  HtmlElements = {
    ...HtmlElements,
    movies: document.querySelectorAll('.info-block__movie')
  };
  if (parseInt(mainStyle.width) < 720) {
    nextMovie = window.setInterval(
      () =>
        HtmlElements.main.scrollBy({
          left: parseInt(mainStyle.width),
          behavior: 'smooth'
        }),
      switchTimer
    );
    backToStart = window.setInterval(
      () =>
        HtmlElements.main.scrollBy({
          left: -parseInt(mainStyle.width) * 10,
          behavior: 'smooth'
        }),
      HtmlElements.movies.length * switchTimer + 1000
    );
  } else {
    nextMovie = window.setInterval(
      () =>
        HtmlElements.main.scrollBy({
          left: parseInt(mainStyle.width),
          behavior: 'smooth'
        }),
      switchTimer
    );
    backToStart = window.setInterval(
      () =>
        HtmlElements.main.scrollBy({
          left: -parseInt(mainStyle.width) * 5,
          behavior: 'smooth'
        }),
      (HtmlElements.movies.length * switchTimer) / 2 + 1000
    );
  }
};

const stopScroll = () => {
  clearInterval(nextMovie);
  clearInterval(backToStart);
};

window.onload = () => {
  getGenres();
  getConfig();
};

HtmlElements.main.addEventListener('mouseenter', () => {
  stopScroll();
});
HtmlElements.main.addEventListener('mouseleave', () => {
  startScroll();
});
window.addEventListener('resize', () => {
  stopScroll();
  startScroll();
});
