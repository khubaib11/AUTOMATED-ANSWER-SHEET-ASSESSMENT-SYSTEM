import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    user: null,
    isAuthenticated: false,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        signInSuccess: (state, action) => {
            state.currentUser = action.payload;
            state.isAuthenticated = true;
        },
        signOutSuccess: (state) => {
            state.currentUser = null;
            state.isAuthenticated = false;
        },
    }
});

export const { signInSuccess,signOutSuccess } = userSlice.actions;

export default userSlice.reducer;