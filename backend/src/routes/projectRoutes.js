import { Router } from "express";
import  {saveProject,getUserProject}  from "../controllers/project.controller.js";


const router = Router()

router.post("/save-project",saveProject)
router.get("/get-project",getUserProject)




export default router;