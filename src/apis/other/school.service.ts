import { api } from "../api";
export const schoolList = async () => {
  const response = await api.get("school/list");
  return response.data;
};
export const connectToSchool = async (schoolId: number, userId: number) => {
  const response = await api.post(`school/connect/${schoolId}`, { userId });
  return response.data;
};
