import React, { useState, useEffect } from 'react';

const AdminScreens = () => {
    const [screenNo, setScreenNo] = useState('');
    const [numRows, setNumRows] = useState('');
    const [seatsPerRow, setSeatsPerRow] = useState('');
    const [theatreId, setTheatreId] = useState('');
    const [classInfo, setClassInfo] = useState([{ classNo: '', className: '' }]);
    const [theatreMap, setTheatreMap] = useState({});
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchTheatres = async () => {
            try {
                const response = await fetch('http://localhost:5000/theatres');
                if (!response.ok) throw new Error('Failed to fetch theatres');
                const data = await response.json();
                const map = {};
                data.forEach(theatre => {
                    map[theatre._id] = theatre.theatrename;
                });
                setTheatreMap(map);
            } catch (error) {
                setError(error.message);
            }
        };

        fetchTheatres();
    }, []);

    const handleTheatreChange = (e) => {
        setTheatreId(e.target.value);
    };

    const handleClassInfoChange = (index, field, value) => {
        const updatedClassInfo = [...classInfo];
        updatedClassInfo[index][field] = value;
        setClassInfo(updatedClassInfo);
    };

    const addClassInfo = () => {
        setClassInfo([...classInfo, { classNo: '', className: '' }]);
    };

    const handleSubmit = async (e) => {  // Change here: make handleSubmit async
        e.preventDefault();

        const validSeatsArray = [];
        for (let i = 0; i < numRows; i++) {
            for (let j = 0; j < seatsPerRow; j++) {
                validSeatsArray.push(`${i}-${j}`);
            }
        }

        const screenData = {
            screenNo,
            classInfo,
            dim: { NumRows: numRows, SeatsPerRow: seatsPerRow },
            validSeats: validSeatsArray,
            theatreId: theatreId,
            selectedSeats: [], // This can be modified as needed
        };

        try {
            const response = await fetch('http://localhost:5000/screens', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(screenData), // Corrected from movieData to screenData
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error from server:', errorData);
                throw new Error('Failed to add screen');
            }
            alert('Screen details added successfully!');
        } catch (error) {
            setError(error.message); // Set the error state to display
        }

        // Reset form fields after submission
        setScreenNo('');
        setNumRows('');
        setSeatsPerRow('');
        setClassInfo([{ classNo: '', className: '' }]);
        setTheatreId('');
        setError('');
    };

    return (
        <div id="admin-screens" className="admin-card">
            <div className="admin-title">Add Screen</div>
            {error && <p className="error">{error}</p>}
            <form className="admin-form" onSubmit={handleSubmit}>
                <label htmlFor="admin-screenNoNew">Screen Number:</label>
                <input
                    type="number"
                    id="admin-screenNoNew"
                    value={screenNo}
                    onChange={(e) => setScreenNo(e.target.value)}
                    required
                />

                <label htmlFor="admin-screenRowsNew">Number of Rows:</label>
                <input
                    type="number"
                    id="admin-screenRowsNew"
                    value={numRows}
                    onChange={(e) => setNumRows(e.target.value)}
                    required
                />

                <label htmlFor="admin-seatsPerRowNew">Seats Per Row:</label>
                <input
                    type="number"
                    id="admin-seatsPerRowNew"
                    value={seatsPerRow}
                    onChange={(e) => setSeatsPerRow(e.target.value)}
                    required
                />

                {classInfo.map((cls, index) => (
                    <div key={index}>
                        <label htmlFor={`classNo-${index}`}>Class No:</label>
                        <input
                            type="number"
                            id={`classNo-${index}`}
                            value={cls.classNo}
                            onChange={(e) => handleClassInfoChange(index, 'classNo', e.target.value)}
                            required
                        />

                        <label htmlFor={`className-${index}`}>Class Name:</label>
                        <input
                            type="text"
                            id={`className-${index}`}
                            value={cls.className}
                            onChange={(e) => handleClassInfoChange(index, 'className', e.target.value)}
                            required
                        />
                    </div>
                ))}
                <button type="button" onClick={addClassInfo}>Add Class Info</button>

                <label htmlFor="admin-theatreIdNew">Theatre:</label>
                <select
                    id="admin-theatreIdNew"
                    value={theatreId}
                    onChange={handleTheatreChange}
                    required
                >
                    <option value="">Select Theatre</option>
                    {Object.entries(theatreMap).map(([id, name]) => (
                        <option key={id} value={id}>{name}</option>
                    ))}
                </select>

                <button type="submit">Add Screen</button>
            </form>
        </div>
    );
};

export default AdminScreens;
