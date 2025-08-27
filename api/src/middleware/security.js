import cors from "cors";
import helmet from "helmet";

export const securityMiddleware = (app) => {
  // CORS configuration
  app.use(cors({
    origin: [
      process.env.FRONTEND_URL || "http://localhost:8080",
      "http://localhost:3000",
      "null"
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));

  // Security headers
  app.use(helmet({
    crossOriginResourcePolicy: { 
      policy: "cross-origin" 
    },
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "http:", "https:"],
      },
    }
  }));
};

