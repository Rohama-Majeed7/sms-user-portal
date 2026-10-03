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

export const logout = async (email: string) => {
    const response = await api.post('auth/logout', { email })
    localStorage.removeItem('accessToken')
    localStorage.removeItem('user')
    return response.data
}

export const sendOtp = async (email: string, schoolId?: number) => {
    const payload: { email: string; schoolId?: number } = { email }
    if (schoolId !== undefined && schoolId !== null) {
        payload.schoolId = schoolId
    }
    const response = await api.post('auth/send-otp', payload)
    return response.data
}

export const verifyOtp = async (email: string, otp: string, schoolId?: number) => {
    const payload: { email: string; otp: string; schoolId?: number } = { email, otp }
    if (schoolId !== undefined && schoolId !== null) {
        payload.schoolId = schoolId
    }
    const response = await api.post('auth/verify-otp', payload)
    return response.data
}

export const resetPassword = async (email: string, newPassword: string, schoolId?: number) => {
    const payload: { email: string; newPassword: string; schoolId?: number } = { email, newPassword }
    if (schoolId !== undefined && schoolId !== null) {
        payload.schoolId = schoolId
    }
    const response = await api.post('auth/reset-password', payload)
    return response.data
}

export const setEmailPassword = async (token: string, password: string) => {
    const response = await api.post('auth/set-password', { token, password })
    return response.data
}
export const resendSetPasswordLink = async (token: string) => {
    const response = await api.post('auth/resend-link', { token })
    return response.data
}