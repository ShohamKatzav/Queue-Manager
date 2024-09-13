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
  APP_PASS=*In order to generate a new app password, visit: https://myaccount.google.com/apppasswords*
  CLOUD_NAME=*Cloudinary cloud name*
  KEY=*Cloudinary key*
  SECRET=*Cloudinary secret*
```
You can generate a random token secret key in the terminal with the following command:
```
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

You can get the last 3 variables after signing up on the Cloudinary site.
https://cloudinary.com/users/login

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
