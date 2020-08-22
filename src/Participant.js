import React, { useState, useEffect, useRef } from "react";
import { FaMicrophone, FaMicrophoneSlash, FaVideo, FaVideoSlash } from 'react-icons/fa';
import { Button } from 'react-bootstrap';

const Participant = ({ participant }) => {
  const [videoTracks, setVideoTracks] = useState([]);
  const [audioTracks, setAudioTracks] = useState([]);
  const [muteButton, setMuteButton] = useState(false);
  const [videoButton, setVideoButton] = useState(false);
  const videoRef = useRef();
  const audioRef = useRef();

  const trackpubsToTracks = (trackMap) =>
    Array.from(trackMap.values())
      .map((publication) => publication.track)
      .filter((track) => track !== null);

  useEffect(() => {
    setVideoTracks(trackpubsToTracks(participant.videoTracks));
    setAudioTracks(trackpubsToTracks(participant.audioTracks));

    const trackSubscribed = (track) => {
      if (track.kind === "video") {
        setVideoTracks((videoTracks) => [...videoTracks, track]);
      } else if (track.kind === "audio") {
        setAudioTracks((audioTracks) => [...audioTracks, track]);
      }
    };

    const trackUnsubscribed = (track) => {
      if (track.kind === "video") {
        setVideoTracks((videoTracks) => videoTracks.filter((v) => v !== track));
      } else if (track.kind === "audio") {
        setAudioTracks((audioTracks) => audioTracks.filter((a) => a !== track));
      }
    };

    participant.on("trackSubscribed", trackSubscribed);
    participant.on("trackUnsubscribed", trackUnsubscribed);

    return () => {
      setVideoTracks([]);
      setAudioTracks([]);
      participant.removeAllListeners();
    };
  }, [participant]);

  useEffect(() => {
    const videoTrack = videoTracks[0];
    if (videoTrack) {
      videoTrack.attach(videoRef.current);
      return () => {
        videoTrack.detach();
      };
    }
  }, [videoTracks]);

  useEffect(() => {
    const audioTrack = audioTracks[0];
    if (audioTrack) {
      audioTrack.attach(audioRef.current);
      return () => {
        audioTrack.detach();
      };
    }
  }, [audioTracks]);

  const handleChange = type => {
    if (type === "mute") setMuteButton(!muteButton);
    else if (type === "video") setVideoButton(!videoButton);
  };
    
  return (
    <div className="participant">
      <h3>{participant.identity}</h3>
      <video ref={videoRef} autoPlay={true} />
      <audio ref={audioRef} autoPlay={true} muted={muteButton} />
      <Button onClick={() => handleChange("mute")} className="muteButton">
        {!!muteButton ? <FaMicrophoneSlash /> : <FaMicrophone/>}
      </Button>
      <Button onClick={() => handleChange("video")} className="muteButton">
        {!!videoButton ? <FaVideoSlash /> : <FaVideo/>}
      </Button>
    </div>
  );
};

export default Participant;
