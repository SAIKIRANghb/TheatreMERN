import React, { useState, useEffect } from 'react';

function WebPageTable() {
    const [webPages, setWebPages] = useState([]);

    // Fetch web pages from backend
    useEffect(() => {
        fetch('/api/webpage')  // Adjust the API endpoint as needed
            .then(response => response.json())
            .then(data => setWebPages(data))
            .catch(error => console.error('Error fetching web pages:', error));
    }, []);

    return (
        <div className="admin-webpage-panel">
            <h1>Web Pages</h1>
            <table id="admin-webpage-table" className="admin-table">
                <thead>
                    <tr>
                        <th>Logo URL</th>
                        <th>Theatre Name</th>
                        <th>Footer Content</th>
                    </tr>
                </thead>
                <tbody>
                    {webPages.map(page => (
                        <tr key={page._id}>
                            <td>{page.logoUrl}</td>
                            <td>{page.theatreName}</td>
                            <td>{page.footer}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default WebPageTable;
