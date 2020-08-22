import React from "react";
import "./Lobby.css";
import { Button, Row, Col } from "react-bootstrap";
import JoinLobby from "./JoinLobby";
import CreateLobby from "./CreateLobby";

const Lobby = ({
  handleCreateLobby,
  handleJoinLobby,
  username,
  handleUsernameChange,
  roomName,
  handleRoomNameChange,
  handleSubmit,
}) => {
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
      {/* <JoinLobby
        username={username}
        roomName={roomName}
        handleUsernameChange={handleUsernameChange}
        handleRoomNameChange={handleRoomNameChange}
        handleSubmit={handleSubmit}
      />
      <CreateLobby
        username={username}
        roomName={roomName}
        handleUsernameChange={handleUsernameChange}
        handleRoomNameChange={handleRoomNameChange}
        handleSubmit={handleSubmit}
      /> */}
    </div>
  );
};

export default Lobby;
