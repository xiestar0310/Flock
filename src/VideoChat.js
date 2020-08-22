import React, { useState, useCallback } from "react";
import Lobby from "./Lobby";
import Room from "./Room";
import CreateLobby from "./CreateLobby";
import JoinLobby from "./JoinLobby";

const VideoChat = () => {
  const [createLobby, setCreateLobby] = useState(false);
  const [joinLobby, setJoinLobby] = useState(false);
  const [username, setUsername] = useState("");
  const [roomName, setRoomName] = useState("");
  const [workTime, setWorkTime] = useState("");
  const [breakTime, setBreakTime] = useState("");
  const [token, setToken] = useState(null);

  const handleCreateLobby = useCallback((event) => {
    setCreateLobby(true);
  }, []);

  const handleJoinLobby = useCallback((event) => {
    setJoinLobby(true);
  }, []);

  const handleUsernameChange = useCallback((event) => {
    setUsername(event.target.value);
  }, []);

  const handleRoomNameChange = useCallback((event) => {
    setRoomName(event.target.value);
  }, []);

  const handleWorkTimeChange = useCallback((event) => {
    setWorkTime(event.target.value); // minutes str needs to be converted to JS time obj
  }, []);

  const handleBreakTimeChange = useCallback((event) => {
    setBreakTime(event.target.value); // minutes str needs to be converted to JS time obj
  }, []);

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      const data = await fetch("/video/token", {
        method: "POST",
        body: JSON.stringify({
          identity: username,
          room: roomName,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => res.json());
      setToken(data.token);
    },
    [roomName, username]
  );

  const handleLogout = useCallback((event) => {
    setToken(null);
  }, []);

  let render;
  if (token) {
    render = (
      <Room roomName={roomName} token={token} handleLogout={handleLogout} workTime={workTime} breakTime={breakTime} setWorkTime={setWorkTime} setBreakTime={setBreakTime}/>
    );
  } else if (createLobby) {
    render = (
      <CreateLobby
        username={username}
        roomName={roomName}
        workTime={workTime}
        breakTime={breakTime}
        handleUsernameChange={handleUsernameChange}
        handleRoomNameChange={handleRoomNameChange}
        handleWorkTimeChange={handleWorkTimeChange}
        handleBreakTimeChange={handleBreakTimeChange}
        handleSubmit={handleSubmit}
      />
    );
  } else if (joinLobby) {
    render = (
      <JoinLobby
        username={username}
        roomName={roomName}
        handleUsernameChange={handleUsernameChange}
        handleRoomNameChange={handleRoomNameChange}
        handleSubmit={handleSubmit}
      />
    );
  } else {
    render = (
      <Lobby
        handleCreateLobby={handleCreateLobby}
        handleJoinLobby={handleJoinLobby}
      />
    );
  }
  return render;
};

export default VideoChat;
