const API_BASE_URL = 'http://localhost:5000/api';

export class ApiService {
  static getAuthToken() {
    return localStorage.getItem('token');
  }

  static async makeAuthRequest(endpoint, method = 'GET', data = null) {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getAuthToken()}`
    };

    const config = {
      method,
      headers,
      credentials: 'include'
    };

    if (data) {
      config.body = JSON.stringify(data);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Request failed');
    }

    return response.json();
  }

  static async makeRequest(prompt, maxTokens = 1000) {
    const token = this.getAuthToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await this.makeAuthRequest('/users/tokens', 'POST', {
      amount: -1, // Deduct one token
      action: 'API_REQUEST'
    });

    // Your existing API call to DeepSeek
    const aiResponse = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: maxTokens
      })
    });

    if (!aiResponse.ok) {
      throw new Error('AI API request failed');
    }

    const data = await aiResponse.json();
    return data.choices[0].message.content;
  }

  static parseJsonResponse(content) {
    try {
      return JSON.parse(content);
    } catch (e) {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error('Could not parse JSON response');
    }
  }
}
