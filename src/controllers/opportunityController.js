import { createConnectionObject } from "../config/db.js";

const connection = createConnectionObject();

export function saveOpportunity(request, response) {
    try {
        const { title, description, location, requirements, date, image } = request.body;

        // Basic backend validation for required fields
        if (!title || !description || !location || !requirements || !date) {
            return response.status(400).send({ message: "All fields are required." });
        }

        // Ensure the date is in the future
        const opportunityDate = new Date(date);
        const today = new Date();
        if (opportunityDate <= today) {
            return response.status(400).send({ message: "The opportunity date must be in the future." });
        }

        // Check image format if image is present (checks for a base64 JPEG prefix)
        if (image && !image.startsWith('/9j/')) {
            return response.status(400).send({ message: "Invalid image format." });
        }

        // Convert the Base64 image back into a Buffer
        const imageBuffer = image ? Buffer.from(image, 'base64') : null;

        const insertQry = `INSERT INTO opportunities (title, description, location, requirements, date, image) VALUES (?, ?, ?, ?, ?, ?)`;
        const values = [title, description, location, requirements, date, imageBuffer];
        
        connection.query(insertQry, values, (error) => {
            if (error) {
                console.log(error);
                return response.status(500).send({ message: "Failed to save opportunity" });
            }
            response.status(201).send({ message: "Opportunity saved successfully" });
        });
    } catch (error) {
        console.log(error);
        response.status(500).send({ message: "Something went wrong" });
    }
}


export function getAllOpportunity(request, response) {
    try {
        const fetchQry = "SELECT * FROM OPPORTUNITIES";
        connection.query(fetchQry, (error, result) => {
            if (error) {
                console.log(error);
                response.status(500).send({ message: "Something went wrong" });
            } else {
                // Convert image buffer to Base64 string before sending the response
                const opportunitiesWithBase64Images = result.map(opportunity => {
                    if (opportunity.image) {
                        opportunity.image = opportunity.image.toString('base64');
                    }
                    return opportunity;
                });

                response.status(200).send(opportunitiesWithBase64Images);
            }
        });
    } catch (error) {
        console.log(error);
        response.status(500).send({ message: "Something went wrong" });
    }
}


export function deleteOpportunity(req, res) {
    const { id } = req.params;
    const query = "DELETE FROM opportunities WHERE id = ?";
    
    connection.query(query, [id], (error) => {
        if (error) {
            console.error(error);
            return res.status(500).send({ message: "Failed to delete opportunity" });
        }
        res.status(200).send({ message: "Opportunity deleted successfully" });
    });
}

export function updateOpportunity(req, res) {
    const { id } = req.params;
    const { title, description, location, requirements, date, image } = req.body;

    // If a new image is uploaded, convert the image to a buffer
    let imageBuffer = image ? Buffer.from(image, 'base64') : null;

    const query = `
        UPDATE opportunities 
        SET title = ?, description = ?, location = ?, requirements = ?, date = ?, image = ? 
        WHERE id = ?
    `;
    
    const values = [title, description, location, requirements, date, imageBuffer, id];

    connection.query(query, values, (error, result) => {
        if (error) {
            console.error(error);
            return res.status(500).send({ message: "Failed to update opportunity" });
        }

        if (result.affectedRows === 0) {
            return res.status(404).send({ message: "Opportunity not found" });
        }

        res.status(200).send({ message: "Opportunity updated successfully", result });
    });
}

