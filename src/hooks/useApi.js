import { useState } from 'react';
import { ApiService } from '../utils/apiService';

export const useApi = (initialState = null) => {
  const [data, setData] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const execute = async (prompt, parseJson = false, maxTokens = 1000) => {
    setLoading(true);
    setError('');
    try {
      const response = await ApiService.makeRequest(prompt, maxTokens);
      const result = parseJson ? ApiService.parseJsonResponse(response) : response;
      setData(result);
      return result;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, execute };
};
