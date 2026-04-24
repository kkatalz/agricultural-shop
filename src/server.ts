import app from './app';
import { env } from './config/env';

app.listen(env.PORT, function (error?: Error) {
  if (error) {
    throw error;
  }

  console.log(`Server running on http://localhost:${env.PORT}`);
});
