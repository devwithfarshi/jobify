import requests from "./httpRequest";

const UserService = {
  getAllUsers: async (query = null) =>
    requests.get(query ? `/user?${query}` : "/user"),
  getUser: async (id) => requests.get(`/user/${id}`),
  updateUser: async (id, body) => requests.put(`/user/${id}`, body),
  deleteUser: async (id) => requests.delete(`/user/${id}`),
};

export default UserService;
