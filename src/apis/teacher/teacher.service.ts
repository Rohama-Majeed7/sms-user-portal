import api from "../api";

export const getTeacherProfile = async () => {
  const response = await api.get("teacher/profile");
  return response.data;
};
export const updateTeacherProfile = async (data: {
  employeeNumber?: string;
  qualification?: string;
  specialization?: string;
  joiningDate?: string;
}) => {
  const response = await api.put("teacher/profile", data);
  return response.data;
};


