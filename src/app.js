import express from 'express';
import opportunityRoutes from './routes/opportunityRoutes.js';
import { establishConnection } from './config/db.js';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the equivalent of __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware for JSON and CORS
app.use(express.json());
app.use(cors({origin:'*'}));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

app.use("/api",opportunityRoutes);


app.listen(7600,()=>{
    console.log("Server is running on port 7600");
    establishConnection();
 
});


