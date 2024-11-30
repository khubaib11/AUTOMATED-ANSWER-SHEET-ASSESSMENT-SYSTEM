import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    user: null
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        signInSuccess: (state, action) => {
            state.user = action.payload;
        }
    }
});

export const { signInSuccess } = userSlice.actions;

export default userSlice.reducer;