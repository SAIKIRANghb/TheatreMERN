import React, { useState, useEffect } from 'react';
import {useParams} from 'react-router-dom';
function AdminSlotUpdateForm() {
    const [time, setTime] = useState('');
    const [date, setDate] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const slotParams = useParams();
    const slotId = slotParams.id;
    useEffect(() => {
        const fetchSlotDetails = async () => {
            try {
                const response = await fetch(`http://localhost:5001/slots/${slotId}`);
                if (!response.ok) throw new Error('Failed to fetch slot details');
                const data = await response.json();
                setTime(data.time);
                setDate(data.date.split("T")[0]); // To format the date for the input
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchSlotDetails();
    }, [slotId]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`http://localhost:5001/slots/${slotId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    time,
                    date
                }),
            });

            if (!response.ok) throw new Error('Failed to update slot');
            const updatedSlot = await response.json();
            alert('Slot Updated');
            setTime('');
            setDate('');
        } catch (error) {
            setError(error.message);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div id="admin-slot-update" className="admin-card">
            <div className="admin-title">Update Slot</div>
            <form className="admin-form" onSubmit={handleSubmit}>
                <label htmlFor="admin-slotTimeUpdate">Time:</label>
                <input
                    type="text"
                    id="admin-slotTimeUpdate"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    required
                />

                <label htmlFor="admin-slotDateUpdate">Date:</label>
                <input
                    type="date"
                    id="admin-slotDateUpdate"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                />
                <button type="submit">Update Slot</button>
            </form>
        </div>
    );
}

export default AdminSlotUpdateForm;
