import React, { useState, useEffect } from 'react';
import Video from 'twilio-video';
import Participant from './Participant';
import { getRoom, setFireRoom, getFireTime } from "./utils";

const Room = ({ roomName, token, handleLogout, workTime, breakTime, setWorkTime, setBreakTime }) => {
  const [room, setRoom] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [countTimer, setCountTimer] = useState(0);
  const [beginTime, setBeginTime] = useState(null);
  const [roomDetails, setRoomDetails] = useState(null); 
  const [hour,setHours] = useState(null);
  const [min, setMin] = useState(null);
  const [sec, setSec] = useState(null);
  const [working, setWorking] = useState(true);
    
  const startTimer = () => {
    setInterval(() => {
        if (beginTime){
            const elapsed = new Date() - beginTime;
            setCountTimer(elapsed);
        }
    }, 1000);
  };
    
  useEffect(() => {
    setHours(("0" + Math.floor(countTimer / 3600000)).slice(-2));
    setMin(("0" + (Math.floor(countTimer / 60000) % 60)).slice(-2));
    setSec(("0" + (Math.floor(countTimer / 1000) % 60)).slice(-2));
    if (!!breakTime && !!workTime){
        setWorking(!!((parseInt(hour)*60+parseInt(min)) % (parseInt(breakTime)+parseInt(workTime)) < workTime)?true:false); 
    }
  }, [countTimer]);
    
  
    
  useEffect(() => {
      startTimer();
  }, [beginTime]);
    
  useEffect(() => {
      
    const participantConnected = participant => {
      setParticipants(prevParticipants => [...prevParticipants, participant]);
    };

    const participantDisconnected = participant => {
      setParticipants(prevParticipants =>
        prevParticipants.filter(p => p !== participant)
      );
    };

    Video.connect(token, {
      name: roomName
    }).then(async(room) => {
      const rr = await getRoom({"sid":room.sid});
      if (workTime && breakTime){
          await setFireRoom({
              "sid": room.sid, 
              "workTime": workTime, 
              "breakTime": breakTime,
          }
          );
      }else{
          const times = await getFireTime({"sid":room.sid});
          if (times.data){
              setBreakTime(times.data.restTime);
              setWorkTime(times.data.workTime);
          }
      }
      if (rr.status === 200){ 
          setRoomDetails(rr.data);
          setBeginTime(new Date(rr.data.dateCreated).getTime());
      }
      setRoom(room);
      room.on('participantConnected', participantConnected);
      room.on('participantDisconnected', participantDisconnected);
      room.participants.forEach(participantConnected);
    });

    return () => {
      setRoom(currentRoom => {
        if (currentRoom && currentRoom.localParticipant.state === 'connected') {
          currentRoom.localParticipant.tracks.forEach(function(trackPublication) {
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

  const remoteParticipants = participants.map(participant => (
    <Participant key={participant.sid} participant={participant} />
  ));

  return (
    <div className="room">
      <h2>Room: {roomName}</h2>
      <h2>{beginTime ? hour+":"+min+":"+sec : 0}</h2>
      <h2>{!!workTime && !!breakTime?("Work: " + workTime + " mins  ")+("Break: " + breakTime + " mins"):null}</h2>
      <h2>{working?"Work":"Break"}</h2>
      <button onClick={handleLogout}>Log out</button>
      <div className="local-participant">
        {room ? (
          <Participant
            key={room.localParticipant.sid}
            participant={room.localParticipant}
          />
        ) : (
          ''
        )}
      </div>
      <h3>Remote Participants</h3>
      <div className="remote-participants">{remoteParticipants}</div>
    </div>
  );
};

export default Room;
