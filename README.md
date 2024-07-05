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
```

* Under the `server` folder, create a `.env` file including:

```
  DB_URI=*Mongo connection string comes here including your db name*
  TOKEN_SECRET=*Token's secret comes here*
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
