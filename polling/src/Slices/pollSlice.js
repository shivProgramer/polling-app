import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { ErrorMsg, SuccessMsg } from "../../Toaster";
import { API_URI } from "../../environment";

export const userLogin = createAsyncThunk(
  "userLogin",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URI}/api/user`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deletePoll = createAsyncThunk(
  "deletePoll",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${API_URI}/api/poll/deletePoll/${data}`
      );
      if (response.status === 1) {
        navigate("/");
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const alreadyVote = createAsyncThunk(
  "alreadyVote",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URI}/api/vote/votes/user`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getAllUsers = createAsyncThunk(
  "users/getAllUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URI}/api/user/getAllUsers`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createVote = createAsyncThunk(
  "createVote",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URI}/api/vote/votes`, data);
      if (response.success === true) {
        SuccessMsg({ msg: "Vote submitted successfully." });
      } else if (response.success === false) {
        ErrorMsg({ msg: response.message });
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const manageCredits = createAsyncThunk(
  "manageCredits",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URI}/api/user/modifyCredits`,
        data
      );
      if (response.success === true) {
        SuccessMsg({ msg: "Credit updated successfully." });
      } else if (response.success === false) {
        ErrorMsg({ msg: response.message });
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const submitPoll = createAsyncThunk(
  "poll/submitPoll",
  async (pollData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URI}/api/poll/submit`, pollData);
      console.log("response: " + JSON.stringify(response));
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

//localhost:3000/api/poll/getLeaderboardByPoll/674987d8a221f26a02ba9970

export const getLeaderboardbyPoll = createAsyncThunk(
  "getLeaderboardbyPoll",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URI}/api/poll/getLeaderboardByPoll/${data}`
      );
      console.log("response.data", response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getLeaderboard = createAsyncThunk(
  "getLeaderboard",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URI}/api/user/getLeaderboard`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getAllPolls = createAsyncThunk(
  "poll/get",
  async (pollData, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URI}/api/poll/getAllPolls`);
      console.log("response: " + response);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getPollById = createAsyncThunk(
  "poll/getPollById",
  async (pollId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URI}/api/poll/getPollById/${pollId}`
      );
      console.log("response by id:", response);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

const initialState = {
  questions: {},
  pollTitle: "",
  pollDescription: "",
  type: "questions",
  status: "idle",
  error: null,
  allPolls: [],
  poll: {},
  userData: {},
  voteData: [],
  allUsers: [],
  leaderByPollData: [],
};

const pollSlice = createSlice({
  name: "poll",
  initialState,
  reducers: {
    setPollTitle: (state, action) => {
      state.pollTitle = action.payload;
    },
    setPollDescription: (state, action) => {
      state.pollDescription = action.payload;
    },
    addQuestion: (state, action) => {
      const { id, question, options } = action.payload;
      state.questions[id] = { question, options };
    },
    removeQuestion: (state, action) => {
      const { id } = action.payload;
      delete state.questions[id];
    },
    updateQuestion: (state, action) => {
      const { id, question, options } = action.payload;
      if (state.questions[id]) {
        state.questions[id] = { question, options };
      }
    },
    resetPollData: (state) => {
      state.questions = {};
      state.pollTitle = "";
      state.pollDescription = "";
      state.type = "questions";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitPoll.pending, (state) => {
        state.status = "loading";
      })
      .addCase(submitPoll.fulfilled, (state, action) => {
        state.status = "succeeded";
      })
      .addCase(submitPoll.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(getAllPolls.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getAllPolls.fulfilled, (state, action) => {
        state.status = "succeeded";
        // SuccessMsg({ msg: "Polls Fetched successfully" });
        console.log("action.payload", action.payload);
        state.allPolls = action.payload.data;
      })
      .addCase(getAllPolls.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(getPollById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getPollById.fulfilled, (state, action) => {
        state.status = "succeeded";
        // SuccessMsg({ msg: "Poll Fetched successfully" });
        console.log("action.payload", action.payload);
        state.poll = action.payload.data;
      })
      .addCase(getPollById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      .addCase(userLogin.pending, (state) => {
        state.status = "loading";
      })
      .addCase(userLogin.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.userData = action.payload.data;
      })
      .addCase(userLogin.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(alreadyVote.pending, (state) => {
        state.status = "loading";
      })
      .addCase(alreadyVote.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.voteData = action.payload.data;
      })
      .addCase(alreadyVote.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(getAllUsers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.allUsers = action.payload.user;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(getLeaderboardbyPoll.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getLeaderboardbyPoll.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.leaderByPollData = action.payload.data.leaderboardData;
      })
      .addCase(getLeaderboardbyPoll.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

// Export actions
export const {
  setPollTitle,
  setPollDescription,
  addQuestion,
  removeQuestion,
  updateQuestion,
  resetPollData,
} = pollSlice.actions;

// Export the reducer
export default pollSlice.reducer;
