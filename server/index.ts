import { app } from './src/app'

const PORT:number = Number(process.env.PORT) || 8001;

app.listen(PORT, "0.0.0.0");