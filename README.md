# shopNow
![logo](Project_overview/shopNowlogo.jpg)

---

>## Technologies used:
 ### Frontend:
  * React js
  * The Frontend code of project has been taken from the following open source e commerce react project.
[react-app-Ecommerce](https://github.com/achintyachaudhary/reactjsEcommerce)
 ### Backend:
  * Django with Python 
  * Postgresql database
 ### Deployment:
  * Heroku
  
---

>## About Project:
ShopNow is an online e-commerce platform that enables user to browse different products under different categories and to buy them with available payment options after adding the desired items to the shopping cart.

>## Application url: 
 https://ecommerce-shopnow.herokuapp.com/

>## To run the project in local machine:
* Open up your command terminal
* Clone the project using  ```git clone https://github.com/nikitabansal711/ShopNow.git```
---

>### Set up your own virtual environment:
* sudo apt-get install python3-pip
* sudo pip3 install virtualenv
* virtualenv venv
* source venv/bin/activate
* pip install -r requirements.txt
---

>### Install Postgresql:
* sudo apt update
* sudo apt install postgresql postgresql-contrib
---

>### Specify the postgres user:
* specify your postgres superuser username and password in the .env file in DATABASE_URL environment variable

* else activate postgres using ```sudo -u postgres psql```

* create one using command: ```CREATE USER temp WITH PASSWORD 'password';```

* give the superuser access using: ```ALTER USER temp WITH SUPERUSER;```
---

>## Run the code:
>### Create Database
* cd inside DataProject
  
* run helper_create_db.py to create database using command: ```python helper_create_db.py```
  
>### Apply migrations:
* ```python manage.py migrate```
>### Run the management command to load csv data into database
* ```python manage.py dataLoader```

>### Run the server
* ```python manage.py runserver```
>### Run the npm server
* ```npm i```
* ```npm start```

>### Drop the database:
* Make sure you are in the root dir that is <strong>DataProject</strong>
* ```python helper_db_dropper.py```
  
---

