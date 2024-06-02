import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ResponseHistoryState {
  responseHistory: string[][];
}

const initialState: ResponseHistoryState = {
  responseHistory: [],
};

const responseHistorySlice = createSlice({
  name: "responseHistory",
  initialState,
  reducers: {
    addUserResponseToHistory: (state, action: PayloadAction<string>) => {
      state.responseHistory.push(["User", action.payload]);
    },
    addBotResponseToHistory: (state, action: PayloadAction<string>) => {
      state.responseHistory.push(["Bot", action.payload]);
    },
    clearHistory: (state) => {
      state.responseHistory = [];
    },
  },
});

export const { addUserResponseToHistory, addBotResponseToHistory ,clearHistory } = responseHistorySlice.actions;
export default responseHistorySlice.reducer;