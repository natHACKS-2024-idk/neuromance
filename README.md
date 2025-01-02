# NeuRomance

# Structure

## Neuromance

- `src` directory containing the frontend code

  - `components` directory containing React components

- `public` directory containing public static files

- `package.json` contains required dependencies/packages to run the frontend React project

## Backend

- `server` base directory for the projects backend

- `neuromanceDB` django app directory containing the files for the backend

  - `migrations` directory containing database changes

- `manage.py` script to run backend commands

- `requirements.txt` contains required packages to run the django project

# Setup

The frontend and backend are separated within our monorepo structure so the frontend and backend need to be setup and ran separately. Open two terminals and `cd` into the `neuromance` directory in one terminal and `backend` directory in the other.

It is a good idea to create a virtual environment within the base directory of the project.

1. Run `python -m venv .venv`

   - you may name the virtual environment whatever you like but make sure to add the name of your environment directory to the base directories `.gitignore`. Virtual environments **should not** be committed to the repository and should only be used for local development

2. Activate the virtual environment using `source .venv/bin/activate`

you will also need `npm (node package manager)`. Install Node.js at the following link

> https://nodejs.org/en/download/

## Neuromance

1. Make sure you `cd` into the `neuromance` directory

2. Run `npm i` to install the dependencies

   > when installing new dependencies using `npm` the dependencies are added to the `package.json` file

3. Run `npm start` to start a local development server
   > by default the frontend React project runs at `http://localhost:3000`

## Backend

1. Make sure you `cd` into the `backend` directory

2. Run `pip install -r requirements.txt` to install the required packages

3. Run `python manage.py migrate` to apply the database migrations

4. Run `python manage.py createsuperuser` to create an admin account for the database

5. Run `python manage.py runserver` to start the local backend development server

   > by default the Django project runs at `http://localhost:8000`

   > to access the Django admin panel go to `http://localhost:8000/admin`
