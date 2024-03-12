import express, { Express, NextFunction, Request, Response } from "express";
const app: Express = express();
import cors from "cors";
import api from "./router/index";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import swaggerUI from "swagger-ui-express";
import errorMiddleware, { AppError } from "./middleware/errorHanding";
import * as Sentry from "@sentry/node";
import { ProfilingIntegration } from "@sentry/profiling-node";

const YAML = require("yamljs");
const path = require("path");
const swaggerDocs = YAML.load(
  path.resolve(__dirname, "../../config/swagger/api.yaml")
);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocs));

// Sentry.init({
//   dsn: "",
//   integrations: [
//     // enable HTTP calls tracing
//     new Sentry.Integrations.Http({ tracing: true }),
//     // enable Express.js middleware tracing
//     new Sentry.Integrations.Express({ app }),
//     new ProfilingIntegration(),
//   ],
//   // Performance Monitoring
//   tracesSampleRate: 1.0, //  Capture 100% of the transactions
//   // Set sampling rate for profiling - this is relative to tracesSampleRate
//   profilesSampleRate: 1.0,
// });

app.enable("trust proxy");
// The request handler must be the first middleware on the app
app.use(Sentry.Handlers.requestHandler());

// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler());
app.use(helmet());
app.use(morgan("dev"));
app.use(compression());
app.use(express.json());

var corsOptions = {
  origin: ["*"],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.get(
  "/v1/serviservice-two/debug-sentry",
  function mainHandler(_req: Request, _res: Response) {
    throw new Error("My first Sentry error!");
  }
);

app.get(
  "/v1/service-two/test",
  function mainHandler(_req: Request, res: Response) {
    res.json({
      message: "Sample Message from Venkat Starter Template from Service - 2",
    });
  }
);

app.use("/v1", api);

app.all("*", (req: Request, _res: Response, _next: NextFunction) => {
  throw new AppError(`Route ${req.originalUrl} not found`, 404);
});

const errorMiddlewareWrapper = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  errorMiddleware(error, req, res, next);
};

app.use(Sentry.Handlers.requestHandler());

app.use(errorMiddlewareWrapper);

app.use(Sentry.Handlers.errorHandler());

export default app;
