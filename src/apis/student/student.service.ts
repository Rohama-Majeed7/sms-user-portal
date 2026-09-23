import api from "../api";

export const getStudentProfile = async () => {
  const response = await api.get("student/profile");
  return response.data;
}
export const updateStudentProfile = async (data: {
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  guardianName?: string;
  guardianPhone?: string;
  admissionNumber?: string;
}) => {
  const response = await api.put("student/profile", data);
  return response.data;
};
