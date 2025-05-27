import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    type ReactNode
} from 'react';
import { post } from '../services/api-mothod-service';

type Credentials = {
    email: string;
    password: string;
};

type AuthContextType = {
    authToken: string | null; // Changed from 'user' to 'authToken'
    login: (credentials: Credentials) => Promise<boolean>;
    logout: () => void;
    loading: boolean;
};

// 2. Create context with default value as undefined
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 3. AuthProvider with typed children prop
type AuthProviderProps = {
    children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
    // Changed from 'user' to 'authToken'
    const [authToken, setAuthToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Retrieve authToken from localStorage
        const storedAuthToken = localStorage.getItem('authToken');
        if (storedAuthToken) {
            setAuthToken(storedAuthToken);
        }
        setLoading(false);
    }, []);

    const login = async (credentials: Credentials): Promise<boolean> => {
        try {
            const response = await post('/authenticate', credentials);
            const token = response?.data?.token;
            localStorage.setItem("authToken", token);
            setAuthToken(token);
            return true;
        } catch (error: any) {
            console.error('Login Error:', error?.response?.data || error.message);
            setAuthToken(null);
            return false;
        }
    };

    const logout = () => {
        setAuthToken(null);
        localStorage.removeItem('authToken');
    };

    return (
        <AuthContext.Provider value={{ authToken, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

// 4. Custom hook with error if used outside provider
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
