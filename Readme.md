# Team Flin Flon
## Backend
- Make virtual environment in backend dir
```
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```
- Make .env file in backend dir
  - ask in discord for details
```
SECRET_KEY=
DEBUG=TRUE
ALLOWED_HOSTS=localhost,127.0.0.1

# Azure MySQL settings
DB_NAME=
DB_USER=
DB_PASSWORD=
DB_HOST=
DB_PORT=3306
```
- Run backend server
```
python manage.py runserver
```


## Frontend

- Redirect to project directory
```
cd ..
```
- Redirect to frontend directory
```
cd frontend
```

- Install dependencies
```
npm install
```

- Run Frontend Server
```
npm run dev
```


## Docker

- To make docker image
```
docker-compose build
```

- To run docker image
```
docker-compose up
```

To run app http://localhost:3000/