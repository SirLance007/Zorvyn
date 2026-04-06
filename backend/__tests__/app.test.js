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

describe('Auth Routes', () => {
  it('POST /api/auth/register - should return 400 for missing fields', async () => {
    const res = await request(app).post('/api/auth/register').send({});
    expect(res.statusCode).toBe(400);
  });

  it('POST /api/auth/register - should return 400 for invalid email', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Test User',
      email: 'not-an-email',
      password: 'password123'
    });
    expect(res.statusCode).toBe(400);
  });

  it('POST /api/auth/register - should return 400 for short password', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Test User',
      email: 'test@example.com',
      password: '123'
    });
    expect(res.statusCode).toBe(400);
  });

  it('POST /api/auth/login - should return 400 for missing fields', async () => {
    const res = await request(app).post('/api/auth/login').send({});
    expect(res.statusCode).toBe(400);
  });

  it('POST /api/auth/login - should return 401 for non-existent user', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'nobody@nowhere.com',
      password: 'password123'
    });
    expect(res.statusCode).toBe(401);
  });
});

describe('Protected Routes - No Token', () => {
  it('GET /api/users - should return 401 without token', async () => {
    const res = await request(app).get('/api/users');
    expect(res.statusCode).toBe(401);
  });

  it('GET /api/transactions - should return 401 without token', async () => {
    const res = await request(app).get('/api/transactions');
    expect(res.statusCode).toBe(401);
  });

  it('GET /api/dashboard/summary - should return 401 without token', async () => {
    const res = await request(app).get('/api/dashboard/summary');
    expect(res.statusCode).toBe(401);
  });

  it('POST /api/transactions - should return 401 without token', async () => {
    const res = await request(app).post('/api/transactions').send({
      amount: 100,
      type: 'INCOME',
      category: 'Salary',
      date: '2026-01-01'
    });
    expect(res.statusCode).toBe(401);
  });
});

describe('Protected Routes - Invalid Token', () => {
  const badAuthHeader = { Authorization: 'Bearer invalid.token.here' };

  it('GET /api/users - should return 401 with invalid token', async () => {
    const res = await request(app).get('/api/users').set(badAuthHeader);
    expect(res.statusCode).toBe(401);
  });

  it('GET /api/transactions - should return 401 with invalid token', async () => {
    const res = await request(app).get('/api/transactions').set(badAuthHeader);
    expect(res.statusCode).toBe(401);
  });

  it('GET /api/dashboard/summary - should return 401 with invalid token', async () => {
    const res = await request(app).get('/api/dashboard/summary').set(badAuthHeader);
    expect(res.statusCode).toBe(401);
  });
});

describe('Rate Limiting', () => {
  it('should include rate limit headers on /api routes', async () => {
    const res = await request(app).get('/api/dashboard/summary');
    // Rate limit headers should be present (even on 401 responses)
    expect(res.headers).toHaveProperty('ratelimit-limit');
  });
});
