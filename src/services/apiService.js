// src/services/apiService.js

import axios from 'axios';

const apiClient = axios.create({
  // No baseURL needed if using proxy
});

export const generateImage = async (prompt, token) => {
  try {
    const response = await apiClient.post('/ai/prompts', { prompt }, {
      headers: {
        // Use Authorization header as most APIs expect this
        Authorization: `Bearer ${token}`, // or whatever auth scheme you're using
      },
    });

    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};