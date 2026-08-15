import apiClient from "../api-client";

export interface AttendanceRecord {
  id: number;
  user_id: number;
  date: string;
  clock_in: string | null;
  clock_out: string | null;
  grade: string;
  status: string;
  notes: string | null;
  created_at: string;
}

export interface AttendanceActionResponse {
  message: string;
}


export const clockInApi = async (lat: number, lng: number): Promise<AttendanceActionResponse> => {
  const response = await apiClient.post<AttendanceActionResponse>("/employee/attendance/clock-in", { lat, lng });
  return response.data;
};

export const clockOutApi = async (lat: number, lng: number): Promise<AttendanceActionResponse> => {
  const response = await apiClient.post<AttendanceActionResponse>("/employee/attendance/clock-out", { lat, lng });
  return response.data;
};

export const requestIzinApi = async (notes: string): Promise<AttendanceActionResponse> => {
  const response = await apiClient.post<AttendanceActionResponse>("/employee/attendance/izin", { notes });
  return response.data;
};

export const getTodayAttendanceApi = async () => {
  const response = await apiClient.get("/employee/attendance/today");
  return response.data.data as AttendanceRecord | null;
};

export const getAttendanceHistoryApi = async () => {
  const response = await apiClient.get("/employee/attendance/history");
  return response.data.data as AttendanceRecord[];
};
