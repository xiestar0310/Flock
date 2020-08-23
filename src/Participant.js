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
import { getFireParticipants } from "./utils";
import secrets from "./secrets";
import firebase from "firebase/app";
import "firebase/database";
import Hundred from "./assets/emotes/100.png";
import Burger from "./assets/emotes/burger.png";
import HeartEyes from "./assets/emotes/hearteyes.png";
import Sleepy from "./assets/emotes/sleepy.png";
import Smiling from "./assets/emotes/smiling.png";
import YellowClap from "./assets/emotes/yellowclap.png";
import YellowWave from "./assets/emotes/yellowwave.png";
import { TiCancel } from "react-icons/ti";

const firebaseConfig = secrets;
firebase.initializeApp(firebaseConfig);

const database = firebase.database();

function StrToEmote(emoteStr) {
  const imgSource = {};

  switch (emoteStr) {
    case "hundred":
      return (
        <img className="displayEmote" src={Hundred} alt="displayed emoji" />
      );
    case "eat":
      return (
        <img className="displayEmote" src={Burger} alt="displayed emoji" />
      );
    case "heart":
      return (
        <img className="displayEmote" src={HeartEyes} alt="displayed emoji" />
      );
    case "sleepy":
      return (
        <img className="displayEmote" src={Sleepy} alt="displayed emoji" />
      );
    case "smile":
      return (
        <img className="displayEmote" src={Smiling} alt="displayed emoji" />
      );
    case "clap":
      return (
        <img className="displayEmote" src={YellowClap} alt="displayed emoji" />
      );
    case "wave":
      return (
        <img className="displayEmote" src={YellowWave} alt="displayed emoji" />
      );
    default:
      return null;
  }
}

const Participant = ({ participant }) => {
  const [videoTracks, setVideoTracks] = useState([]);
  const [audioTracks, setAudioTracks] = useState([]);
  const [muteButton, setMuteButton] = useState(false);
  const [volumeButton, setVolumeButton] = useState(false);
  const [videoButton, setVideoButton] = useState(false);

  const [personalStatus, setPersonalStatus] = useState("");
  const [emote, setEmote] = useState("");

  const videoRef = useRef();
  const audioRef = useRef();

  const trackpubsToTracks = (trackMap) => {
    return Array.from(trackMap.values())
      .map((publication) => publication.track)
      .filter((track) => track !== null);
  };

  useEffect(() => {
    const ref = database.ref("participants/" + participant.sid);
    ref.on("value", (values) => {
      const temp = values.val();
      if (!!temp) setPersonalStatus(temp.statusMessage);
    });
  });

  useEffect(() => {
    const ref = database.ref("participants/" + participant.sid);
    ref.on("value", (values) => {
      const temp = values.val();
      if (!!temp) setEmote(temp.emote);
    });
  });

  useEffect(async () => {
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
      <p className="personalStatus">{personalStatus}</p>
      {emote && StrToEmote(emote)}
    </div>
  );
};

export default Participant;
