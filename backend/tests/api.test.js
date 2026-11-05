import { test, describe } from 'node:test';
import assert from 'node:assert';
import http from 'http';
import app from '../src/app.js';

// Helper to simulate HTTP requests directly against Express app with mocked socket
function testRequest(app, method, url, body = null, headers = {}) {
  return new Promise((resolve) => {
    const socket = {
      remoteAddress: '127.0.0.1',
      encrypted: false,
      readable: true,
      writable: true,
      on: () => {},
      once: () => {},
      emit: () => {},
    };

    const req = new http.IncomingMessage(socket);
    req.method = method;
    req.url = url;
    req.socket = socket;
    req.connection = socket;
    req.headers = {
      'content-type': 'application/json',
      ...headers,
    };

    let resBody = '';
    const res = new http.ServerResponse(req);
    res.assignSocket(socket);

    res.write = function (chunk) {
      if (chunk) resBody += chunk.toString();
      return true;
    };
    res.end = function (chunk) {
      if (chunk) resBody += chunk.toString();
      resolve({
        statusCode: res.statusCode,
        headers: res.getHeaders(),
        body: resBody,
        json: () => {
          try {
            return JSON.parse(resBody);
          } catch {
            return { raw: resBody };
          }
        },
      });
    };

    if (body) {
      req.push(JSON.stringify(body));
    }
    req.push(null);

    app.handle(req, res);
  });
}

describe('Wedora Express API Routes', () => {
  test('GET /api/health responds with 200 and healthy status', async () => {
    const response = await testRequest(app, 'GET', '/api/health');
    assert.strictEqual(response.statusCode, 200);
    const data = response.json();
    assert.strictEqual(data.status, 'healthy');
    assert.strictEqual(data.service, 'Wedora API');
  });

  test('POST /api/auth/register rejects missing fields with 400', async () => {
    const response = await testRequest(app, 'POST', '/api/auth/register', {
      name: 'Test Partner',
    });
    assert.strictEqual(response.statusCode, 400);
    const data = response.json();
    assert.strictEqual(data.success, false);
    assert.ok(data.message.includes('Please provide name, email, and password'));
  });

  test('POST /api/auth/login rejects missing credentials with 400', async () => {
    const response = await testRequest(app, 'POST', '/api/auth/login', {
      email: 'test@example.com',
    });
    assert.strictEqual(response.statusCode, 400);
    const data = response.json();
    assert.strictEqual(data.success, false);
  });

  test('Protected endpoint /api/weddings rejects unauthenticated requests with 401', async () => {
    const response = await testRequest(app, 'GET', '/api/weddings');
    assert.strictEqual(response.statusCode, 401);
    const data = response.json();
    assert.strictEqual(data.success, false);
    assert.ok(data.message.includes('Not authorized'));
  });

  test('Unknown API route responds with 404', async () => {
    const response = await testRequest(app, 'GET', '/api/unknown-route-12345');
    assert.strictEqual(response.statusCode, 404);
    const data = response.json();
    assert.strictEqual(data.success, false);
  });
});
