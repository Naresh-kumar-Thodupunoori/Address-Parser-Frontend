const API_URL = 'http://localhost:5000/api/societies';

export const fetchSocieties = async () => {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error('Failed to fetch societies');
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        return [];
    }
};

export const checkServiceability = async (data) => {
    try {
        const response = await fetch(`${API_URL}/check`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error('Failed to check serviceability');
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        return { societyName: 'Error', block: null, flat: null };
    }
};