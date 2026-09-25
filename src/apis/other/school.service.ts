import { api } from "../api";
import type { ApiResponse } from "../../types/response.type";
export const schoolList = async (): Promise<ApiResponse<any[]>> => {
  const response = await api.get("school/list");
  return response.data;
};
export const connectToSchool = async (schoolId: number): Promise<ApiResponse<any>> => {
  const response = await api.post(`school/connect/${schoolId}`);
  return response.data;
};
