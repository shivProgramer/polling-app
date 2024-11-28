import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { SuccessMsg } from "../../Toaster";

export const userLogin = createAsyncThunk(
  "userLogin",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post("http://localhost:3000/api/user", data);
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
      const response = await axios.post(
        "http://localhost:3000/api/poll/submit",
        pollData
      );
      console.log("response: " + JSON.stringify(response));
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
      const response = await axios.get(
        "http://localhost:3000/api/poll/getAllPolls"
      );
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
        `http://localhost:3000/api/poll/getPollById/${pollId}`
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
        SuccessMsg({ msg: "Polls Fetched successfully" });
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
        SuccessMsg({ msg: "Poll Fetched successfully" });
        console.log("action.payload", action.payload);
        state.poll = action.payload.data;
      })
      .addCase(getPollById.rejected, (state, action) => {
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
