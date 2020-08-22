import React, { useState, useEffect } from "react";
import Video from "twilio-video";
import Participant from "./Participant";
import { getRoom, setFireRoom, getFireTime } from "./utils";
import { Button, Card, Row, Col } from "react-bootstrap";
import "./Room.css";

const Room = ({
  roomName,
  token,
  handleLogout,
  workTime,
  breakTime,
  setWorkTime,
  setBreakTime,
}) => {
  const [room, setRoom] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [countTimer, setCountTimer] = useState(0);
  const [beginTime, setBeginTime] = useState(null);
  const [roomDetails, setRoomDetails] = useState(null);
  const [hour, setHours] = useState(null);
  const [min, setMin] = useState(null);
  const [sec, setSec] = useState(null);

  const startTimer = () => {
    setInterval(() => {
      if (beginTime) {
        const elapsed = new Date() - beginTime;
        setCountTimer(elapsed);
      }
    }, 1000);
  };

  useEffect(() => {
    setHours(("0" + Math.floor(countTimer / 3600000)).slice(-2));
    setMin(("0" + (Math.floor(countTimer / 60000) % 60)).slice(-2));
    setSec(("0" + (Math.floor(countTimer / 1000) % 60)).slice(-2));
  }, [countTimer]);

  useEffect(() => {
    startTimer();
  }, [beginTime]);

  useEffect(() => {
    const participantConnected = (participant) => {
      setParticipants((prevParticipants) => [...prevParticipants, participant]);
    };

    const participantDisconnected = (participant) => {
      setParticipants((prevParticipants) =>
        prevParticipants.filter((p) => p !== participant)
      );
    };

    Video.connect(token, {
      name: roomName,
    }).then(async (room) => {
      const rr = await getRoom({ sid: room.sid });
      if (workTime && breakTime) {
        await setFireRoom({
          sid: room.sid,
          workTime: workTime,
          breakTime: breakTime,
        });
      } else {
        const times = await getFireTime({ sid: room.sid });
        setBreakTime(times.data.restTime);
        setWorkTime(times.data.workTime);
      }
      if (rr.status === 200) {
        setRoomDetails(rr.data);
        setBeginTime(new Date(rr.data.dateCreated).getTime());
      }
      setRoom(room);
      room.on("participantConnected", participantConnected);
      room.on("participantDisconnected", participantDisconnected);
      room.participants.forEach(participantConnected);
    });

    return () => {
      setRoom((currentRoom) => {
        if (currentRoom && currentRoom.localParticipant.state === "connected") {
          currentRoom.localParticipant.tracks.forEach(function (
            trackPublication
          ) {
            trackPublication.track.stop();
          });

          currentRoom.disconnect();
          return null;
        } else {
          return currentRoom;
        }
      });
    };
  }, [roomName, token]);

  const remoteParticipants = participants.map((participant) => (
    <Participant key={participant.sid} participant={participant} />
  ));

  return (
    <div className="room">
      <Card className="localParticipantContainer">
        <Row>
          <Col className="text-left">
            <h5>
              Hi {room ? room.localParticipant.identity : null}, welcome to your
              Flock room!
            </h5>
            <h5>Room: {roomName}</h5>
            <p>Invite others by telling them your room name</p>
            <h5>
              Total Session Time: {beginTime ? hour + ":" + min + ":" + sec : 0}
            </h5>
            <br />
            <Button className="logoutBtn" onClick={handleLogout}>
              Log Out
            </Button>
          </Col>
          <Col>
            <div className="local-participant">
              {room ? (
                <Participant
                  key={room.localParticipant.sid}
                  participant={room.localParticipant}
                />
              ) : (
                ""
              )}
            </div>
          </Col>
        </Row>
      </Card>
      <h3>Remote Participants</h3>
      <div className="remote-participants">{remoteParticipants}</div>
    </div>
  );
};

export default Room;
