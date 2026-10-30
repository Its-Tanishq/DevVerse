import apiClient from "../config/ApiClient";

const groupApi = {
  // Study Group CRUD & Discovery
  getPublicGroups: async (params = {}) => {
    const res = await apiClient.get("/groups", { params });
    return res.data?.data || res.data;
  },

  getMyGroups: async () => {
    const res = await apiClient.get("/groups/my");
    return res.data?.data || res.data;
  },

  getGroupById: async (groupId) => {
    const res = await apiClient.get(`/groups/${groupId}`);
    return res.data?.data || res.data;
  },

  createGroup: async (groupData) => {
    const res = await apiClient.post("/groups", groupData);
    return res.data?.data || res.data;
  },

  updateGroup: async (groupId, groupData) => {
    const res = await apiClient.put(`/groups/${groupId}`, groupData);
    return res.data?.data || res.data;
  },

  deleteGroup: async (groupId) => {
    const res = await apiClient.delete(`/groups/${groupId}`);
    return res.data?.data || res.data;
  },

  regenerateInviteCode: async (groupId) => {
    const res = await apiClient.post(`/groups/${groupId}/regenerate-invite`);
    return res.data?.data || res.data;
  },

  // Membership & Joining
  joinPublicGroup: async (groupId) => {
    const res = await apiClient.post(`/groups/${groupId}/join`);
    return res.data?.data || res.data;
  },

  joinByInviteCode: async (inviteCode) => {
    const res = await apiClient.post(`/groups/join/code/${inviteCode}`);
    return res.data?.data || res.data;
  },

  requestToJoin: async (groupId, requestData = {}) => {
    const res = await apiClient.post(`/groups/${groupId}/requests`, requestData);
    return res.data?.data || res.data;
  },

  getPendingJoinRequests: async (groupId) => {
    const res = await apiClient.get(`/groups/${groupId}/requests`);
    return res.data?.data || res.data;
  },

  acceptJoinRequest: async (groupId, requestId) => {
    const res = await apiClient.put(
      `/groups/${groupId}/requests/${requestId}/accept`
    );
    return res.data?.data || res.data;
  },

  rejectJoinRequest: async (groupId, requestId) => {
    const res = await apiClient.put(
      `/groups/${groupId}/requests/${requestId}/reject`
    );
    return res.data?.data || res.data;
  },

  inviteUser: async (groupId, inviteData) => {
    const res = await apiClient.post(`/groups/${groupId}/invite`, inviteData);
    return res.data?.data || res.data;
  },

  // Group Members
  getMembers: async (groupId) => {
    const res = await apiClient.get(`/groups/${groupId}/members`);
    return res.data?.data || res.data;
  },

  leaveGroup: async (groupId) => {
    const res = await apiClient.delete(`/groups/${groupId}/members/me`);
    return res.data?.data || res.data;
  },

  removeMember: async (groupId, userId) => {
    const res = await apiClient.delete(`/groups/${groupId}/members/${userId}`);
    return res.data?.data || res.data;
  },

  promoteToAdmin: async (groupId, userId) => {
    const res = await apiClient.put(
      `/groups/${groupId}/members/${userId}/admin`
    );
    return res.data?.data || res.data;
  },

  // Group Feed / Posts
  getGroupFeed: async (groupId, params = {}) => {
    const res = await apiClient.get(`/groups/${groupId}/posts`, { params });
    return res.data?.data || res.data;
  },

  createPost: async (groupId, postData) => {
    const res = await apiClient.post(`/groups/${groupId}/posts`, postData);
    return res.data?.data || res.data;
  },

  deletePost: async (groupId, postId) => {
    const res = await apiClient.delete(`/groups/${groupId}/posts/${postId}`);
    return res.data?.data || res.data;
  },

  toggleLike: async (groupId, postId) => {
    const res = await apiClient.post(
      `/groups/${groupId}/posts/${postId}/like`
    );
    return res.data?.data || res.data;
  },

  getComments: async (groupId, postId) => {
    const res = await apiClient.get(
      `/groups/${groupId}/posts/${postId}/comments`
    );
    return res.data?.data || res.data;
  },

  addComment: async (groupId, postId, commentData) => {
    const res = await apiClient.post(
      `/groups/${groupId}/posts/${postId}/comments`,
      commentData
    );
    return res.data?.data || res.data;
  },

  deleteComment: async (groupId, postId, commentId) => {
    const res = await apiClient.delete(
      `/groups/${groupId}/posts/${postId}/comments/${commentId}`
    );
    return res.data?.data || res.data;
  },

  // Group Live Chat
  getChatMessages: async (groupId, params = {}) => {
    const res = await apiClient.get(`/groups/${groupId}/chat/messages`, {
      params,
    });
    return res.data?.data || res.data;
  },

  sendChatMessage: async (groupId, messageData) => {
    const res = await apiClient.post(
      `/groups/${groupId}/chat/messages`,
      messageData
    );
    return res.data?.data || res.data;
  },
};

export default groupApi;
