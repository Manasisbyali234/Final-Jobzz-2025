import React from "react";
import {
  Navbar,
  Nav,
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  InputGroup,
} from "react-bootstrap";
import { FaBriefcase, FaCalculator, FaCode, FaUsers } from "react-icons/fa";

const ORANGE = "#ff5a1f";
const DARK_GREY = "#333333";
const LIGHT_GREY_TEXT = "#6c757d";

const categories = [
  { name: "Management", jobs: 70, Icon: FaBriefcase },
  { name: "Accountant", jobs: 65, Icon: FaCalculator },
  { name: "Software", jobs: 55, Icon: FaCode },
  { name: "Human Resource", jobs: 45, Icon: FaUsers },
];

const HeroSection = () => {
  return (
    <div style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      {/* Top Navbar */}
      <Navbar bg="white" expand="lg" className="shadow-sm" sticky="top">
        <Container>
          {/* Left: Logo */}
          <Navbar.Brand href="#" className="fw-bold" style={{ color: DARK_GREY }}>
            <span style={{ color: ORANGE }}>T</span>aleGlobal
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="main-navbar" />
          <Navbar.Collapse id="main-navbar">
            {/* Center: Navigation */}
            <Nav className="mx-auto text-center">
              <Nav.Link href="#" className="px-3" style={{ color: DARK_GREY }}>
                Home
              </Nav.Link>
              <Nav.Link href="#" className="px-3" style={{ color: DARK_GREY }}>
                Jobs
              </Nav.Link>
              <Nav.Link href="#" className="px-3" style={{ color: DARK_GREY }}>
                Employers
              </Nav.Link>
              <Nav.Link href="#" className="px-3" style={{ color: DARK_GREY }}>
                Contact Us
              </Nav.Link>
            </Nav>

            {/* Right: Auth Buttons */}
            <div className="d-flex align-items-center gap-2 ms-lg-auto mt-3 mt-lg-0">
              <Button
                variant="light"
                className="rounded-pill px-4"
                style={{ backgroundColor: "#f1f1f1", border: "none", color: DARK_GREY }}
              >
                Sign Up
              </Button>
              <Button
                className="rounded-pill px-4"
                style={{ backgroundColor: ORANGE, border: "none" }}
              >
                Sign In
              </Button>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Hero Section */}
      <Container className="py-5">
        <Row className="justify-content-center text-center">
          <Col lg={10} xl={8}>
            <h1 className="fw-bold display-5" style={{ color: DARK_GREY, lineHeight: 1.2 }}>
              Find the <span style={{ color: ORANGE }}>job</span> that fits your life
            </h1>
            <p className="mt-3 mb-4" style={{ color: LIGHT_GREY_TEXT, fontSize: "1.05rem" }}>
              Type your keyword, then click search to find your perfect job.
            </p>
          </Col>
        </Row>

        {/* Search Card */}
        <Row className="justify-content-center">
          <Col lg={10} xl={8}>
            <Card className="shadow-sm rounded-4 border-0">
              <Card.Body className="p-3 p-md-4">
                <Form onSubmit={(e) => e.preventDefault()}>
                  <Row className="g-3 align-items-center">
                    {/* WHAT */}
                    <Col xs={12} md={3}>
                      <Form.Label className="mb-1 fw-semibold" style={{ color: DARK_GREY }}>
                        WHAT
                      </Form.Label>
                      <Form.Select className="rounded-3" defaultValue="Job Title">
                        <option>Job Title</option>
                        <option>Company</option>
                        <option>Keyword</option>
                      </Form.Select>
                    </Col>

                    {/* TYPE */}
                    <Col xs={12} md={3}>
                      <Form.Label className="mb-1 fw-semibold" style={{ color: DARK_GREY }}>
                        TYPE
                      </Form.Label>
                      <Form.Select className="rounded-3" defaultValue="All Category">
                        <option>All Category</option>
                        <option>Full Time</option>
                        <option>Part Time</option>
                        <option>Contract</option>
                        <option>Internship</option>
                      </Form.Select>
                    </Col>

                    {/* LOCATION */}
                    <Col xs={12} md={4}>
                      <Form.Label className="mb-1 fw-semibold" style={{ color: DARK_GREY }}>
                        LOCATION
                      </Form.Label>
                      <InputGroup>
                        <InputGroup.Text className="bg-white border-end-0 rounded-start-3">
                          🔍
                        </InputGroup.Text>
                        <Form.Control
                          placeholder="Search..."
                          className="rounded-end-3"
                          style={{ borderLeft: "0" }}
                        />
                      </InputGroup>
                    </Col>

                    {/* BUTTON */}
                    <Col xs={12} md={2} className="d-grid">
                      <Form.Label className="mb-1 opacity-0">Find Job</Form.Label>
                      <Button
                        type="submit"
                        className="rounded-pill py-2"
                        style={{ backgroundColor: ORANGE, border: "none" }}
                      >
                        Find Job
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Job Categories */}
        <Row className="justify-content-center mt-4">
          <Col lg={10} xl={8}>
            <div className="d-flex gap-3 pb-2" style={{ overflow: "hidden" }}>
              {categories.map((cat) => (
                <Card
                  key={cat.name}
                  className="border-0 shadow-sm rounded-4 flex-shrink-1 flex-grow-1"
                  style={{ minWidth: 140, flex: "1 1 140px" }}
                >
                  <Card.Body className="text-center">
                    {/* Small orange icon */}
                    <div
                      className="mx-auto mb-3"
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        backgroundColor: ORANGE,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        fontWeight: 700,
                      }}
                      aria-hidden="true"
                      title={cat.name}
                    >
                      {cat.Icon ? <cat.Icon size={18} /> : "•"}
                    </div>

                    {/* Jobs count */}
                    <div className="text-muted" style={{ color: LIGHT_GREY_TEXT }}>
                      {cat.jobs} Jobs
                    </div>

                    {/* Category name */}
                    <div className="fw-semibold mt-1" style={{ color: DARK_GREY }}>
                      {cat.name}
                    </div>
                  </Card.Body>
                </Card>
              ))}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default HeroSection;