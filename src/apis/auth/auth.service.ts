import api from "../api.ts"

export const signUp = async (data: any) => {
    const payload: any = {
        email: data.email,
        password: data.password,
        role: data.role,
        name: data.fullName,
    };
    if (data.schoolId) {
        payload.schoolId = data.schoolId;
    }
    const response = await api.post('auth/signup', payload);
    return response.data;
}

export const schoolList = async () => {
    const response = await api.get('users')
    return response.data
}

export const login = async (data: any) => {
    const response = await api.post('auth/login', data)
    localStorage.setItem('accessToken', response.data.accessToken)
    localStorage.setItem('user', JSON.stringify(response.data.user))
    return response.data
}

export const logout = async (email: string, schoolId: number) => {
    const response = await api.post('auth/logout', { email, schoolId })
    localStorage.removeItem('accessToken')
    localStorage.removeItem('user')
    return response.data
}

export const sendOtp = async (email: string, schoolId: number) => {
    const response = await api.post('auth/send-otp', { email, schoolId })
    return response.data
}

export const verifyOtp = async (email: string, otp: string, schoolId: number) => {
    const response = await api.post('auth/verify-otp', { email, otp, schoolId })
    return response.data
}

export const resetPassword = async (email: string, newPassword: string, schoolId: number) => {
    const response = await api.post('auth/reset-password', { email, newPassword, schoolId })
    return response.data
}
