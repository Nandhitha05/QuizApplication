package com.javaproject.quizapp.service;

import com.javaproject.quizapp.Model.Question;
import com.javaproject.quizapp.Model.QuestionWrapper;
import com.javaproject.quizapp.Model.Quiz;
import com.javaproject.quizapp.Model.Response;
import com.javaproject.quizapp.dao.QuestionDao;
import com.javaproject.quizapp.dao.QuizDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class QuizService {

    @Autowired
    private QuizDao quizDao;

    @Autowired
    private QuestionDao questionDao;

    public ResponseEntity<Integer> createQuiz(String category, int qCount, String title) {
        try {
            List<Question> questions = questionDao.findRandomQuestionsByCategory(category, qCount);

            if (questions == null || questions.size() < qCount) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }

            Quiz quiz = new Quiz();
            quiz.setTitle(title);
            quiz.setQuestions(questions);

            Quiz savedQuiz = quizDao.save(quiz);

            return new ResponseEntity<>(savedQuiz.getId(), HttpStatus.CREATED);

        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    public ResponseEntity<List<QuestionWrapper>> getQuizQuestions(Integer id) {
        try {
            Optional<Quiz> quizOptional = quizDao.findById(id);
            if (!quizOptional.isPresent()) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            Quiz quiz = quizOptional.get();
            List<Question> questionsFromDB = quiz.getQuestions();

            if (questionsFromDB == null || questionsFromDB.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }

            List<QuestionWrapper> questionsForUser = new ArrayList<>();
            for (Question q : questionsFromDB) {
                QuestionWrapper qw = new QuestionWrapper(
                        q.getId(),
                        q.getQuestionTitle(),
                        q.getOption1(),
                        q.getOption2(),
                        q.getOption3(),
                        q.getOption4()
                );
                questionsForUser.add(qw);
            }

            return new ResponseEntity<>(questionsForUser, HttpStatus.OK);

        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public ResponseEntity<Integer> calculateResult(Integer id, List<Response> responses) {
        Optional<Quiz> quizOptional = quizDao.findById(id);
        if (!quizOptional.isPresent()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        Quiz quiz = quizOptional.get();
        List<Question> questions = quiz.getQuestions();
        Map<Integer, String> correctAnswers = new HashMap<>();
        for (Question q : questions) {
            correctAnswers.put(q.getId(), q.getRightAnswer());
        }

        int correct = 0;
        Set<Integer> answeredIds = new HashSet<>();

        for (Response response : responses) {
            Integer questionId = response.getId();
            String userAnswer = response.getResponse();

            if (questionId != null && userAnswer != null && !answeredIds.contains(questionId)) {
                String correctAnswer = correctAnswers.get(questionId);
                if (correctAnswer != null && userAnswer.trim().equalsIgnoreCase(correctAnswer.trim())) {
                    correct++;
                }
                answeredIds.add(questionId);
            }
        }

        return new ResponseEntity<>(correct, HttpStatus.OK);
    }

}
