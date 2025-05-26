import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    type ReactNode
} from 'react';
// Assuming '../services/api-mothod-service' provides a 'post' function
// For this example, we'll mock it or assume it's available.
// If not provided, you would need to define a mock or actual post function.
const post = async (url: string, data: any) => {
    console.log(`Mock API call: POST ${url} with data:`, data);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    // Simulate a successful authentication response
    if (data.email === 'test@example.com' && data.password === 'password') {
        return { data: { token: 'mock-auth-token-123' } };
    }
    throw new Error('Invalid credentials');
};


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
            setAuthToken(null); // Clear authToken on error
            return false;
        }
    };

    const logout = () => {
        setAuthToken(null); // Clear authToken in state
        localStorage.removeItem('authToken'); // Remove authToken from localStorage
        // Optionally, if there were other user-related items, remove them too.
        // localStorage.removeItem('userProfile');
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
