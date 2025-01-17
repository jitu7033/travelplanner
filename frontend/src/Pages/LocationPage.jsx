import React from 'react';
import { useNavigate } from 'react-router-dom';

const LocationPage = () => {
  const navigate = useNavigate();

  React.useEffect(() => {
    // Navigate programmatically to avoid a refresh
    navigate("/location");
  }, [navigate]);

  return (
    <div>LocationPage</div>
  );
};

export default LocationPage;
