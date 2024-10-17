import axios from 'axios';
import {clearError, loginFail, loginRequest, loginSuccess,
     registerFail, registerRequest, registerSuccess,
    loadUserRequest,loadUserSuccess,loadUserFail,
    logoutSuccess,logoutFail,
    updateProfileRequest,
    updateProfileSuccess,
    updateProfileFail,
    updatePasswordSuccess,
    updatePasswordRequest,
    updatePasswordFail,
    forgotPasswordRequest,
    forgotPasswordSuccess,
    forgotPasswordFail,
    resetPasswordSuccess,
    resetPasswordFail,
    resetPasswordRequest} from '../slices/authSlice';
import { deleteUserFail, deleteUserRequest, deleteUserSuccess, updateUserFail, updateUserRequest, updateUserSuccess, userFail, userRequest, usersFail,
         usersRequest,
         usersSuccess, 
         userSuccess} from '../slices/userSlice';

export const login = (email,password)=> async (dispatch) => {

    try {
        dispatch(loginRequest())
        const {data} = await axios.post('/api/v1/login',{email,password});
        dispatch(loginSuccess(data))
    }catch(error){
        // console.error("Login error:", error.response ? error.response.data : error.message);
        dispatch(loginFail(error.response.data.message));
    }
}

export const clearAuthError = dispatch =>{
    dispatch(clearError())
}
// register

export const register = (userData)=> async (dispatch) => {

    try {
        dispatch(registerRequest())
        const config = {
            headers:{
                'Content_type':'multipart/form-data'
            }
        }
        const {data} = await axios.post(`/api/v1/register`,userData,config);
        dispatch(registerSuccess(data));
    }catch(error){
        dispatch(registerFail(error.response.data.message ));
    }
};

// loadUser
export const loadUser =  async (dispatch) => {

    try {
        dispatch(loadUserRequest())
       
        const {data} = await axios.get(`/api/v1/myprofile`);
        dispatch(loadUserSuccess(data));
    }catch(error){
        dispatch(loadUserFail(error.response.data.message ));
    }
};

// logout
export const logout =  async (dispatch) => {

    try {
       
         await axios.get(`/api/v1/logout`);
        dispatch(logoutSuccess());
    }catch(error){
        dispatch(logoutFail);
    }
};
// upDate Profile
export const updateProfile = (userData)=> async (dispatch) => {

    try {
        dispatch(updateProfileRequest())
        const config = {
            headers:{
                'Content_type':'multipart/form-data'
            }
        }
        const {data} = await axios.put(`/api/v1/update`,userData,config);
        dispatch(updateProfileSuccess(data));
    }catch(error){
        dispatch(updateProfileFail(error.response.data.message ));
    }
};
// update password
export const updatePassword = (formData) => async (dispatch) => {

    try {
        dispatch(updatePasswordRequest())
        const config = {
            headers: {
                'Content-type': 'application/json'
            }
        };
        await axios.put(`/api/v1/password/change`, formData, config);
        dispatch(updatePasswordSuccess())
    } catch (error) {
        // const errorMessage =  error.response?.data?.message|| "An unknown error occurred.";
        dispatch(updatePasswordFail(error.response?.data?.message));
    }
};
// forgotPassword
export const forgotPassword = (email)=> async (dispatch) => {

    try {
        dispatch(forgotPasswordRequest())
        const config = {
            headers:{
               'Content_type': 'application/json'
            }
        }
         const {data} = await axios.post(`/api/v1/password/forgot`,{email},config);
        dispatch(forgotPasswordSuccess(data.message));
    }catch(error){
        dispatch(forgotPasswordFail(error.response.data.message));
    }
};

// resetPassword
export const resetPassword = (formData,token)=> async (dispatch) => {

    try {
        dispatch(resetPasswordRequest())
        const config = {
            headers:{
                'Content_type':'application/json'
            }
        }
       const {data}  = await axios.put(`/api/v1/password/reset${token}`,formData,config);
        dispatch(resetPasswordSuccess(data));
    }catch(error){
        dispatch(resetPasswordFail(error.response.data.message));
    }
};

// Getusers
export const getUsers =  async (dispatch) => {

    try {
        dispatch(usersRequest())
        const { data }  = await axios.get(`/api/v1/admin/users`);
        dispatch(usersSuccess(data))
    } catch (error) {
        dispatch(usersFail(error.response.data.message))
    }
}
// getuser
export const getUser = id =>  async (dispatch) => {

    try {
        dispatch(userRequest())
        const { data }  = await axios.get(`/api/v1/admin/users/${id}`);
        dispatch(userSuccess(data))
    } catch (error) {
        dispatch(userFail(error.response.data.message))
    }
}
// deleteUser
export const deleteUser = id => async (dispatch) => {

    try {
        dispatch(deleteUserRequest())
        await axios.delete(`/api/v1/admin/user/${id}`);
        dispatch(deleteUserSuccess())
    } catch (error) {
        dispatch(deleteUserFail(error.response.data.message))
    }
}
//UpdateUser
export const updateUser = (id, formData) => async (dispatch) => {

    try {
        dispatch(updateUserRequest())
        const config = {
            headers: {
                'Content-type': 'application/json'
            }
        };
        await axios.put(`/api/v1/admin/user/${id}`, formData, config);
        dispatch(updateUserSuccess())
    } catch (error) {
        // const errorMessage =  error.response?.data?.message|| "An unknown error occurred.";
        dispatch(updateUserFail(error.response?.data?.message));
    }
}; 