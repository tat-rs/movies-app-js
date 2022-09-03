const API_URL_POPULAR = 'https://kinopoiskapiunofficial.tech/api/v2.2/films/top?type=TOP_100_POPULAR_FILMS&page=1';
const API_KEY ='a82832f0-0e0f-41e0-a266-af9c197b0037';
const movieList = document.querySelector('.movies__list');
const loader = document.querySelector('.loader');

function getClassAverage(rating) {
  let classRating = '';

  if(rating < 4) {
    classRating = 'movie__average-red'
  } else if(rating > 4 & rating < 7) {
    classRating = 'movie__average-orange'
  } else {
    classRating = 'movie__average-green'
  }

 return classRating;
}

async function getMovies() {
  loader.classList.add('loader_visible');
  const data = await fetch(API_URL_POPULAR, {
    method: 'GET',
    headers: {
        'X-API-KEY': API_KEY,
        'Content-Type': 'application/json',
    },
  })

  const movies = await data.json();
  loader.classList.remove('loader_visible');
  renderMovies(movies.films);
}

function renderMovies(cards) {

  cards.forEach(item => {
    const movieCard = document.createElement('li');
    movieCard.classList.add('movies__card');
    movieCard.innerHTML = `
      <img class="movies__image" src=${item.posterUrl} alt=${item.nameRu}>
      <h2 class="movies__title">${item.nameRu}</h2>
      <p class="movies__genre">${item.genres.map(
        (genre) => ` ${genre.genre}`
      )}</p>
      ${item.rating ? `<div class="movie__average ${getClassAverage(item.rating)}">${item.rating}</div>` : ""}
    `
    movieList.appendChild(movieCard);
  });

}

getMovies();