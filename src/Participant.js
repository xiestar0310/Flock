import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  FaMicrophone,
  FaMicrophoneSlash,
  FaVideo,
  FaVideoSlash,
  FaVolumeUp,
  FaVolumeMute,
} from "react-icons/fa";
import { Button, Form } from "react-bootstrap";

const Participant = ({ participant, remote }) => {
  const [videoTracks, setVideoTracks] = useState([]);
  const [audioTracks, setAudioTracks] = useState([]);
  const [muteButton, setMuteButton] = useState(false);
  const [volumeButton, setVolumeButton] = useState(false);
  const [videoButton, setVideoButton] = useState(false);
  const [personalStatus, setPersonalStatus] = useState("");

  const handlePersonalStatus = useCallback((event) => {
    setPersonalStatus(event.target.value);
  });

  const videoRef = useRef();
  const audioRef = useRef();

  const trackpubsToTracks = (trackMap) => {
    Array.from(trackMap.values()).forEach((p) => {
      console.log(p);
    });
    return Array.from(trackMap.values())
      .map((publication) => publication.track)
      .filter((track) => track !== null);
  };

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

  const handleChange = (type) => {
    if (type === "volume") setVolumeButton(!volumeButton);
    else if (type === "video") {
      setVideoButton(!videoButton);
      if (!videoButton) {
        const videoTrack = videoTracks[0];
        if (videoTrack) videoTrack.detach();
      } else {
        const videoTrack = videoTracks[0];
        if (videoTrack) videoTrack.attach(videoRef.current);
      }
    } else if (type === "mute") {
      setMuteButton(!muteButton);
      if (!muteButton) {
        const audioTrack = audioTracks[0];
        if (audioTrack) audioTrack.detach();
      } else {
        const audioTrack = audioTracks[0];
        if (audioTrack) audioTrack.attach(audioRef.current);
      }
    }
  };

  return (
    <div className="d-flex">
      <div className="participant">
        <h6>{participant.identity}</h6>
        <video ref={videoRef} autoPlay={true} />
        <audio ref={audioRef} autoPlay={true} muted={volumeButton} />
        <Button onClick={() => handleChange("volume")} className="muteButton">
          {!!volumeButton ? <FaVolumeMute /> : <FaVolumeUp />}
        </Button>
        <Button onClick={() => handleChange("mute")} className="muteButton">
          {!!muteButton ? <FaMicrophoneSlash /> : <FaMicrophone />}
        </Button>
        <Button onClick={() => handleChange("video")} className="muteButton">
          {!!videoButton ? <FaVideoSlash /> : <FaVideo />}
        </Button>
      </div>
      {!remote && (
        <Form className="statusForm">
          <Form.Group>
            <Form.Label>Set your status:</Form.Label>
            <Form.Control
              type="text"
              as="textarea"
              rows="2"
              id="status"
              onChange={handlePersonalStatus}
              maxLength="150"
            ></Form.Control>
            <Form.Text className="text-muted">
              Let others know where you went and/or your current status
            </Form.Text>
          </Form.Group>
        </Form>
      )}
      <p className="personalStatus">{personalStatus}</p>
    </div>
  );
};

export default Participant;
