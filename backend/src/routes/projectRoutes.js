import { Router } from "express";
import  {saveProject,getUserProject,addColumn,getProject, addCard}  from "../controllers/project.controller.js";


const router = Router()

router.post("/save-project",saveProject)
router.post("/get-user-project",getUserProject)
router.post("/add-column",addColumn)
router.post("/get-project",getProject)
router.post("/add-card",addCard)




export default router;