const apiUrl = 'https://opentdb.com/api.php?amount=30&category=18';
let questions = [];
let currentQuestionIndex = 0;
let score = 0;

const questionElement = document.getElementById('question');
const answersElement = document.getElementById('answers');
const prevButton = document.getElementById('prev-btn');
const nextButton = document.getElementById('next-btn');
const submitButton = document.getElementById('submit-btn');
const resultElement = document.getElementById('result');

async function fetchQuestions() {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    questions = data.results;
    showQuestion(currentQuestionIndex);
  } catch (error) {
    console.error('Error fetching questions:', error);
  }
}

function showQuestion(index) {
  const question = questions[index];
  questionElement.textContent = question.question;

  answersElement.innerHTML = '';
  const answers = [...question.incorrect_answers, question.correct_answer];
  answers.sort(() => Math.random() - 0.5); // Shuffle answers

  answers.forEach((answer) => {
    const answerElement = document.createElement('div');
    answerElement.classList.add('answer');

    const radioInput = document.createElement('input');
    radioInput.type = 'radio';
    radioInput.name = 'answer';
    radioInput.value = answer;
    answerElement.appendChild(radioInput);

    const label = document.createElement('label');
    label.textContent = answer;
    answerElement.appendChild(label);

    answersElement.appendChild(answerElement);
  });

  updateNavigationButtons();
}

function updateNavigationButtons() {
  prevButton.disabled = currentQuestionIndex === 0;
  nextButton.disabled = currentQuestionIndex === questions.length - 1;
  submitButton.disabled = !isAnyAnswerSelected();
}

function isAnyAnswerSelected() {
  const selectedAnswer = document.querySelector('input[name="answer"]:checked');
  return !!selectedAnswer;
}

function checkAnswer() {
  const selectedAnswer = document.querySelector('input[name="answer"]:checked').value;
  const correctAnswer = questions[currentQuestionIndex].correct_answer;
  if (selectedAnswer === correctAnswer) {
    score++;
  }
}

function showResult() {
  resultElement.style.display = 'block';
  resultElement.textContent = `Your score: ${score} / ${questions.length}`;
}

fetchQuestions();

prevButton.addEventListener('click', () => {
  currentQuestionIndex--;
  showQuestion(currentQuestionIndex);
});

nextButton.addEventListener('click', () => {
  currentQuestionIndex++;
  showQuestion(currentQuestionIndex);
});

submitButton.addEventListener('click', () => {
  checkAnswer();
  showResult();
});
