import React, { useState, useEffect, useCallback } from "react";
import Video from "twilio-video";
import Participant from "./Participant";
import { getRoom, setFireRoom, getFireTime } from "./utils";
import { Button, Card, Row, Col, Alert, Form } from "react-bootstrap";
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
  let motivationalQuotes = [
    "“It does not matter how slowly you go as long as you do not stop.” - Confucius",
    "“We are what we repeatedly do. Excellence, then, is not an act, but a habit.” - Aristotle",
    "“Setting goals is the first step in turning the invisible into the visible.” - Tony Robbins",
    "“When something is important enough, you do it even if the odds are not in your favour.” - Elon Musk",
    "“It is our choices that show what we truly are, far more than our abilities.” - J.K. Rowling",
    "“Impossible is for the unwilling.” - John Keats",
    "“Creativity is intelligence having fun.” - Albert Einstein ",
    "“An obstacle is often a stepping stone.” - Prescott Bush",
    "“I never lose. I either win or learn.” - Nelson Mandela",
    "“Sometimes, things may not go your way, but the effort should be there every single night.” - Michael Jordan",
  ];

  let breakActivities = [
    "take a karaoke break, play and sing along to a song you like",
    "play a quick round of charades",
    <a href="https://skribbl.io/">try out this online game</a>,
    "see who can take the best picture during the break time",
    "stand up and do 30 jumping jacks",
    "try doing 20 squats",
    "stand up and touch every corner of the room",
  ];

  const [room, setRoom] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [countTimer, setCountTimer] = useState(0);
  const [beginTime, setBeginTime] = useState(null);
  const [roomDetails, setRoomDetails] = useState(null);
  const [hour, setHours] = useState(null);
  const [min, setMin] = useState(null);
  const [sec, setSec] = useState(null);
  const [working, setWorking] = useState(true);
  const [quote, setQuote] = useState(
    motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]
  );
  const [breakActivity, setBreakActivity] = useState(
    breakActivities[Math.floor(Math.random() * breakActivities.length)]
  );

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
    if (!!breakTime && !!workTime) {
      setWorking(
        !!(
          (parseInt(hour) * 60 + parseInt(min)) %
            (parseInt(breakTime) + parseInt(workTime)) <
          workTime
        )
          ? true
          : false
      );
    }
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
		  startTime: (new Date(rr.data.dateCreated).getTime()),
        });
      } else {
        const times = await getFireTime({ sid: room.sid });
        if (times.data) {
          setBreakTime(times.data.restTime);
          setWorkTime(times.data.workTime);
        }
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
    <Participant
      key={participant.sid}
      participant={participant}
      remote={true}
    />
  ));

  return (
    <div className="room">
      <Card className="localParticipantContainer">
        <Row>
          <Col className="text-left" md={5}>
            <h5>
              Hi {room ? room.localParticipant.identity : null}, welcome to your
              Flock room!
            </h5>
            <div className="smSeperator" />
            <h5>Room: {roomName}</h5>
            <p>Invite others by telling them your room name</p>
            <div className="smSeperator" />
            <h5>
              Total Session Time: {beginTime ? hour + ":" + min + ":" + sec : 0}
            </h5>
            <p>
              {!!workTime && !!breakTime
                ? "Work: " +
                  workTime +
                  " mins" +
                  (" Break: " + breakTime + " mins")
                : null}
            </p>
            <h5>
              {working ? (
                <Alert className="workIndicator" variant="success">
                  Work Time
                  <p className="quote">{quote}</p>
                </Alert>
              ) : (
                <Alert className="workIndicator" variant="danger">
                  Break Time
                  <p className="quote">Suggestion: {breakActivity}</p>
                </Alert>
              )}
            </h5>
          </Col>
          <Col md={7}>
            <div className="local-participant">
              {room ? (
                <Participant
                  key={room.localParticipant.sid}
                  participant={room.localParticipant}
                  remote={false}
                />
              ) : (
                ""
              )}
            </div>
          </Col>
          <Button className="logoutBtn" onClick={handleLogout}>
            Log Out
          </Button>
        </Row>
      </Card>
      <h3>Remote Participants</h3>
      <div className="remote-participants">{remoteParticipants}</div>
	  <div id="flockroomid">{!!room ? room.sid : null}</div>
    </div>
  );
};

export default Room;
