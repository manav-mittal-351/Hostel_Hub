const axios = require('axios');

async function testApi() {
    try {
        const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
            email: 'manav@gmail.com',
            password: 'password123' // hope this is the pass
        });
        const token = loginRes.data.token;
        console.log('Login successful');

        const profileRes = await axios.get('http://localhost:5000/api/auth/profile', {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Profile fetched:', profileRes.data.name);

        const complaintsRes = await axios.get('http://localhost:5000/api/complaints/my', {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Complaints found:', complaintsRes.data.length);

    } catch (error) {
        console.error('API Test failed:', error.message);
        if (error.response) console.error('Data:', error.response.data);
    }
}

testApi();
