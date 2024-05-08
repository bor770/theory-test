const shuffle = (array) => {
  const length = array.length;

  if (!length) {
    return [];
  }

  const chosenIndex = Math.floor(Math.random() * length);

  return [array[chosenIndex], ...shuffle(array.toSpliced(chosenIndex, 1))];
};

const TestApp = {
  async created() {
    const test = await (await fetch(`data/test.json`)).json();

    const categories = [...new Set(test.map((question) => question.category))];
    this.categories = categories;

    categories.forEach((category) => {
      this.test[category] = shuffle(
        test
          .filter((question) => question.category === category)
          .map((quest) => ({
            ...quest,
            question: quest.question.slice(6),
          }))
      );
    });
  },
  data() {
    return {
      categories: [],
      correctAnswer: "",
      currentQuestion: {},
      questionIndex: 0,
      sameQuestion: false,
      selectedCategory: "",
      test: {},
      totalQuestionsInCategory: 0,
      totalWrongAnswers: 0,
      wrongAnswer: false,
    };
  },
  methods: {
    nextQuestion() {
      if (this.questionIndex < this.totalQuestionsInCategory) {
        this.questionIndex++;

        const question = this.test[this.selectedCategory].shift();

        this.correctAnswer =
          question.suggestedAnswers[question.correctAnswerIndex];

        this.currentQuestion = {
          ...question,
          suggestedAnswers: shuffle(question.suggestedAnswers),
        };
      }
    },
    onAnswerSelected(answer) {
      wrong = this.correctAnswer !== answer;

      this.wrongAnswer = wrong;

      if (wrong && !this.sameQuestion) {
        this.totalWrongAnswers++;
        this.sameQuestion = true;
      } else if (!wrong) {
        this.sameQuestion = false;
        this.nextQuestion();
      }
    },
    onCategorySelected(category) {
      this.selectedCategory = category;
      this.totalQuestionsInCategory = this.test[category].length;

      this.nextQuestion();
    },
  },
};

Vue.createApp(TestApp).mount(`#test-app`);
