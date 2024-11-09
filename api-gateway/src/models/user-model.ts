export interface UpdateUserProfileRequest {
	displayName: string;
	profileImage: string;
}

export interface GetUserProfileRequest {}

export interface UserProfileResponse {
	userId: string;
	displayName: string;
	firstName: string;
	lastName: string;
	firstNameth: string;
	lastNameth: string;
	profileImage: string;
	email: string;
}

export interface LoginRequest {
	ticket: string;
}

export interface LoginResponse {
	message: string;
	token: string;
	userId: string;
}

export interface ApplyPinRequest {
	threadId: string;
}

export interface ApplyPinResponse {
	message: string;
}

export interface ViewPinnedRequest {}

export interface ViewPinnedResponse {
	threadIds: string[];
}

export interface GetUserDetailRequest {
	userId: string;
}

export interface GetUserDetailResponse {
	displayName: string;
	profileImage: string;
}

export interface GetUsersWhoPinnedThreadRequest {
	threadId: string;
}

export interface GetUsersWhoPinnedThreadResponse {
	userIds: string[];
}

export interface HealthCheckRequest {}

export interface HealthCheckResponse {
	success: boolean;
	message: string;
}
