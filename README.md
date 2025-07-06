# Quiz Application

This project is a Quiz Application developed using **Java Spring Boot** for the backend and a simple **HTML, CSS, and JavaScript** frontend.

## Project Initialization

- The project was initially generated using [Spring Initializr](https://start.spring.io/).
- It follows the **MVC architecture** pattern.
- Dependencies were managed using **Maven**.

## Technologies Used

- **Backend:** Java Spring Boot, Maven, Tomcat server
- **Frontend:** Plain HTML, CSS, and JavaScript (no frontend frameworks)
- **Database:** MySQL
- **API Testing:** Postman

## Features

- Create quizzes dynamically by selecting category and number of questions.
- Fetch quiz questions from the backend.
- Submit answers and get scored.
- Simple and responsive frontend interface.

## Project Structure

- `src/main/java/com.javaproject.quizapp` - Java backend code organized into controller, service, dao, and model packages.
- `src/main/resources/static` - Frontend static resources (HTML, CSS, JS).
- `application.properties` - Backend configuration including database connection.

## How to Run

1. Configure your MySQL database and update connection details in `application.properties`.
2. Run the Spring Boot application using your IDE or command line (`mvn spring-boot:run`).
3. Access the frontend at `http://localhost:8080/` in your browser.
4. Use Postman or frontend UI to create quizzes and interact with the API.

DATABASE:
-> CREATE DATABASE quizdb;
->USE quizdb;
->CREATE TABLE question (
    id INT AUTO_INCREMENT PRIMARY KEY,
    question_title VARCHAR(255) NOT NULL,
    option1 VARCHAR(255) NOT NULL,
    option2 VARCHAR(255) NOT NULL,
    option3 VARCHAR(255) NOT NULL,
    option4 VARCHAR(255) NOT NULL,
    right_answer VARCHAR(255) NOT NULL,
    difficulty_level VARCHAR(50),
    category VARCHAR(50)
);
SAMPLE VALUES FOR INSERTION
->INSERT INTO question (question_title, option1, option2, option3, option4, right_answer, difficulty_level, category)
VALUES
('What is Java?', 'Programming Language', 'Coffee', 'OS', 'Database', 'Programming Language', 'Easy', 'java'),
('Which company developed Java?', 'Microsoft', 'Sun Microsystems', 'Apple', 'Google', 'Sun Microsystems', 'Easy', 'java');

