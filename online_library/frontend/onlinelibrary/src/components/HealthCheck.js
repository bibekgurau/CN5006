import React, { useState, useEffect } from 'react';
import { Container, Card, Alert, Button, Spinner, Badge } from 'react-bootstrap';
import { toast } from 'react-toastify';
import api from '../api';

function HealthCheck() {
  const [healthData, setHealthData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timestamp, setTimestamp] = useState(null);

  const checkHealth = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Check backend health
      const response = await api.get('/health');
      setHealthData(response);
      setTimestamp(new Date().toISOString());
      toast.success('Backend is healthy!');
    } catch (error) {
      console.error('Health check failed:', error);
      setError(error.message || 'Health check failed');
      toast.error('Backend is not responding');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  const getStatusBadge = (status) => {
    if (status === 'healthy') {
      return <Badge bg="success">Healthy</Badge>;
    } else {
      return <Badge bg="danger">Unhealthy</Badge>;
    }
  };

  const getDatabaseBadge = (status) => {
    if (status === 'connected') {
      return <Badge bg="success">Connected</Badge>;
    } else {
      return <Badge bg="danger">Disconnected</Badge>;
    }
  };

  return (
    <Container className="mt-4">
      <Card>
        <Card.Header as="h4" className="bg-info text-white d-flex justify-content-between align-items-center">
          <span>🏥 System Health Check</span>
          <Button 
            variant="light" 
            size="sm" 
            onClick={checkHealth}
            disabled={loading}
          >
            Refresh
          </Button>
        </Card.Header>
        
        <Card.Body>
          {loading ? (
            <div className="text-center">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Checking system health...</span>
              </Spinner>
              <p className="mt-3">Checking system health...</p>
            </div>
          ) : error ? (
            <Alert variant="danger">
              <Alert.Heading>System Unhealthy</Alert.Heading>
              <p>{error}</p>
              <p className="mb-0">
                The backend server may be down or not responding. 
                Please check if the backend is running on port 5000.
              </p>
            </Alert>
          ) : healthData ? (
            <>
              <Alert variant={healthData.status === 'healthy' ? 'success' : 'warning'}>
                <Alert.Heading>
                  System Status: {getStatusBadge(healthData.status)}
                </Alert.Heading>
                <p>
                  Backend service is {healthData.status}. 
                  {healthData.status === 'healthy' ? ' All systems operational.' : ' Some issues detected.'}
                </p>
                <hr />
                <div className="row">
                  <div className="col-md-6">
                    <p><strong>Service:</strong> {healthData.service}</p>
                    <p><strong>Version:</strong> {healthData.version}</p>
                  </div>
                  <div className="col-md-6">
                    <p><strong>Database:</strong> {getDatabaseBadge(healthData.database)}</p>
                    <p><strong>Timestamp:</strong> {new Date(healthData.timestamp).toLocaleString()}</p>
                  </div>
                </div>
              </Alert>

              <Card className="mt-4">
                <Card.Header>Connection Details</Card.Header>
                <Card.Body>
                  <div className="row">
                    <div className="col-md-6">
                      <h6>Frontend</h6>
                      <ul className="list-unstyled">
                        <li><strong>URL:</strong> {window.location.origin}</li>
                        <li><strong>Environment:</strong> {process.env.NODE_ENV || 'development'}</li>
                        <li><strong>API Base URL:</strong> {api.defaults.baseURL}</li>
                      </ul>
                    </div>
                    <div className="col-md-6">
                      <h6>Backend</h6>
                      <ul className="list-unstyled">
                        <li><strong>Status:</strong> {getStatusBadge(healthData.status)}</li>
                        <li><strong>Response Time:</strong> {timestamp ? 'Connected' : 'N/A'}</li>
                        <li><strong>Last Checked:</strong> {timestamp ? new Date(timestamp).toLocaleTimeString() : 'N/A'}</li>
                      </ul>
                    </div>
                  </div>
                </Card.Body>
              </Card>

              <div className="mt-4">
                <h5>Quick Tests</h5>
                <div className="d-flex gap-2">
                  <Button 
                    variant="outline-primary" 
                    size="sm"
                    onClick={async () => {
                      try {
                        const response = await api.get('/books');
                        toast.success(`Found ${response.count} books`);
                      } catch (error) {
                        toast.error('Failed to fetch books');
                      }
                    }}
                  >
                    Test Books API
                  </Button>
                  <Button 
                    variant="outline-secondary" 
                    size="sm"
                    onClick={() => window.open(api.defaults.baseURL.replace('/api', ''), '_blank')}
                  >
                    Open Backend
                  </Button>
                </div>
              </div>
            </>
          ) : null}
        </Card.Body>
        
        <Card.Footer className="text-muted">
          Last checked: {timestamp ? new Date(timestamp).toLocaleString() : 'Never'}
        </Card.Footer>
      </Card>
    </Container>
  );
}

export default HealthCheck;