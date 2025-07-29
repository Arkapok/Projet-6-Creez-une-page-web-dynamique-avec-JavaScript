const backendUrl = "http://localhost:5678/api"; // Url to backend

async function fetchData(endpoint, method = "GET", secured = false, body = null) { //Data from backend
    try {
        let requestBody = body;
        let headers = {}

        if (body && typeof body === "object" && !(body instanceof FormData)) { // If not formdata setup JSON
            headers["Content-Type"] = "application/json"; // Set content for JSON    
            requestBody = JSON.stringify(body); // Convert to a JSON string
        }

        if (secured) { //Authentify request 
            const token = localStorage.getItem("token"); 
            if (token) {
                headers["Authorization"] = `Bearer ${token}`;
            } else {
                throw new Error("No token found for secured request");
            }
        }    
        
        const response = await fetch(`${backendUrl}/${endpoint}`, { // Send request 
            method: method,
            headers: headers,
            body: requestBody,
        });

        if (!response.ok) { // Response for error
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        if (response.status === 204) { 
            return null; 
        }

        return await response.json();
    } catch (error) { //  Response for error 
        console.error("Error fetching data:", error);
        throw error;
    }
}
