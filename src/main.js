class BooksApi {
  constructor() {
    this.BASE_URL = 'http://localhost:3000';
    this.END_POINT = '/books';
  }

  getBooks() {
    const url = this.BASE_URL + this.END_POINT;

    return fetch(url).then(res => {
      if (res.ok) {
        return res.json();
      } else {
        throw new Error(res.status);
      }
    });
  }
  createBook(book) {
    const url = this.BASE_URL + this.END_POINT;

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(book),
    };

    return fetch(url, options).then(res => {
      if (res.ok) {
        return res.json();
      } else {
        throw new Error(res.status);
      }
    });
  }
  updateBook({ id, ...book }) {
    const url = `${this.BASE_URL}${this.END_POINT}/${id}`;

    const options = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(book),
    };

    return fetch(url, options).then(res => {
      if (res.ok) {
        return res.json();
      } else {
        throw new Error(res.status);
      }
    });
  }
  resetBook({ id, ...book }) {
    const url = `${this.BASE_URL}${this.END_POINT}/${id}`;

    const options = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(book),
    };

    return fetch(url, options).then(res => {
      if (res.ok) {
        return res.json();
      } else {
        throw new Error(res.status);
      }
    });
  }
  deleteBook(id) {
    const url = `${this.BASE_URL}${this.END_POINT}/${id}`;

    const options = {
      method: 'DELETE',
    };

    return fetch(url, options).then(res => {
      if (res.ok) {
        return res.json();
      } else {
        throw new Error(res.status);
      }
    });
  }
}

const refs = {
  createFormEl: document.querySelector('.js-create-form'),
  resetFormEl: document.querySelector('.js-reset-form'),
  updateFormEl: document.querySelector('.js-update-form'),
  deleteFormEl: document.querySelector('.js-delete-form'),
  listEl: document.querySelector('.js-list'),
};

refs.createFormEl.addEventListener('submit', onBookCreate);
refs.resetFormEl.addEventListener('submit', onBookReset);
refs.updateFormEl.addEventListener('submit', onBookUpdate);
refs.deleteFormEl.addEventListener('submit', onBookDelete);
refs.listEl.addEventListener('click', onBookClick);

function onBookClick(e) {
  console.log(e.target);
  console.log(e.currentTarget);

  if (e.target === e.currentTarget) return;
  const id = e.target.closest('li').dataset.id;

  refs.resetFormEl.elements.id.value = id;
  refs.updateFormEl.elements.id.value = id;
  refs.deleteFormEl.elements.id.value = id;
}

const booksApi = new BooksApi();

function onBookCreate(e) {
  e.preventDefault();

  // const title = e.target.elements.title.value;
  // const author = e.target.elements.author.value;
  // const description = e.target.elements.description.value;

  // const book = {
  //   title,
  //   author,
  //   description,
  // };

  // OR

  const book = {};

  const formData = new FormData(e.target);
  formData.forEach((value, key) => {
    book[key] = value;
  });
  console.log(book);
  booksApi.createBook(book).then(newBook => {
    const markup = bookTemplate(newBook);
    refs.listEl.insertAdjacentHTML('afterbegin', markup);
  });
  e.target.reset();
}
function onBookReset(e) {
  e.preventDefault();
  const book = {};

  const formData = new FormData(e.target);
  formData.forEach((value, key) => {
    book[key] = value;
  });
  booksApi.resetBook(book).then(updatedBook => {
    const oldBook = document.querySelector(`[data-id=${book.id}]`);
    const markup = bookTemplate(updatedBook);
    oldBook.insertAdjacentHTML('afterend', markup);
    oldBook.remove();
  });
  e.target.reset();
}
function onBookUpdate(e) {
  const book = {};

  const formData = new FormData(e.target);
  formData.forEach((value, key) => {
    if (!value) return;
    book[key] = value;
  });
  booksApi.updateBook(book).then(updatedBook => {
    const oldBook = document.querySelector(`[data-id=${book.id}]`);
    const markup = bookTemplate(updatedBook);
    oldBook.insertAdjacentHTML('afterend', markup);
    oldBook.remove();
  });
  e.target.reset();
}
function onBookDelete(e) {
  e.preventDefault();

  const id = e.target.elements.id.value;

  booksApi.deleteBook(id).then(res => {
    const oldBook = document.querySelector(`[data-id=${id}]`);
    oldBook.remove();
  });
  e.target.reset();
}

function bookTemplate({ id, author, title, description }) {
  return `
       <li data-id="${id}">
        <p><span>ID:</span> ${id}</p>
        <p><span>Author:</span> ${author}</p>
        <p><span>Title:</span> ${title}</p>
        <p><span>Description:</span> ${description}</p>
      </li>
  `;
}

function booksTemplates(books) {
  return books.map(bookTemplate).reverse().join('');
}

function renderBooks(books) {
  const markup = booksTemplates(books);
  refs.listEl.innerHTML = markup;
}

booksApi.getBooks().then(renderBooks).catch(onError);

function onError(error) {
  switch (error.message) {
    case '404':
      console.log('404');
      break;
    case '401':
      console.log('401');
      break;
    default:
      console.log('Unknown error');
  }
}
