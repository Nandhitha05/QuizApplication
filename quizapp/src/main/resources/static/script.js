const categorySelect = document.getElementById('category-select');
const qCountInput = document.getElementById('qcount-input');
const titleInput = document.getElementById('title-input');
const createQuizBtn = document.getElementById('create-quiz-btn');

const quizSetup = document.getElementById('quiz-setup');
const questionContainer = document.getElementById('question-container');
const questionElement = document.getElementById('question');
const answerButtonsElement = document.getElementById('answer-buttons');

const nextButton = document.getElementById('next-btn');
const resultContainer = document.getElementById('result-container');
const scoreElement = document.getElementById('score');
const restartButton = document.getElementById('restart-btn');

let questions = [];
let currentQuestionIndex = 0;
let userResponses = [];
let quizId = null;

createQuizBtn.addEventListener('click', () => {
  const category = categorySelect.value;
  const qCount = parseInt(qCountInput.value);
  const title = titleInput.value.trim() || 'Untitled Quiz';

  if (!category || !qCount || qCount < 1) {
    alert('Please select a category and enter a valid number of questions.');
    return;
  }

  createQuiz(category, qCount, title);
});

nextButton.addEventListener('click', () => {
  if (!userResponses[currentQuestionIndex]) {
    alert('Please select an answer before proceeding.');
    return;
  }

  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    showQuestion();
  } else {
    submitAnswers();
  }
});

restartButton.addEventListener('click', () => {
  resetQuiz();
});

function createQuiz(category, qCount, title) {
  fetch(`/quiz/create?category=${encodeURIComponent(category)}&qCount=${qCount}&title=${encodeURIComponent(title)}`, {
    method: 'POST',
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to create quiz. Make sure enough questions exist.');
      }
      return response.json();
    })
    .then(id => {
      quizId = id;
      fetchQuestions(quizId);
      quizSetup.classList.add('hide');
      questionContainer.classList.remove('hide');
      nextButton.classList.remove('hide');
      nextButton.disabled = true;
      resultContainer.classList.add('hide');
    })
    .catch(error => {
      alert(`Error: ${error.message}`);
    });
}

function fetchQuestions(id) {
  fetch(`/quiz/get/${id}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch quiz questions.');
      }
      return response.json();
    })
    .then(data => {
      questions = data;
      currentQuestionIndex = 0;
      userResponses = [];
      showQuestion();
    })
    .catch(error => {
      alert(`Error: ${error.message}`);
    });
}

function showQuestion() {
  resetState();
  const currentQuestion = questions[currentQuestionIndex];
  questionElement.innerText = currentQuestion.questionTitle;

  const options = [
    currentQuestion.option1,
    currentQuestion.option2,
    currentQuestion.option3,
    currentQuestion.option4,
  ];

  options.forEach(option => {
    if (option) {
      const button = document.createElement('button');
      button.innerText = option;
      button.classList.add('btn');
      button.addEventListener('click', () => selectAnswer(button));
      answerButtonsElement.appendChild(button);
    }
  });

  nextButton.disabled = true;
}

function resetState() {
  while (answerButtonsElement.firstChild) {
    answerButtonsElement.removeChild(answerButtonsElement.firstChild);
  }
}

function selectAnswer(selectedButton) {
  Array.from(answerButtonsElement.children).forEach(button => {
    button.style.backgroundColor = '';
    button.style.color = '';
  });
  selectedButton.style.backgroundColor = '#007bff';
  selectedButton.style.color = 'white';

  userResponses[currentQuestionIndex] = selectedButton.innerText;

  nextButton.disabled = false;
}

function submitAnswers() {
  const payload = questions.map((q, index) => ({
    id: q.id,
    response: userResponses[index] || '',
  }));

  fetch(`/quiz/submit/${quizId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to submit answers');
      }
      return response.json();
    })
    .then(score => {
      questionContainer.classList.add('hide');
      nextButton.classList.add('hide');
      resultContainer.classList.remove('hide');
      scoreElement.innerText = `${score} / ${questions.length}`;
    })
    .catch(error => {
      alert(`Error submitting answers: ${error.message}`);
    });
}

function resetQuiz() {
  quizSetup.classList.remove('hide');
  questionContainer.classList.add('hide');
  nextButton.classList.add('hide');
  resultContainer.classList.add('hide');
  categorySelect.value = 'java';
  qCountInput.value = 5;
  titleInput.value = '';
  questions = [];
  userResponses = [];
  currentQuestionIndex = 0;
  quizId = null;
  nextButton.disabled = true;
}
