async function testApi() {
  try {
    const loginRes = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'fleetmanager@transitops.in',
        password: 'Password123!',
        role: 'Fleet Manager'
      })
    });
    const loginData = await loginRes.json();
    const token = loginData.token;
    console.log('Login successful');

    const vehiclesRes = await fetch('http://localhost:5000/api/vehicles', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (!vehiclesRes.ok) {
      console.log('Error status:', vehiclesRes.status);
      console.log(await vehiclesRes.text());
      return;
    }

    const vehiclesData = await vehiclesRes.json();
    console.log('Vehicles fetched:', vehiclesData.length);
    console.log(vehiclesData[0]);
  } catch (err) {
    console.error('API Error:', err);
  }
}

testApi();
