import React, { createContext, useContext, useState } from 'react';
import { login as loginUser } from '../services/userService'; // 引入你的 login 函数

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const login = async (username, password, role) => {
        try {
            const data = await loginUser(username, password, role); // 使用导入的 login 函数
            setUser({ ...data, isAuthenticated: true }); // 存储用户数据及认证状态
            return data;
        } catch (error) {
            console.error('登录失败:', error);
            throw error; // 向调用者抛出错误以便进一步处理
        }
    };

    const logout = () => {
        setUser(null); // 清除用户状态
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
