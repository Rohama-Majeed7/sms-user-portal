import api from "../api";

export const updateTeacherProfile = async (data: {
  employeeNumber?: string;
  qualification?: string;
  specialization?: string;
  joiningDate?: string;
}) => {
  const response = await api.put("teacher/profile", data);
  return response.data;
};
