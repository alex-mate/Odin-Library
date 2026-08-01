// Modal and form
const modal = document.getElementById("bookFormModal");
const bookForm = document.getElementById("bookForm");

const titleInput = document.getElementById("titleInput");
const authorInput = document.getElementById("authorInput");
const pagesInput = document.getElementById("pagesInput");
const statusInput = document.getElementById("statusInput");

// Statistics
const totalBooks = document.getElementById("totalBooks");
const readBooks = document.getElementById("readBooks");
const unreadBooks = document.getElementById("unreadBooks");
const readingBooks = document.getElementById("readingBooks");

// Search
const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");

// Filter buttons
const filterAllButton = document.getElementById("filterAll");
const filterReadButton = document.getElementById("filterRead");
const filterUnreadButton = document.getElementById("filterUnread");
const filterReadingButton = document.getElementById("filterReading");

// Library display
const emptyState = document.getElementById("emptyState");
const bookGrid = document.getElementById("bookGrid");

const addBookButtons = document.querySelectorAll(".add-book-button");
const closeButton = document.querySelector(".close-form");
const cancelButton = document.querySelector(".cancel-button");
const filterButtons = document.querySelectorAll(".filter-button");

let myLibrary = [];



class Book {
  constructor(title, author, pages, status) {
    this.id = crypto.randomUUID();
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.status = status;
  }
  changeStatus(newStatus) {
    this.status = newStatus;
  } 
}
function addBookToLibrary(title, author, pages, status) {
  const newBook = new Book(title, author, pages, status);
  myLibrary.push(newBook);
  saveLibrary();
  emptyStateCheck();
  displayLibrary(myLibrary);
  updateStatistics();
  [totalBooks, readBooks, unreadBooks, readingBooks].forEach(animateStat);
}


function emptyStateCheck() {
  if (myLibrary.length === 0) {
    emptyState.style.display = "block";
    bookGrid.style.display = "none";
  }
  if (myLibrary.length > 0) {
    emptyState.style.display = "none";
    bookGrid.style.display = "grid";
  }
}

function displayLibrary(books) {
  bookGrid.innerHTML = "";
  books.forEach((book) => {
    const bookCard = document.createElement("div");
    bookCard.classList.add("book-card");
    bookCard.setAttribute("data-id", book.id);

    const titleElement = document.createElement("h3");
    titleElement.textContent = book.title;

    const authorElement = document.createElement("p");
    authorElement.textContent = `Author: ${book.author}`;

    const pagesElement = document.createElement("p");
    pagesElement.textContent = `Pages: ${book.pages}`;

    const statusElement = document.createElement("p");
    statusElement.textContent = `Status: ${book.status}`;

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.classList.add("delete-button");
    deleteButton.addEventListener("click", () => {
      deleteBook(book.id);
    });

    const changeStatusButton = document.createElement("button");
    changeStatusButton.textContent = "Change Status";
    changeStatusButton.classList.add("change-status-button");
    changeStatusButton.addEventListener("click", () => {
      const newStatus = prompt(
        "Enter new status (Read, Unread, Reading):",
        book.status
      );
      if (
        newStatus === "Read" ||
        newStatus === "Unread" ||
        newStatus === "Reading"
      ) {
        book.changeStatus(newStatus);
        saveLibrary();
        displayLibrary(myLibrary);
        updateStatistics();
      } else {
        alert("Invalid status. Please enter Read, Unread, or Reading.");
      }
    });

    bookCard.appendChild(titleElement);
    bookCard.appendChild(authorElement);
    bookCard.appendChild(pagesElement);
    bookCard.appendChild(statusElement);
    bookCard.appendChild(deleteButton);
    bookCard.appendChild(changeStatusButton);

    bookGrid.appendChild(bookCard);
  });
}

function deleteBook(bookId) {
  myLibrary = myLibrary.filter((book) => book.id !== bookId);
  saveLibrary();
  emptyStateCheck();
  displayLibrary(myLibrary);
  updateStatistics();
}

function filterBooks(status) {
  if (status === "All") {
    displayLibrary(myLibrary);
    return;
  } 
    const filteredBooks = myLibrary.filter((book) => book.status === status);
    displayLibrary(filteredBooks);
  
}

function updateStatistics() {
  const total = myLibrary.length;
  const read = myLibrary.filter((book) => book.status === "Read").length;
  const unread = myLibrary.filter((book) => book.status === "Unread").length;
  const reading = myLibrary.filter((book) => book.status === "Reading").length;

  totalBooks.textContent = total;
  readBooks.textContent = read;
  unreadBooks.textContent = unread;
  readingBooks.textContent = reading;
}

function searchBooks(query) {
  const lowerCaseQuery = query.toLowerCase();
  const filteredBooks = myLibrary.filter(
    (book) =>
      book.title.toLowerCase().includes(lowerCaseQuery) ||
      book.author.toLowerCase().includes(lowerCaseQuery),
  );
  displayLibrary(filteredBooks);
}

function animateStat(element) {
  element.classList.add("pulse");
  element.addEventListener(
    "animationend",
    () => element.classList.remove("pulse"),
    { once: true },
  );
}

function saveLibrary() {
  localStorage.setItem("odinLibrary", JSON.stringify(myLibrary));
}

function loadLibrary() {
  const savedLibrary = localStorage.getItem("odinLibrary");

  if (savedLibrary) {
   const parsedLibrary = JSON.parse(savedLibrary);
   myLibrary = parsedLibrary.map((book) => {
     const restoredBook = new Book(book.title, book.author, book.pages, book.status);
     restoredBook.id = book.id; // Preserve the original ID
     return restoredBook;

   });
  }
  emptyStateCheck();
  displayLibrary(myLibrary);
  updateStatistics();
}

function openModal() {
  modal.classList.remove("hidden");
  titleInput.focus();
}

function closeModal() {
  modal.classList.add("hidden");
  bookForm.reset();
}

addBookButtons.forEach((button) => {
  button.addEventListener("click", openModal);
});

closeButton.addEventListener("click", closeModal);
cancelButton.addEventListener("click", closeModal);

modal.addEventListener("click", (event) => {
  if (event.target === modal) {
    closeModal();
  }
});

bookForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const title = titleInput.value.trim();
  const author = authorInput.value.trim();
  const pages = Number.parseInt(pagesInput.value, 10);
  const status = statusInput.value;

  if (!title || !author || !Number.isInteger(pages) || pages <= 0) {
    return;
  }

  addBookToLibrary(title, author, pages, status);
  closeModal();
});
filterAllButton.addEventListener("click", () => filterBooks("All"));
filterReadButton.addEventListener("click", () => filterBooks("Read"));
filterUnreadButton.addEventListener("click", () => filterBooks("Unread"));
filterReadingButton.addEventListener("click", () => filterBooks("Reading"));

searchButton.addEventListener("click", () => searchBooks(searchInput.value));

loadLibrary();
