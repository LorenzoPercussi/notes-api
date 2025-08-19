import { app } from "./app";
import { PORT, NODE_ENV } from "./config/env";

app.listen(PORT, () => {
  console.log(`Server rodando em http://localhost:${PORT} (env: ${NODE_ENV})`);
});
