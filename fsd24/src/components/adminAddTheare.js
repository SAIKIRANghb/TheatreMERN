import React, { useState } from 'react';

function AdminTheatres() {
    const [theatreName, setTheatreName] = useState('');
    const [location, setLocation] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Construct the payload to be sent to the server
        const newTheatre = {
            theatrename: theatreName,
            location: location,
        };

        try {
            const response = await fetch('http://localhost:5000/theatres', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newTheatre),
            });

            if (!response.ok) {
                throw new Error('Failed to add theatre');
            }

            // Clear form and show success message
            setTheatreName('');
            setLocation('');
            setSuccess('Theatre added successfully!');
            setError(''); // Clear any previous errors
        } catch (err) {
            setError(err.message);
            setSuccess(''); // Clear any success message
        }
    };

    return (
        <div id="admin-theatres" className="admin-card">
            <div className="admin-title">Add Theatre</div>

            <form className="admin-form" onSubmit={handleSubmit}>
                {error && <p className="error" style={{color:'black'}}>{error}</p>}
                {success && <p className="success" style={{color:'black'}}>{success}</p>}

                <label htmlFor="admin-theatreNameNew">Theatre Name:</label>
                <input
                    type="text"
                    id="admin-theatreNameNew"
                    value={theatreName}
                    onChange={(e) => setTheatreName(e.target.value)}
                    required
                />

                <label htmlFor="admin-theatreLocationNew">Location:</label>
                <input
                    type="text"
                    id="admin-theatreLocationNew"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                />

                <button type="submit">Add Theatre</button>
            </form>
        </div>
    );
}

export default AdminTheatres;
