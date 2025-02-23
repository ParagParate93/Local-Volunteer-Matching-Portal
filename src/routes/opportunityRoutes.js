import {Router} from 'express';
import { saveOpportunity, getAllOpportunity, updateOpportunity, deleteOpportunity } from '../controllers/opportunityController.js';


const opportunityRoutes = Router();

opportunityRoutes.post("/save",saveOpportunity);
opportunityRoutes.get("/getAll",getAllOpportunity);
opportunityRoutes.put("/update/:id", updateOpportunity);
opportunityRoutes.delete("/delete/:id", deleteOpportunity);

export default opportunityRoutes;

