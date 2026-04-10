import React, { useState } from "react";
import axios from "axios";
import { Container, Row, Col, Form, Button, Alert, Spinner, Badge } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);

  const handleQuerySubmit = async (e) => {
    e.preventDefault();
    setResponse("");
    setError("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:3000/api/query", { query });
      setResponse(res.data.response);
      
      // Add to history
      setHistory([
        { query, response: res.data.response, timestamp: new Date().toLocaleTimeString() },
        ...history
      ].slice(0, 10)); // Keep last 10 queries
      
      setQuery(""); // Clear input after successful query
    } catch (err) {
      setError("Failed to fetch response. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleHistoryClick = (item) => {
    setQuery(item.query);
    setResponse(item.response);
  };

  const clearHistory = () => {
    setHistory([]);
  };

  return (
    <Container className="mt-5">
      {/* Loading Overlay */}
      {loading && (
        <div className="loading-overlay">
          <div className="loading-content">
            <Spinner animation="border" variant="light" size="lg" />
            <p className="mt-3 text-white">Processing your query...</p>
          </div>
        </div>
      )}

      <Row className="justify-content-center">
        <Col md={10}>
          <h1 className="text-center mb-4" style={{ color: "#2c3e50" }}>
            AI Query Generator
          </h1>
          
          <Row className="mb-4">
            <Col md={8}>
              <Form onSubmit={handleQuerySubmit}>
                <Form.Group className="mb-3" controlId="queryInput">
                  <Form.Label><strong>Ask a Question:</strong></Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Type your query here... (e.g., What is the population of earth?)"
                    required
                    disabled={loading}
                  />
                </Form.Group>
                <div className="text-center">
                  <Button
                    type="submit"
                    variant="success"
                    disabled={loading || !query.trim()}
                    className="px-5"
                    size="lg"
                  >
                    {loading ? (
                      <>
                        <Spinner animation="border" size="sm" className="me-2" /> Processing
                      </>
                    ) : (
                      "Submit Query"
                    )}
                  </Button>
                </div>
              </Form>

              {error && (
                <Alert variant="danger" className="mt-3">
                  ❌ {error}
                </Alert>
              )}

              {response && (
                <Form.Group className="mt-4" controlId="responseOutput">
                  <Form.Label><strong>Generated Response:</strong></Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    value={response}
                    readOnly
                    className="bg-light"
                  />
                </Form.Group>
              )}
            </Col>

            {/* Query History Sidebar */}
            <Col md={4}>
              <div className="history-box p-3 bg-light rounded">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="mb-0"><strong>📋 Query History</strong></h6>
                  {history.length > 0 && (
                    <Badge bg="secondary" className="cursor-pointer" onClick={clearHistory}>
                      Clear
                    </Badge>
                  )}
                </div>

                {history.length === 0 ? (
                  <p className="text-muted small">No queries yet. Start asking!</p>
                ) : (
                  <div className="history-list">
                    {history.map((item, idx) => (
                      <div
                        key={idx}
                        className="history-item p-2 mb-2 rounded bg-white border cursor-pointer"
                        onClick={() => handleHistoryClick(item)}
                        style={{ cursor: "pointer", transition: "all 0.3s" }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f8f9fa"}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "white"}
                      >
                        <p className="mb-1 small"><strong>Q:</strong> {item.query.substring(0, 50)}...</p>
                        <p className="mb-0 text-muted tiny">{item.timestamp}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

export default App;
