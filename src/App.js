import React from "react";
import "./App.css";
import VideoChat from "./VideoChat";
import GooseIcon from "./assets/goose-stand.ico";
import Logo from "./assets/flock.png";
import { Navbar } from "react-bootstrap";

const App = () => {
  return (
    <div className="app">
      <Navbar bg="dark">
        <Navbar.Brand>
          <img
            alt="flying-goose"
            src={Logo}
            width="30"
            height="30"
            className="d-inline-block align-top"
          />{" "}
        </Navbar.Brand>
      </Navbar>

      <main>
        <VideoChat />
      </main>
      <footer>
        <p>
          Made with{" "}
          <span role="img" aria-label="React">
            <img className="gooseIcon" src={GooseIcon} alt="standing goose" />
          </span>{" "}
          by Flock
        </p>
      </footer>
    </div>
  );
};

export default App;
