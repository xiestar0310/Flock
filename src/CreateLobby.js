import React from "react";
import "./Lobby.css";
import { Form, Button, Row, Col, Alert } from "react-bootstrap";

const CreateLobby = ({
  username,
  handleUsernameChange,
  roomName,
  handleRoomNameChange,
  workTime,
  handleWorkTimeChange,
  breakTime,
  handleBreakTimeChange,
  handleSubmit,
}) => {
  return (
    <div className="lobbyContainer">
      <h3>Create a Room</h3>
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>Name:</Form.Label>
          <Form.Control
            type="text"
            id="field"
            value={username}
            onChange={handleUsernameChange}
            required
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Room Name: </Form.Label>
          <Form.Control
            type="text"
            id="room"
            value={roomName}
            onChange={handleRoomNameChange}
            required
          />
        </Form.Group>

        <Alert variant="info" className="pomodoro">
          We recommend scheduling 25 minutes of work with 5 minute breaks
          according to the pomodoro technique.{" "}
          <a
            target="_blank"
            href="https://en.wikipedia.org/wiki/Pomodoro_Technique"
          >
            Learn more here!
          </a>
        </Alert>

        <Row>
          <Col>
            <Form.Label>Work Time: </Form.Label>
            <Form.Control
              type="number"
              id="worktime"
              value={workTime}
              onChange={handleWorkTimeChange}
              placeholder="minutes"
              required
            ></Form.Control>
          </Col>
          <Col>
            <Form.Label>Break Time: </Form.Label>
            <Form.Control
              type="number"
              id="breaktime"
              value={breakTime}
              onChange={handleBreakTimeChange}
              placeholder="minutes"
              required
            />
          </Col>
        </Row>
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </div>
  );
};

export default CreateLobby;
