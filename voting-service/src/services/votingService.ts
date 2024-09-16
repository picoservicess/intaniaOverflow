import { ServerUnaryCall, sendUnaryData } from "@grpc/grpc-js";
import {
  applyUpVote,
  applyDownVote,
  getCountVote,
  isUserVote,
} from "../controllers/votingController";

export const votingService = {
  ApplyUpVote: async (
    call: ServerUnaryCall<any, any>,
    callback: sendUnaryData<any>
  ) => {
    const { isThread, targetId, studentId } = call.request;
    const result = await applyUpVote(isThread, targetId, studentId);
    callback(null, result);
  },
  ApplyDownVote: async (
    call: ServerUnaryCall<any, any>,
    callback: sendUnaryData<any>
  ) => {
    const { isThread, targetId, studentId } = call.request;
    const result = await applyDownVote(isThread, targetId, studentId);
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
    const { isThread, targetId, studentId } = call.request;
    const result = await isUserVote(isThread, targetId, studentId);
    callback(null, { voteStatus: result });
  },
};
