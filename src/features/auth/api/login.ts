export interface LoginResponse {
  message: string;
  token: string;
  user: {
    id: number;
    name: string;
    phone: string;
    role: string;
  };
}

export const loginApi = async (phone: string): Promise<LoginResponse> => {
  const response = await fetch("http://localhost:8080/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ phone }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Gagal melakukan login. Periksa nomor HP Anda.");
  }

  return data;
};
