# Image to ASCII Art Fullstack Website

<a href="https://ascii-art-converter-eight.vercel.app/" target="_blank">Demo</a>

### Description
This is a fullstack website built using Next.js for the frontend and REST api, Tailwind CSS for styling, and Prisma ORM and PlanetScale for db. Authentication and authorization is implemented using a custom access/refresh token flow with JWTs.

Users can upload images up to 1mb and convert them into ASCII art. They then have the option to create an account to upload the art to the gallery for other users to view.

### Motivation
 - Learn about authentication, authorization, and relational databases.
 - Wanted more experience writing backend code.

### Todo
 - Look into why the initial page load for the gallery is slow.
 - Clean up parts of the backend. Some token verification code is unnecessarily repeated. Could possibly be abstracted away into a separate Auth class.


