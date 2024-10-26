import { ServerUnaryCall, sendUnaryData, status } from '@grpc/grpc-js';

import { getAuthenticatedUserId } from '../../../user-service/src/libs/token';
import {
    applyDownVote,
    applyUpVote,
    getCountVote,
    isUserVote,
} from '../repositorys/votingRepository';

export const votingService = {
    ApplyUpVote: async (
        call: ServerUnaryCall<any, any>,
        callback: sendUnaryData<any>
    ) => {
        const userId = await getAuthenticatedUserId(call.metadata);
        if (!userId) {
            return callback({
                code: status.UNAUTHENTICATED,
                details: 'Authentication required',
            });
        }

        const { isThread, targetId } = call.request;
        const result = await applyUpVote(isThread, targetId, userId);
        callback(null, result);
    },
    ApplyDownVote: async (
        call: ServerUnaryCall<any, any>,
        callback: sendUnaryData<any>
    ) => {
        const userId = await getAuthenticatedUserId(call.metadata);
        if (!userId) {
            return callback({
                code: status.UNAUTHENTICATED,
                message: 'Authentication required',
            });
        }

        const { isThread, targetId } = call.request;
        const result = await applyDownVote(isThread, targetId, userId);
        callback(null, result);
    },
    GetCountVote: async (
        call: ServerUnaryCall<any, any>,
        callback: sendUnaryData<any>
    ) => {
        const { isThread, targetId } = call.request;
        const result = await getCountVote(isThread, targetId);
        callback(null, result);
    },
    IsUserVote: async (
        call: ServerUnaryCall<any, any>,
        callback: sendUnaryData<any>
    ) => {
        const userId = await getAuthenticatedUserId(call.metadata);
        if (!userId) {
            return callback({
                code: status.UNAUTHENTICATED,
                message: 'Authentication required',
            });
        }

        const { isThread, targetId } = call.request;
        const result = await isUserVote(isThread, targetId, userId);
        callback(null, { voteStatus: result });
    },
};
