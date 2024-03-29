import axios from "axios";
import firebaseAuth from "src/firebase/firebase.config";

interface API_CALLS {
  [key: string]: {
    URL: string;
    method: string;
  };
}

const API_CALLS = {
  compile_code: {
    URL: "code/run",
    method: "POST",
  },

  compare_code: {
    URL: "code/question-run",
    method: "post",
  },

  submit_code: {
    URL: "code/question-submit",
    method: "post",
  },

  update_battle_submission: {
    URL: "/battle/update-submission",
    method: "post",
  },

  update_code_submission: {
    URL: "/code/update-submission",
    method: "post",
  },

  p_id: {
    URL: "results/p_id",
    method: "GET",
  },

  code_status: {
    URL: "code/status",
    method: "get",
  },

  upload_question: {
    URL: "question/create-question",
    method: "post",
  },

  all_questions: {
    URL: "question/all-questions",
    method: "get",
  },

  fetch_question: {
    URL: "question/get-question-by-id",
    method: "get",
  },

  create_user: {
    URL: "user/create-user",
    method: "post"
  },

  update_user: {
    URL: "user/update-user",
    method: "post"
  },

  get_battle_id: {
    URL: "user/get-battle-id",
    method: "get"
  },

  get_user_details_by_id: {
    URL: "user/get-details-by-id",
    method: "get"
  },

  create_battle: {
    URL: "battle/create-battle",
    method: "post"
  },

  join_battle: {
    URL: "battle/join-battle",
    method: "post"
  },

  leave_battle: {
    URL: "battle/remove-from-battle",
    method: "post"
  },

  get_battle_details_by_id: {
    URL: "/battle/get-details-by-id",
    method: "get"
  },

  get_public_battles: {
    URL: "/battle/get-public-battles",
    method: "get"
  },

  get_user_battle_submissions: {
    URL: "/battle/get-user-submissions",
    method: "get"
  },

  start_battle: {
    URL: "/battle/start-battle",
    method: "post"
  }
};

type objKey = keyof typeof API_CALLS;

export const apiCall = async ({
  key,
  data,
  params,
  customURL,
}: {
  key: string;
  data?: {};
  params?: {};
  customURL?: string;
}) => {
  const { URL, method } = API_CALLS[key as objKey];
  const baseURL = "https://codeg-backend.onrender.com";
  // const baseURL = "http://localhost:7000";
  const idToken = await firebaseAuth.currentUser?.getIdToken()

  return new Promise((resolve, reject) => {
    axios({
      baseURL: baseURL,
      url: customURL ?? URL,
      method: method,
      data: data,
      params: params,
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    })
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
};
