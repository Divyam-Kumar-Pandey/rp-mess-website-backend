/** @type {import('next').NextConfig} */
const nextConfig = {
    async headers() {
        return [
            {
                source: 'api/:path*',
                // cors origin
                headers: [
                    {
                        key: 'Access-Control-Allow-Credentials',
                        value: 'true',
                    },
                    {
                        key: 'Access-Control-Allow-Origin',
                        value: '*',
                    },
                    {
                        key: 'Access-Control-Allow-Methods',
                        value: 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
                    },
                    {
                        key: 'Access-Control-Allow-Headers',
                        value: 'X-Requested-With, Content-Type, Accept, Origin, Authorization',
                    },
                ],
            }
        ]
    },
};

export default nextConfig;
