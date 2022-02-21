import delay from '../../utils/delay';
import APIError from '../../errors/APIError';

class HttpClient {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  async get(path) {
    await delay(500);

    const response = await fetch(`${this.baseUrl}${path}`);

    let body = null;

    const contentType = response.headers.get('Content-Type')

    if (contentType.includes('application/json')) {
      body = await response.json();
    }

    if (response.ok) {
      return body;
    }

    throw new APIError(response, body);
  }

  async post(path, data) {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'POST',
      body: JSON.stringify(data)
    });

    await delay(500);

    return response.json();
  }
}

export default HttpClient;
