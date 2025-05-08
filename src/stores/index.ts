import { defineStore } from "pinia";
import axios from "axios";
import { ref, computed } from "vue";
import Cookies from "js-cookie";
const API_URL = process.env.VUE_APP_BASE_API_URL;

// Интерфейс для хранения

interface Game {
  player: Player;
  questions: Question[];
  stageType: string;
}

interface Player {
  answeredQuestions: AnsweredQuestions[];
  currentScore: number;
  gender: string;
  selectedMission: string;
  selectedCharacter: SelectedCharacter;
  selectedSkills: Skills[];
  selectedWorlds: Worlds[];
  currentStage: string;
  valuesCount: number;
}

interface Question {
  answers: Answers[];
  id: number;
  text: string;
  title: string;
}

interface Answers {
  answer: string;
  dialog: Dialog[];
  values: AnswersValues[];
  id: number;
}

interface AnswersValues {
  name: string;
  imageUrl: string;
}

interface Dialog {
  position: string;
  text: string;
}

interface AnsweredQuestions {
  answerId: number;
  questionId: number;
}

interface Worlds {
  id: number;
  name: string;
}

interface Missions {
  id: number;
  text: string;
}

interface Roles {
  id: number;
  name: string;
  description: string;
  images: RolesImages[];
}

interface RolesImages {
  gender: string;
  path: string;
}

interface Skills {
  id: number;
  name: string;
  icon: string;
}

interface SelectedCharacter {
  description: string;
  id: number;
  imagePath: string;
  name: string;
}
interface Result {
  worthCount: number;
  totalWorthCount: number;
  totalScore: number;
  studyAreas: StudyAreas[];
  mission: ResultMission;
}

interface StudyAreas {
  code: string;
  name: string;
  link: string;
}

interface ResultMission {
  title: string;
  description: string;
}

interface Contacts {
  id: number;
  name: string;
  imagePath: string;
  link: string;
}

interface Achievements {
  skills: AchievementsSkills[];
  values: AchievementsValues[];
}

interface AchievementsSkills {
  name: string;
  icon: string;
  isActive: boolean;
}

interface AchievementsValues {
  name: string;
  icon: string;
  isActive: boolean;
}

interface Committee {
  id: number;
  name: string;
  imagePath: string;
  link: string;
}

