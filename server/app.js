import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import studentRouter from './routers/student.js';
import topicRouter from './routers/topic.js';
import activityRouter from './routers/activity.js';

const app = express();

app.use(
  cors({
    origin: true,
  }),
);
app.use(express.json());

const VERSIONED_API_PATH = '/api/v1';

app.use(VERSIONED_API_PATH, studentRouter);
app.use(VERSIONED_API_PATH, topicRouter);
app.use(VERSIONED_API_PATH, activityRouter);

const PORT = process.env.PORT ?? 8080;

const server = app.listen(PORT, () =>
  console.log('Server is running on port', server.address().port),
);
