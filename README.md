# Queue Manager

## Getting Started

### Clone the repository:

```
  git clone https://github.com/ShohamKatzav/Queue-Manager.git
```

### Set up .env

* Under the `client` folder, create a `.env` file including:
```
  VITE_BASEURL=*server address comes here*/api/
  VITE_ITEMS_PER_PAGE=5 # Affects the number of businesses/appointments displayed on lists
```

* Under the `server` folder, create a `.env` file including:

```
  DB_URI=*Mongo connection string comes here, including your database name*
  TOKEN_SECRET=*Token secret comes here*
  SENDER_EMAIL=*Gmail address users will receive emails from*
  APP_PASS=*You can generate a new app password here: https://myaccount.google.com/apppasswords*
```

### Navigate to the project directory:

```
  cd Queue-Manager
```


### Install dependencies:

```
  npm install
```


### Initialize dependencies in subfolders:

```
  npm run init
```

### Start the application

```
  npm start
```
