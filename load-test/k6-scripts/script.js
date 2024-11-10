import http from "k6/http";
import { check, sleep } from "k6";
import { Counter } from "k6/metrics";

// Custom metrics
const errorCounter = new Counter("errors");

// Test configuration
export const options = {
	stages: [
		{ duration: "1m", target: 20 }, // Ramp up to 20 users
		{ duration: "3m", target: 20 }, // Stay at 20 users
		{ duration: "1m", target: 0 }, // Ramp down to 0 users
	],
	thresholds: {
		http_req_duration: ["p(95)<500"], // 95% of requests should be below 500ms
		checks: ["rate>99.9"], // Error rate should be less than 10%
	},
};

const BASE_URL = "http://192.168.40.55:80"; // Replace with your API URL

// Add your Bearer token here
const TOKEN =
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJiMzk0YjdlYS05OGJhLTQyYjktYmNkMy0yNmYyMWY3YTAzZTQiLCJpYXQiOjE3MzEyMzY3MzcsImV4cCI6MTczMTI0MDMzN30.bhVbg4KkKsoBxTAlDysLi-0CODamCboDwOCv9qvZDOk";

// Common headers with authentication
const headers = {
	"Content-Type": "application/json",
	Authorization: `Bearer ${TOKEN}`,
};

export default function () {
	// Group 1: Get User profile
	const getUserProfileResponse = http.get(`${BASE_URL}/users/userProfile`, { headers: headers });
	check(getUserProfileResponse, {
		"Get User profile status is 200": (r) => r.status === 200,
	});
	if (getUserProfileResponse.status !== 200) {
		errorCounter.add(1);
	}

	sleep(0.3);

	// Group 2: Search thread
	const searchThreadResponse = http.get(
		`${BASE_URL}/threads/search?query=Test&page=0&pageSize=25`,
		{ headers: headers }
	);
	check(searchThreadResponse, {
		"Search thread status is 200": (r) => r.status === 200,
	});
	if (searchThreadResponse.status !== 200) {
		errorCounter.add(1);
	}

	sleep(0.3);

	// Group 3: Create reply
	const createReplyPayload = JSON.stringify({
		text: "Test reply from K6",
		assetUrls: [],
	});

	const createReplyResponse = http.post(
		`${BASE_URL}/replies/6728bc214e6212c761e0c051`,
		createReplyPayload,
		{ headers: headers }
	);
	check(createReplyResponse, {
		"Create reply status is 201": (r) => r.status === 201,
	});
	if (createReplyResponse.status !== 201) {
		errorCounter.add(1);
	}

	sleep(0.3);

	// Group 4: Create thread
	const createThreadPayload = JSON.stringify({
		title: "Test Create Thread from K6",
		body: "Dolor molestiae et autem et. Blanditiis autem reprehenderit vel dolore facilis. Maiores non commodi odio quia voluptates iure vitae.",
		assetUrls: [],
		tags: [],
		isAnonymous: false,
	});

	const createThreadResponse = http.post(`${BASE_URL}/threads`, createThreadPayload, {
		headers: headers,
	});
	check(createThreadResponse, {
		"Create Thread status is 201": (r) => r.status === 201,
	});
	if (createThreadResponse.status !== 201) {
		errorCounter.add(1);
	}

	sleep(0.3);
}

// Setup function (runs once before the test)
export function setup() {
	console.log("Test setup");
	// You could also set up authentication here if needed
	// For example, getting a token from an auth endpoint
}

// Teardown function (runs once after the test)
export function teardown(data) {
	console.log("Test teardown");
	// Add any cleanup logic here
}
