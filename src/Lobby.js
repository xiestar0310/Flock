import React from "react";
import "./Lobby.css";
import { Button, Row, Col } from "react-bootstrap";

const Lobby = ({ handleCreateLobby, handleJoinLobby }) => {
  return (
    <div className="lobbyContainer">
      <h3>Welcome to Flock</h3>
      <h6>A video calling platform for productive group work</h6>
      <Row className="lobbyOptions">
        <Col className="text-right">
          <Button onClick={handleCreateLobby}>Create</Button>
        </Col>
        <Col className="text-left">
          <Button onClick={handleJoinLobby}>Join</Button>
        </Col>
      </Row>
    </div>
  );
};

export default Lobby;
