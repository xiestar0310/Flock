import React from "react";
import { Popover, OverlayTrigger, Button } from "react-bootstrap";
import { HiEmojiHappy } from "react-icons/hi";
import Hundred from "./assets/emotes/100.png";
import Burger from "./assets/emotes/burger.png";
import HeartEyes from "./assets/emotes/hearteyes.png";
import Sleepy from "./assets/emotes/sleepy.png";
import Smiling from "./assets/emotes/smiling.png";
import YellowClap from "./assets/emotes/yellowclap.png";
import YellowWave from "./assets/emotes/yellowwave.png";
import { TiCancel } from "react-icons/ti";

const EmotePanel = ({ emotes, handleEmoteClick }) => {
  return (
    <OverlayTrigger
      trigger="click"
      key="emotes"
      placement="left"
      overlay={
        <Popover id="popover-positioned-left">
          <Popover.Content>
            <img
              className="emote"
              onClick={() => handleEmoteClick("hundred")}
              src={Hundred}
            />
            <img
              className="emote"
              onClick={() => handleEmoteClick("eat")}
              src={Burger}
            />
            <img
              className="emote"
              onClick={() => handleEmoteClick("heart")}
              src={HeartEyes}
            />
            <img
              className="emote"
              onClick={() => handleEmoteClick("sleepy")}
              src={Sleepy}
            />
            <img
              className="emote"
              onClick={() => handleEmoteClick("smile")}
              src={Smiling}
            />
            <img
              className="emote"
              onClick={() => handleEmoteClick("clap")}
              src={YellowClap}
            />
            <img
              className="emote"
              onClick={() => handleEmoteClick("wave")}
              src={YellowWave}
            />
            <TiCancel onClick={() => handleEmoteClick("")} />
          </Popover.Content>
        </Popover>
      }
    >
      <Button className="emotePanel" variant="dark">
        <HiEmojiHappy />
      </Button>
    </OverlayTrigger>
  );
};

export default EmotePanel;
