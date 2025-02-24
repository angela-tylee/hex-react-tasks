import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const messageSlice = createSlice({
  name: "message",
  initialState: [
  ],
  reducers: {
    createMessage(state, action) {
      if (action.payload.success) {
        state.push({
          id: action.payload.id,
          type: 'success',
          text: action.payload.message,
        })
      } else {
        state.push({
          id: action.payload.id,
          type: 'danger',
          text: Array.isArray(action.payload?.message) ? action.payload?.message.join('、') : action.payload?.message,
        })
      }
    },
    removeMessage(state, action) {
      const index = state.findIndex((item) => item === action.payload)
      state.splice(index, 1);
    }
  }
})

export const createAsyncMessage = createAsyncThunk(
  'message/createAsyncMessage',
  async function (payload, { dispatch, requestId }) {
    dispatch(
      messageSlice.actions.createMessage({
        ...payload,
        id: requestId,
      })
    );

    setTimeout(() => {
      dispatch(messageSlice.actions.removeMessage(requestId))
    }, 2000)
  })

export default messageSlice.reducer;
export const { createMessage } = messageSlice.actions;