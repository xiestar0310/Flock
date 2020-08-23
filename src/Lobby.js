import React, { useState } from "react";
import "./Lobby.css";
import { Button, Row, Col, Modal, Container } from "react-bootstrap";
import FlyingGoose from "./assets/goose-fly.png";
import VirtualGraphic from "./assets/undraw_Team_page_re_cffb.png";

const Lobby = ({ handleCreateLobby, handleJoinLobby }) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div className="homeLobbyContainer">
      <Row>
        <Col md={6}>
          <h3>Welcome to Flock</h3>
          <h6>A video calling platform for productive group work</h6>
          <Button
            className="smallMargin"
            variant="secondary"
            onClick={handleShow}
          >
            What the Flock?
          </Button>

          <hr />

          <Container className="lobbyOptions">
            <h6 className="smallMargin">
              Choose to create or join a room ...{" "}
            </h6>
            <Row>
              <Col className="text-right">
                <Button onClick={handleCreateLobby}>Create</Button>
              </Col>
              <Col className="text-left">
                <Button onClick={handleJoinLobby}>Join</Button>
              </Col>
            </Row>
          </Container>

          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>What the Flock?</Modal.Title>
            </Modal.Header>
            <Modal.Body className="flockModalBody">
              <h6>What is Flock?</h6>
              <p>
                Flock is a real-world implementation of a video platform
                inspired by the Pomodoro technique that is used for more
                effective studying and work habits. Flock allows users to set a
                study break after a given amount of time to balance
                psychological and physical wellbeing with online work and
                studying.
              </p>
              <h6>How can I use Flock?</h6>
              <ul>
                <li>Creating Meetings</li>
                <ul>
                  <li>
                    Simply enter your name, create a meeting code, and enter the
                    duration you would like for your break time and work time.
                  </li>
                </ul>
                <li>Entering Meetings</li>
                <ul>
                  <li>
                    Enter your name, and enter in the given meeting code by the
                    host of the meeting, and you will join the call.
                  </li>
                </ul>
              </ul>
              <h6>Why is Flock important?</h6>
              <p>
                Due to COVID, screen time through calling for work and studying
                has increased dramatically, increasing an average of around 20%
                for all countries affected by the pandemic. Long sitting times
                in front of a screen can lead to eye strain, loss in
                productivity, and fatigue and carpal tunnel syndrome. After
                having to sit through hour-long meetings, we realized there was
                a need to have a better platform that encourages productivity
                alongside one’s personal wellbeing - and Flock was born.{" "}
              </p>
              <h6>Our vision for future flocks of users</h6>
              <p>
                We value the mental and physical wellbeing, and hope that
                whether our application be used for study groups to improve
                productivity, or be used in a corporate setting; breaks are
                being implemented to better the health of everyone.{" "}
              </p>
            </Modal.Body>
            <Modal.Footer>
              <img className="flockPic" src={FlyingGoose} />
            </Modal.Footer>
          </Modal>
        </Col>
        <Col md={6}>
          <img className="undrawPic" src={VirtualGraphic} />
        </Col>
      </Row>
    </div>
  );
};

export default Lobby;
