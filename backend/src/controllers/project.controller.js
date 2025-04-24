import mongoose from "mongoose";
import { Column, Project ,Card} from "../models/project.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
const saveProject=asyncHandler(async(req,res)=>{
    
        const {title,description,createdAt,deadline,owner,teamMembers,status}=req.body
        if ([title, description, createdAt, deadline, status].some(field => typeof field === "string" && field.trim() === "")) {
            throw new ApiError(400, "All fields are required and cannot be empty");
        }
        
          if (teamMembers.length === 0) {
            throw new ApiError(400,"teamMembers cannot be empty")
          }
        
          if (Object.keys(owner).length === 0) {
            throw new ApiError(400,"owner cannot be empty")
          }
          const project=await Project.create({
            title:title,
            description:description,
            createdAt:createdAt,
            deadline:deadline,
            owner:owner,
            teamMembers:teamMembers,
            status:status
          })
          const createdProject=await Project.findById(project._id)
          if(!createdProject){
            throw new ApiError(500,"project not created successfully")
          }
          return res.status(201).json(new ApiResponse(200,createdProject," project created  Successfully"))
})
const getUserProject=asyncHandler(async(req,res)=>{
const {email}=req.body
if(!email){
   throw new ApiError(400,"user email not received")
}
const projects = await Project.find({ "owner": email });

if (!projects || projects.length === 0) {
    throw new ApiError(404, "No projects found for the given email");
    
}
return res.status(200).json(new ApiResponse(200, projects, "Projects retrieved successfully"));
})
const addColumn = asyncHandler(async (req, res) => {
  const session = await mongoose.startSession();
  
  try {
    session.startTransaction();

    const { title, projectId, headingColor } = req.body;

    if (!title || !projectId) {
      throw new ApiError(400, "Title and projectId are required");
    }

    const project = await Project.findById(projectId).session(session);
    if (!project) {
      throw new ApiError(404, "No project with this ID was found");
    }

    const lastColumn = await Column.findOne({ project: projectId })
      .sort({ order: -1 })
      .session(session);
    const newOrder = lastColumn ? lastColumn.order + 1 : 0;

    const newColumn = new Column({
      title,
      project: projectId,
      headingColor,
      columnId: `col-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      order: newOrder
    });

    await newColumn.save({ session });
    await Project.findByIdAndUpdate(
      projectId,
      { $push: { columns: newColumn._id } },
      { session, new: true }
    );

    await session.commitTransaction();
    
 
    const savedColumn = await Column.findById(newColumn._id).populate('cards');
    
    res.status(201).json(new ApiResponse(200, savedColumn, "Column saved successfully"));
  } catch (error) {
    await session.abortTransaction();
    throw error; 
  } finally {
    session.endSession(); 
  }
});
const getProject = asyncHandler(async (req, res) => {
  const { projectId } = req.body;

  if (!projectId) {
    throw new ApiError(400, "Project ID is required");
  }

  const project = await Project.findById(projectId)  

  const columns=project.columns.map(async (column) => {
    const col = await Column.findById(column).populate('cards');
    return col
  })
  const populatedColumns = await Promise.all(columns)
  project.columns=populatedColumns
  console.log(project)
  if (!project) {
    throw new ApiError(404, "No project with this ID was found");
  }
  res.status(200).json(new ApiResponse(200, project, "Project retrieved successfully"));
})
const addCard=asyncHandler(async(req,res)=>{
  const session = await mongoose.startSession();
  try{
    session.startTransaction();
    const {title,columnId}=req.body
    if(!title || !columnId){
      throw new ApiError(400,"title and columnId are required")
    }
    const column=await Column.findById(columnId).session(session)
    if(!column){
      throw new ApiError(404,"No column with this ID was found")
    }
    const lastCard=await Card.findOne({column:columnId}).sort({order:-1}).session(session)
    const newOrder=lastCard?lastCard.order+1:0
    const newCard=new Card({
      title:title,
      order:newOrder,
      column:columnId
    })
    await newCard.save({session})
    await Column.findByIdAndUpdate(columnId,{$push:{cards:newCard._id}},{session,new:true})
    await session.commitTransaction()
    const savedCard=await Card.findById(newCard._id).populate('column')
    res.status(201).json(new ApiResponse(200,savedCard,"Card saved successfully"))

  }catch(err){
    await session.abortTransaction();
    console.error("Error while adding card:", err);
    throw new ApiError(500,"Error while adding card")

  }

})



export  {saveProject,getUserProject,addColumn,getProject,addCard}
