import axios from "axios";

axios.defaults.withCredentials = true;
const API = axios.create({ baseURL: "/api" }); 

let accessToken = null;

API.interceptors.request.use(config => {
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});

// --- AUTHENTICATION FUNCTIONS ---

export const registerUser = async (formData) => {
    try {
        const res = await API.post(`/auth/register`, formData, {
            headers: { "Content-Type": "application/json" },
        });
        return res.data;
    } catch (error) {
        return error.response?.data || { success: false, message: "Registration failed" };
    }
};

export const loginUser = async (formData) => {
  try {
    const res = await API.post("/auth/login", formData, {
      headers: { "Content-Type": "application/json" },
    });

    if (res.data.success) {
      accessToken = res.data.data.accessToken;
    }
    return res.data;
  } catch (error) {
    return error.response?.data || { success: false, message: "Login failed" };
  }
};

export const refreshToken = async () => {
  try {
    const res = await API.get("/auth/refresh");
    accessToken = res.data.data.newaccessToken;
    return res.data;
  } catch (err) {
    return null;
  }
};

export const getLoggedInUser = async () => {
  try {
    return await API.get("/auth/user/me");
  } catch (err) {
    return null;
  }
};

export const logoutUser = async () => {
  try {
    const res = await API.post("/auth/logout");
    // clear in-memory access token on logout
    accessToken = null;
    return res.data;
  } catch (error) {
    // ensure token is cleared even if request fails
    accessToken = null;
    return { success: false, message: "Logout failed" };
  }
};

// --- TODO CRUD FUNCTIONS ---

// Create a new Todo
export const createTodo = async (newToDo) => {
  try {
    const res = await API.post(`/todos`, newToDo);
    return res.data;
  } catch (error) {
    console.error("Create Todo Error:", error);
    throw error;
  }
};

// Get all Todos
export const getTodo = async () => {
  try {
    const res = await API.get(`/todos`);
    return res.data;
  } catch (error) {
    console.error("Get Todos Error:", error);
    throw error;
  }
};

// Update a Todo
export const updateTodo = async (id, updates) => {
  try {
    const res = await API.put(`/todos/${id}`, updates);
    return res.data;
  } catch (error) {
    console.error("Update Todo Error:", error);
    throw error;
  }
};

// Delete a Todo
export const deleteTodo = async (id) => {
  try {
    const res = await API.delete(`/todos/${id}`);
    return res.data;
  } catch (error) {
    console.error("Delete Todo Error:", error);
    throw error;
  }
};