/**
 * k6 Stress Test - Push System to Its Limits
 * Tests system behavior under extreme load
 */

import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  // Stress test: gradually increase load until system breaks
  stages: [
    { duration: '2m', target: 100 },   // Normal load
    { duration: '3m', target: 200 },   // Above normal
    { duration: '2m', target: 300 },   // Breaking point?
    { duration: '3m', target: 400 },   // Way above normal
    { duration: '2m', target: 500 },   // Extreme load
    { duration: '5m', target: 0 },     // Recovery
  ],
  
  thresholds: {
    'http_req_duration': ['p(99)<3000'], // Relaxed for stress testing
    'http_req_failed': ['rate<0.1'],     // Allow 10% errors under stress
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

export default function () {
  const response = http.get(`${BASE_URL}/api/health`);
  
  check(response, {
    'status is 200': (r) => r.status === 200,
  });
  
  sleep(Math.random() * 2); // Random think time
}

export function setup() {
  console.log('💪 Starting stress test - Finding breaking point...');
}

export function teardown() {
  console.log('✅ Stress test complete - Recovery tested');
}
