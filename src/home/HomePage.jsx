import React from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
    const navigate = useNavigate();
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
            <h1>Smart Condominium</h1>
            <button
                style={{ marginTop: 20, padding: '10px 24px', fontSize: 16, borderRadius: 6, background: '#1976d2', color: '#fff', border: 'none', cursor: 'pointer' }}
                onClick={() => navigate('/login')}
            >
                Ir a Login
            </button>
        </div>
    );
};

export default HomePage;