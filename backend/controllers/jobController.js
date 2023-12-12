import { json } from "express";
import Jobs from "../models/JobSchema.js";
import Seekers from "../models/SeekerSchema.js"
import {
    handleNotFound,
	handleSuccess,
	handleServerError,
    handleBadRequest,
    } from "../utils/handler.js";
import {getDistanceBetweenAddresses, distance} from '../utils/controllerFunctions.js'

/**
 * 
 * Gets all the jobs in the database
 */
export const getJobs = async (req, res) => {
    try {
        const currentTime = new Date();
        const jobs = await Jobs.find({ "time.0": { $gte: currentTime } });

        if (!jobs) {
            return handleNotFound(res, "No Jobs");
        }

        return handleSuccess(res, jobs);
    } catch (error) {
        return handleServerError(res, error);
    }
}


/**
 * Takes in an id and it returns the Job object associated 
 * with this id
 */
export const getJob = async (req, res) => {
    const { id } = req.params;

    try {
        const job = await Jobs.findById(id);

		if (!job) {
			return handleNotFound(res, "Job not found.");
		}

		return handleSuccess(res, job);
    } catch (error) {
        return handleServerError(res, error);
    }
};

/**
 * Takes in an id and it removes that specific job from
 * the database then returns the message "Sucessfully deleted"
 */
export const deleteJobsByID = async (req, res) => {
    const { id } = req.params;

    try {
        const deleteJob = await Jobs.findByIdAndRemove(id);

		if (!deleteJob) {
			return handleNotFound(res, "Job not found");
		}

		return handleSuccess(res, deleteJob);
    } catch (error) {
        return handleServerError(res, error);
    }
}; 



/**
 * This takes in 
 * (title, description, pay, location, categories, time, date_posted) as
 * the inputs and then creates a job object in the database.
 * it also returns the created job. 
 */
export const postJobs = async (req, res) => {
    const { 
        title, 
        job_poster,
        description, 
        pay, 
        location, 
        categories, 
        time, 
        date_posted,
        job_type,
        poster_email
    } = req.body;

    try {

        const makeJob = new Jobs({
            title,
            job_poster,
            description,
            pay,
            location,
            categories,
            job_type,
            time,
            date_posted,
            hired: false,
            acceptedApplicant: "",
            rejectedApplicants: [],
            job_poster_email: poster_email,
            saved_applicants: []
        });

        console.log(poster_email)
        const newJob = await makeJob.save();
        return handleSuccess(res, newJob);
    } catch (error) {
        console.log(error)
        return handleServerError(res, error);
    }
};

/**
 * This takes in and id and 
 * (title, description, pay, location, categories, time, date_posted) as
 * the inputs and then edits the job object in the database.
 * Then it returns the edited Job object. 
 */
export const updateJobs = async (req, res) => {
    const { id } = req.params;
    // set values to be updated to empty
    const updateFields = {}; 

    try {
        // for any key that's not an empty value we add to 
        // the to be updated listed
        for (const key in req.body) {
            if (req.body[key] !== undefined) {
                updateFields[key] = req.body[key];
            }
        };

        if (Object.keys(updateFields).length === 0) {
            return handleBadRequest(res, "Nothing to update");
        }

        // get all jobs applied to
        // get all applicants applied to my job

		updateFields.updatedAt = Date.now();

        // the $set allows us to set specific keys to a new value
		const editJob = await Jobs.findByIdAndUpdate(
			id,
			{$set: updateFields},
			{
				new: true,
			}
		);

		if (!editJob) {
			return handleNotFound(res, "Job not found");
		}

		return handleSuccess(res, editJob);
    } catch (error) {
        return handleServerError(res, error);
    }
};

/*
* find jobs by each filtering option.
* filters include: location, job category. duration, pay, on/off campus
*/
export const filterJobs = async (req, res) => {
    
    const job_Category = req.params.category.split(",");
    console.log(job_Category, "asdf")

    const currentTime = new Date();

    try { 
            // Create a query object to build the filter criteria
            const query = {};
            query.$and = []

            // Add filters based on the request parameters
            if (job_Category[0] != "*") {  

                const jobs = await Jobs.find({
                    "time.0": { $gte: currentTime }, 
                    categories: { 
                        $all: job_Category, 
                    } 
                });
                return handleSuccess(res, jobs);
            } 

    } catch (error) {
        return handleServerError(res, error);
    }
}


export const searchJobs = async (req, res) => {
    try {
        const searchContent = req.params.searchContent;
        const newsearch = searchContent.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const searchRegex = new RegExp(newsearch, 'i');
        const currentTime = new Date();
        if (searchContent === " ") {
            const jobs = await Jobs.find({ "time.0": { $gte: currentTime } });

            if (!jobs) {
                return handleNotFound(res, "No Jobs");
            }
            return handleSuccess(res, jobs)
        } else {

            // Query the database
            const jobs = await Jobs.find({ 
                $or: [
                    { title: { $regex: searchRegex } },
                    { job_poster: { $regex: searchRegex } },
                    { description: { $regex: searchRegex } },
                    { location: { $regex: searchRegex } }
                ], "time.0": { $gte: currentTime }
            });
            // Return the found jobs
            return handleSuccess(res, jobs);
        }
    } catch(error) {
        return handleServerError(error);
    }
}

