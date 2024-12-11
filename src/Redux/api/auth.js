import axiosInstance from './axiosInstance'; // Assuming you have axiosInstance set up

const authApi = {
    login: async (credentials) => {
        const { email, password } = credentials;
        console.log(credentials);
        // Mock response logic based on hardcoded credentials
        if (email === 'consumer@gmail.com' && password === '1234') {
            // Return mock response with a role of 'consumer'
            console.log("asdf")
            return {
                status: 200,
                data: {
                    message: 'Login successful',
                    role: 'consumer',
                    httpStatus: 'ok'
                },
            };
        }

        if (email === 'generator@gmail.com' && password === '1234') {
            // Return mock response with a role of 'generator'
            return {
                status: 200,
                data: {
                    message: 'Login successful',
                    role: 'generator',
                },
            };
        }

        // If the credentials do not match, throw an error
        throw new Error('Invalid credentials');
    },
};

export default authApi;
