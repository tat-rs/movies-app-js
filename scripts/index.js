const API_URL_POPULAR = 'https://kinopoiskapiunofficial.tech/api/v2.2/films/top?type=TOP_100_POPULAR_FILMS&page=1';
const API_URL_FILM_BY_ID = 'https://kinopoiskapiunofficial.tech/api/v2.2/films/';
const API_KEY ='a82832f0-0e0f-41e0-a266-af9c197b0037';
const movieList = document.querySelector('.movies__list');
const loader = document.querySelector('.loader');
const popup = document.querySelector('.popup');

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
    movieCard.addEventListener('click', () => {
      openPopup(item.filmId);
    })
    movieList.appendChild(movieCard);
  });

}

async function openPopup(movieId) {
  const resp = await fetch(API_URL_FILM_BY_ID + movieId, {
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": API_KEY,
    },
  });
  const movie = await resp.json();

  popup.classList.add('popup_opened');
  popup.innerHTML = `
    <div class="popup__container">
      <img class="popup__image" src=${movie.posterUrl} alt=${movie.nameRu}>
      <h3 class="popup__subtitle">${movie.nameRu}</h3>
      <ul class="popup__list">
        <li class="popup__item popup__genres">Жанр: ${movie.genres.map(
          (genre) => ` ${genre.genre}`
        )}</li>
        <li class="popup__item popup__film-length">Продолжительность: ${movie.filmLength ? `${movie.filmLength} мин.` : ' Не определенно'}</li>
        <li class="popup__item">Сайт: <a class="popup__link" href=${movie.posterUrlPreview}>${movie.posterUrlPreview}</a></li>
        <li class="popup__item popup__film-desc">Описание: ${movie.description}</li>
      </ul>
      <button class="popup__close" type="button" aria-label="Закрыть">Закрыть</button>
    </div>
  `

  const closeBtn = popup.querySelector('.popup__close');
  closeBtn.addEventListener('click', closePopup);
  window.addEventListener("keydown", closePopupByEsc);
  popup.addEventListener("mousedown", closePopupByOverlayClick);
}

function closePopupByEsc(evt) {
  if (evt.key === "Escape") {
    closePopup();
  }
}

function closePopupByOverlayClick(evt) {
  if (evt.target === evt.currentTarget) {
    closePopup();
  }
}

//объявление функции закрытия попапа
function closePopup() {
  popup.classList.remove("popup_opened");
  window.removeEventListener("keydown", closePopupByEsc);
  popup.removeEventListener("mousedown", closePopupByOverlayClick);
}

getMovies();