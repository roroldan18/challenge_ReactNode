import { describe, test, expect } from "@jest/globals"
import request from 'supertest';
import app from '../server';


describe('Server test', () =>{

  test('Status should be 200', async () => {
    const response = await request(app).get('/api/users');
    expect(response.status).toBe(200);
});
})