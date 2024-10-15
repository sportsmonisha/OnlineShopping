import { createSlice } from "@reduxjs/toolkit";


const authSlice = createSlice({
    name:'auth',
    initialState:{
        loading:true,
        error:null,
        isAuthenticated:false,
        user:null
    },
    reducers:{
        loginRequest(state,action){
            return{
                ...state,
                loading:true,
            }
        },
        loginSuccess(state,action){
            return{
                loading:false,
                isAuthenticated:true,
                user:action.payload.user
            }
        },
        loginFail(state,action){
            return{
                ...state,
                loading:false,
                error:action.payload
                
            }
        },
        clearError(state,action){
            return{
                ...state,
                error:null
                
            }
        },
        registerRequest(state,action){
            return{
                ...state,
                loading:true,
            }
        },
        registerSuccess(state,action){
            return{
                loading:false,
                isAuthenticated:true,
                user:action.payload.user
            }
        },
        registerFail(state,action){
            return{
                ...state,
                loading:false,
                error:action.payload
                
            }
        },
        loadUserRequest(state,action){
            return{
                ...state,
                isAuthenticated:false,
                loading:true,
            }
        },
        loadUserSuccess(state,action){
            return{
                loading:false,
                isAuthenticated:true,
                user:action.payload.user
            }
        },
        loadUserFail(state,action){
            return{
                ...state,
                loading:false,
                // error:action.payload
                
            }
        },
        logoutSuccess(state,action){
            return{
                loading:false,
                isAuthenticated:false,
            }
        },
        logoutFail(state,action){
            return{
                ...state,
                error:action.payload
                
            }
        },
        // update Prfile
        updateProfileRequest(state,action){
            return{
                ...state,
                loading:true,
                isUpdated:false
            }
        },
        updateProfileSuccess(state,action){
            return{
                ...state,
                loading:false,
                user:action.payload.user,
                isUpdated:true
            }
        },
        updateProfileFail(state,action){
            return{
                ...state,
                loading:false,
                error:action.payload
                
            }
        },
         clearUpdateProfile(state,action){
            return{
                ...state,
                isUpdated:false
                
            }
        },
        // updata Password
        
        updatePasswordRequest(state, action){
            return {
                ...state,
                loading: true,
                isUpdated: false,
                error:null,
            }
        },
        updatePasswordSuccess(state, action){
            return {
                ...state,
                loading: false,
                isUpdated: true,
                error:null,
            }
        },
        updatePasswordFail(state, action) {
            return {
                ...state,
                loading: false,
                isUpdated: false,
                error: action.payload // Check that this payload is a string
            }
        },
        
        // forgotPassword
        forgotPasswordRequest(state,action){
            return{
                ...state,
                loading:true,
                message:null
           }
        },
        forgotPasswordSuccess(state,action){
            return{
                ...state,
                loading:false,
                message:action.payload.message
            }
        },
        forgotPasswordFail(state,action){
            return{
                ...state,
                loading:false,
                error:action.payload
            }
            
        },

        // resetPassword  
        resetPasswordRequest(state,action){
            return{
                ...state,
                loading:true,
           }
        },
        resetPasswordSuccess(state,action){
            return{
                ...state,
                loading:false,
                isAuthenticated:true,
                user:action.payload.user
            }
        },
        resetPasswordFail(state,action){
            return{
                ...state,
                loading:false,
                error:action.payload
            }
            
        },
       
    }
});


const {actions,reducer } = authSlice;

export const{
    loginRequest,
    loginSuccess,
    loginFail,
    clearError,
    registerRequest,
    registerSuccess,
    registerFail,loadUserRequest,
    loadUserSuccess,loadUserFail,
    logoutSuccess,logoutFail,
    updateProfileRequest,updateProfileSuccess,
    updateProfileFail,clearUpdateProfile,updatePasswordRequest,
updatePasswordSuccess,updatePasswordFail,
forgotPasswordRequest,forgotPasswordSuccess,
forgotPasswordFail,resetPasswordRequest,
resetPasswordSuccess,resetPasswordFail} = actions;

export default reducer