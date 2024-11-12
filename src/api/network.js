import axios from 'axios';

const API_BASE_URL = '/.netlify/functions';

class NetworkAPI {
  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  // Add auth token to requests
  setAuthToken(token) {
    if (token) {
      this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete this.client.defaults.headers.common['Authorization'];
    }
  }

  // Get network metrics
  async getNetworkMetrics(timeRange = {}) {
    try {
      const { start, end } = timeRange;
      const params = new URLSearchParams();
      
      if (start) params.append('start', start);
      if (end) params.append('end', end);

      const response = await this.client.get(`/network-metrics?${params}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get node status
  async getNodeStatus(nodeId) {
    try {
      const response = await this.client.get(`/node-status?nodeId=${nodeId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Authenticate user
  async authenticate(credentials) {
    try {
      const response = await this.client.post('/authenticate', credentials);
      const { token } = response.data;
      this.setAuthToken(token);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Batch status check for multiple nodes
  async batchNodeStatus(nodeIds) {
    try {
      const promises = nodeIds.map(nodeId => this.getNodeStatus(nodeId));
      const responses = await Promise.allSettled(promises);
      
      return responses.map((response, index) => ({
        nodeId: nodeIds[index],
        ...response.status === 'fulfilled' 
          ? { data: response.value }
          : { error: response.reason.message }
      }));
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Error handling
  handleError(error) {
    if (error.response) {
      // Server responded with error
      const { status, data } = error.response;
      const message = data.error || 'An error occurred';
      
      if (status === 401) {
        // Clear auth token on unauthorized
        this.setAuthToken(null);
      }
      
      return new Error(message);
    } else if (error.request) {
      // Request made but no response
      return new Error('Network error - no response received');
    } else {
      // Request setup error
      return new Error('Failed to make request');
    }
  }
}

// Export singleton instance
export const networkAPI = new NetworkAPI();

// Export class for testing/mocking
export { NetworkAPI };