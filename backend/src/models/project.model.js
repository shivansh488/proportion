import mongoose from 'mongoose';


const cardSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    id: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        default: '',
        trim: true
    },
    column: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Column',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        immutable: true
    },
    assignedTo: {
        type: String,
        trim: true
    },
    order: {
        type: Number,
        default: 0,
        min: 0
    }
});

const columnSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    columnId: {
        type: String,
        required: true,
        unique: true
    },
    headingColor: {
        type: String,
        default: '#e2e8f0'
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    cards: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Card'
    }],
    order: {
        type: Number,
        default: 0,
        min: 0
    }
});

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        immutable: true
    },
    deadline: {
        type: Date
    },
    owner: {
        type: String,
        required: true
    },
    teamMembers: [{
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true
        }
    }],
    columns: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Column'
    }],
    status: {
        type: String,
        enum: ['Active', 'Pending', 'Completed'],
        default: 'active'
    }
});


const Card = mongoose.model('Card', cardSchema);
const Column = mongoose.model('Column', columnSchema);
const Project = mongoose.model('Project', projectSchema);

export { Card, Column, Project };