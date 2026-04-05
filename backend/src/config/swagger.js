import swaggerJsDoc from 'swagger-jsdoc';

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Finance Dashboard API',
            version: '1.0.0',
            description: 'API Documentation for the Finance Dashboard Application',
        },
        servers: [
            {
                url: 'http://localhost:5001',
                description: 'Development Server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [{ bearerAuth: [] }],
    },
    apis: ['./src/modules/**/*.routes.js'],
};

export default swaggerJsDoc(swaggerOptions);
