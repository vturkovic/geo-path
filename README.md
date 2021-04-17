## Description

This application provides a visual tool for creating delivery routes. It is intended for delivery company managers who create and manage the routes of their drivers. The app also allows you to place orders. Geolocation data was collected and executed using the Google API service.

## Demo
Video explanation can be found at the following link: https://www.youtube.com/watch?v=Rr6owOjFndk
The application can be accessed online at the following link: https://vturkovic-geo-path.herokuapp.com/

## How to setup 

1. Create a Google API key and an OpenweatherMap API key.
2. Replace Google API keys at the end of each html document and OpenweatherMap API keys in "public/scripts/exports/functions.js". The keys provided in this app are visible and viable on the client side but are restricted to a specific domain, so they will not work unless changed.
3. Create Sendgrid API key.
4. Start terminal, navigate to root directory, run command "npm install" to install all dependencies.
5. Create "config" folder in root directory and in that folder create "dev.env" file.
6. In "dev.env" file set correct values for "PORT", "MONGODB_URL", "JWT_SECRET" and "SENDGRID_API_KEY". e.g.(PORT=3000, MONGODB_URL=mongodb://localhost:27017/geo-path-app, JWT_SECRET=random_string, SENDGRID_API_KEY=sendgrid_api_key).
7. Run command "npm run dev" to start working in development mode.

## License & copyright

© Vladimir Turković, Faculty of organization and informatics Varaždin

Licensed under the [GNU GPLv3](LICENSE).
