import request from 'supertest';
import app from '../src/app.js';
import { jest } from '@jest/globals';

describe('App & Core Routes Integration', () => {
  it('should return 200 on health check route', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toContain('running');
  });

  it('should return 404 for unknown routes', async () => {
    const res = await request(app).get('/api/unknown-endpoint-that-doesnt-exist');
    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('not found');
  });
});
