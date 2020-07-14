INSERT INTO books
  (author, title, isbn, image_url, description, bookshelf)
VALUES
  ('Author', 'title', 'isbn', 'https:
//i.imgur.com/J5LVHEL.jpg', 'description', 'bookshelf: adventure')
RETURNING *;