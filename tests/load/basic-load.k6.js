/**
 * k6 Load Test - Basic HTTP Load Testing
 * Tests system behavior under expected load
 */

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('errors');

// Test configuration
export const options = {
  // Simulate ramping load
  stages: [
    { duration: '30s', target: 20 },   // Ramp up to 20 users
    { duration: '1m', target: 50 },    // Stay at 50 users
    { duration: '30s', target: 100 },  // Ramp to 100 users
    { duration: '1m', target: 100 },   // Stay at 100 users
    { duration: '30s', target: 0 },    // Ramp down to 0
  ],
  
  // Performance thresholds
  thresholds: {
    'http_req_duration': ['p(95)<500', 'p(99)<1000'], // 95% under 500ms, 99% under 1s
    'http_req_failed': ['rate<0.01'],  // Less than 1% errors
    'errors': ['rate<0.01'],           // Less than 1% custom errors
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

export default function () {
  // GET request
  const getResponse = http.get(`${BASE_URL}/api/health`);
  
  // Check response
  const checkResult = check(getResponse, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
    'has valid JSON': (r) => {
      try {
        JSON.parse(r.body);
        return true;
      } catch {
        return false;
      }
    },
  });
  
  // Track errors
  errorRate.add(!checkResult);
  
  // Simulate user think time
  sleep(1);
  
  // POST request (example)
  const payload = JSON.stringify({
    action: 'test',
    timestamp: new Date().toISOString(),
  });
  
  const postResponse = http.post(`${BASE_URL}/api/events`, payload, {
    headers: { 'Content-Type': 'application/json' },
  });
  
  check(postResponse, {
    'POST status is 200 or 201': (r) => r.status === 200 || r.status === 201,
  });
  
  sleep(1);
}

// Setup function (runs once before test)
export function setup() {
  console.log('🔥 Starting load test...');
  console.log(`Target URL: ${BASE_URL}`);
}

// Teardown function (runs once after test)
export function teardown(data) {
  console.log('✅ Load test complete!');
}