export const useGameStore = defineStore("gameStore", () => {
  const gameInfo = ref<Game>();
  const playerInfo = ref<Player>();
  const worlds = ref<Worlds[]>();
  const quizInfo = ref<Question[]>();
  const missionsInfo = ref<Missions[]>();
  const rolesInfo = ref<Roles[]>();
  const skillsInfo = ref<Skills[]>();
  const resultsInfo = ref<Result>();
  const contactsInfo = ref<Contacts[]>();
  const achievementsInfo = ref<Achievements>();
  const committeeInfo = ref<Committee>();
  const loader = ref(false);

  // Начало игры
  const startGame = async () => {
    try {
      loader.value = true;
      const response = await axios.get(`${API_URL}game`, {
        headers: {
          Authorization: Cookies.get("user_id"),
        },
      });
      gameInfo.value = response.data;
      playerInfo.value = response.data.player;
    } catch (error) {
      console.error(error);
    } finally {
      loader.value = false;
    }
  };

  // Получение вопросов
  const getQuiz = async () => {
    loader.value = true;
    try {
      const response = await axios.get(`${API_URL}quiz`, {
        headers: {
          Authorization: Cookies.get("user_id"),
        },
      });
      quizInfo.value = response.data.questions;
      playerInfo.value = response.data.player;
    } catch (error) {
      console.error(error);
    } finally {
      loader.value = false;
    }
  };

  // Ответ на вопрос
  const answerQuestion = async (questionId: number, answerId: number) => {
    try {
      const response = await axios.post(
        `${API_URL}quiz/answer`,
        {
          questionId: questionId,
          answerId: answerId,
        },
        {
          headers: {
            Authorization: Cookies.get("user_id"),
          },
        }
      );
      playerInfo.value = response.data.player;
    } catch (error) {
      console.error(error);
    }
  };

  // Получение всех миров
  const getWorlds = async () => {
    loader.value = true;
    try {
      const response = await axios.get(`${API_URL}worlds`, {
        headers: {
          Authorization: Cookies.get("user_id"),
        },
      });
      worlds.value = response.data.worlds;
      playerInfo.value = response.data.player;
    } catch (error) {
      console.error(error);
    } finally {
      loader.value = false;
    }
  };

  // Выбор миров
  const selectWorlds = async (worlds: number) => {
    try {
      loader.value = true;
      const response = await axios.post(
        `${API_URL}worlds/select`,
        {
          worldId: worlds,
        },
        {
          headers: {
            Authorization: Cookies.get("user_id"),
          },
        }
      );
      playerInfo.value = response.data.player;
    } catch (error) {
      console.error(error);
    } finally {
      loader.value = false;
    }
  };

  // Получение миссий
  const getMissions = async () => {
    loader.value = true;
    try {
      const response = await axios.get(`${API_URL}missions`, {
        headers: {
          Authorization: Cookies.get("user_id"),
        },
      });
      missionsInfo.value = response.data.missions;
      playerInfo.value = response.data.player;
    } catch (error) {
      console.error(error);
    } finally {
      loader.value = false;
    }
  };

  // Выбор миссии
  const selectMission = async (id: number) => {
    try {
      loader.value = true;
      const response = await axios.post(
        `${API_URL}missions/select`,
        {
          missionId: id,
        },
        {
          headers: {
            Authorization: Cookies.get("user_id"),
          },
        }
      );
      playerInfo.value = response.data.player;
    } catch (error) {
      console.error(error);
    } finally {
      loader.value = false;
    }
  };

  // Получение ролей
  const getRole = async () => {
    loader.value = true;
    try {
      const response = await axios.get(`${API_URL}characters`, {
        headers: {
          Authorization: Cookies.get("user_id"),
        },
      });
      rolesInfo.value = response.data.characters;
      playerInfo.value = response.data.player;
    } catch (error) {
      console.error(error);
    } finally {
      loader.value = false;
    }
  };

  // Выбор роли
  const selectRole = async (gender: string, id: number) => {
    try {
      loader.value = true;
      const response = await axios.post(
        `${API_URL}characters/select`,
        {
          gender: gender,
          characterId: id,
        },
        {
          headers: {
            Authorization: Cookies.get("user_id"),
          },
        }
      );
      playerInfo.value = response.data.player;
    } catch (error) {
      console.error(error);
    } finally {
      loader.value = false;
    }
  };

  // Получение навыков
  const getSkills = async () => {
    loader.value = true;
    try {
      const response = await axios.get(`${API_URL}skills`, {
        headers: {
          Authorization: Cookies.get("user_id"),
        },
      });
      skillsInfo.value = response.data.skills;
      playerInfo.value = response.data.player;
    } catch (error) {
      console.error(error);
    } finally {
      loader.value = false;
    }
  };

  // Выбор миров
  const selectSkills = async (skills: number[]) => {
    try {
      loader.value = true;
      const response = await axios.post(
        `${API_URL}skills/select`,
        {
          skillsId: skills,
        },
        {
          headers: {
            Authorization: Cookies.get("user_id"),
          },
        }
      );
      playerInfo.value = response.data.player;
    } catch (error) {
      console.error(error);
    } finally {
      loader.value = false;
    }
  };

  // Результаты
  const getResults = async () => {
    loader.value = true;
    try {
      const response = await axios.get(`${API_URL}results`, {
        headers: {
          Authorization: Cookies.get("user_id"),
        },
      });
      resultsInfo.value = response.data.results;
      playerInfo.value = response.data.player;
    } catch (error) {
      console.error(error);
    } finally {
      loader.value = false;
    }
  };

  // Полученные скиллы
  const getAchievements = async () => {
    loader.value = true;
    try {
      const response = await axios.get(`${API_URL}results/achievements`, {
        headers: {
          Authorization: Cookies.get("user_id"),
        },
      });
      achievementsInfo.value = response.data;
    } catch (error) {
      console.error(error);
    } finally {
      loader.value = false;
    }
  };

  // Контакты (институты)
  const getContacts = async () => {
    loader.value = true;
    try {
      const response = await axios.get(`${API_URL}contacts`, {
        headers: {
          Authorization: Cookies.get("user_id"),
        },
      });
      contactsInfo.value = response.data;
    } catch (error) {
      console.error(error);
    } finally {
      loader.value = false;
    }
  };

  // Приемная комиссия
  const getСommittee = async () => {
    loader.value = true;
    try {
      const response = await axios.get(`${API_URL}contacts/committee`, {
        headers: {
          Authorization: Cookies.get("user_id"),
        },
      });
      committeeInfo.value = response.data;
    } catch (error) {
      console.error(error);
    } finally {
      loader.value = false;
    }
  };

  const gameStage = computed(() => gameInfo.value?.stageType);
  const playerInfoArray = computed(() => playerInfo.value);
  const playerScore = computed(() => playerInfo.value?.valuesCount);
  const worldsList = computed<Worlds[]>(() => worlds.value ?? []);
  const quizList = computed<Question[]>(() => quizInfo.value ?? []);
  const missionsList = computed<Missions[]>(() => missionsInfo.value ?? []);
  const rolesList = computed<Roles[]>(() => rolesInfo.value ?? []);
  const skillsList = computed<Skills[]>(() => skillsInfo.value ?? []);
  const resultsList = computed(() => resultsInfo.value);
  const contactsList = computed<Contacts[]>(() => contactsInfo.value ?? []);
  const achievementsList = computed(() => achievementsInfo.value);
  const committeeList = computed(() => committeeInfo.value);

  return {
    startGame,
    getQuiz,
    answerQuestion,
    getWorlds,
    selectWorlds,
    getMissions,
    selectMission,
    getRole,
    selectRole,
    getSkills,
    selectSkills,
    getResults,
    getContacts,
    getAchievements,
    getСommittee,
    playerInfoArray,
    playerScore,
    worldsList,
    loader,
    gameStage,
    gameInfo,
    quizList,
    missionsList,
    rolesList,
    skillsList,
    resultsList,
    contactsList,
    achievementsList,
    committeeList,
  };
});
