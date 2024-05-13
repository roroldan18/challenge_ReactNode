import { describe, test, expect } from "@jest/globals"
import request from 'supertest';
import app from '../server';


describe('Server test', () =>{

  test('Status should be 500 without params', async () => {
    const response = await request(app).get('/api/users');
    expect(response.status).toBe(500);
});

  test('Status should be 200 with param', async () => {
    const queryParam = 'Juan';
    const response = await request(app)
      .get('/api/users')
      .query({ q: queryParam }); 

    expect(response.status).toBe(200);
  })

  test('Status should be 500 with array param', async () => {
    const queryParam = ['Juan', 'Pedro'];
    const response = await request(app)
      .get('/api/users')
      .query({ q: queryParam }); 

    expect(response.status).toBe(500);
  })
})