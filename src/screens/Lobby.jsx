import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../context/SocketProvider";

const LobbyScreen = () => {
  const [email, setEmail] = useState("");
  const [room, setRoom] = useState("");

  const socket = useSocket();
  const navigate = useNavigate();

  async function enumerateDevices() {
    console.log(" ");
    console.log(
      "+++++++++++++++++++++++++++Enumerate Devices++++++++++++++++++++++"
    );
    await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
    let devices = await navigator.mediaDevices.enumerateDevices();

    console.log(" ");
    console.log(devices);

    console.log(" ");
    console.log(
      "+++++++++++++++++++++++++++Input Devices++++++++++++++++++++++"
    );

    devices.forEach((element) => {
      if (element.kind == "audioinput") {
        console.log("Name: ", element.label);
        console.log("ID: ", element.deviceId);
      }
    });

    console.log(" ");
    console.log(
      "+++++++++++++++++++++++++++Output Devices++++++++++++++++++++++"
    );

    devices.forEach((element) => {
      if (element.kind == "audiooutput") {
        console.log("Name: ", element.label);
        console.log("ID: ", element.deviceId);
      }
    });
  }

  const handleSubmitForm = useCallback(
    (e) => {
      e.preventDefault();
      socket.emit("room:join", { email, room });
    },
    [email, room, socket]
  );

  const handleJoinRoom = useCallback(
    (data) => {
      const { email, room } = data;
      navigate(`/room/${room}`);
    },
    [navigate]
  );

  useEffect(() => {
    enumerateDevices();
    socket.on("room:join", handleJoinRoom);
    return () => {
      socket.off("room:join", handleJoinRoom);
    };
  }, [socket, handleJoinRoom]);

  return (
    <div>
      <h1>Lobby</h1>
      <form onSubmit={handleSubmitForm}>
        <label htmlFor="email">Email ID</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />
        <label htmlFor="room">Room Number</label>
        <input
          type="text"
          id="room"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
        />
        <br />
        <button>Join</button>
      </form>
    </div>
  );
};

export default LobbyScreen;
