import axios from "axios";
import React, { useState } from "react";
import ReactPlayer from "react-player";
import { Link } from "react-router-dom";
import Chat from "./Chat";
import { v4 as uuidv4 } from 'uuid';

export const id = uuidv4();
export const senderName = "Guest_" + id;

function isJson(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

const App = () => {
  const [formInputs, setFormInputs] = useState({ agentName: "" });
  const [pageState, setPageState] = useState(0);
  const [agentImage, setAgentImage] = useState(null);
  const [startingMessage, setStartingMessage] = useState("");

  const sendMessage = async (agentName) => {
    const body = { agent: agentName, command: "/become " + agentName, speaker: senderName, id: id };
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/execute`, body);
    setStartingMessage(res.data.startingMessage);
    var x = new XMLHttpRequest();
    x.open(
      "GET",
      (process.env.REACT_APP_CORS_URL.endsWith("/")
        ? process.env.REACT_APP_CORS_URL
        : process.env.REACT_APP_CORS_URL + "/") +
      `https://en.wikipedia.org/w/api.php?action=query&format=json&formatversion=2&prop=pageimages&piprop=original&titles=${res.data?.result?.title ? res.data.result.title : body.agent
      }`
    );
    x.onload = x.onerror = function () {
      let res = "";
      if (
        x &&
        x.responseText &&
        x.responseText.length > 0 &&
        isJson(x.responseText)
      ) {
        const json = JSON.parse(x.responseText).query;
        if (json) {
          const pages = json.pages;
          if (pages && pages.length > 0) {
            const original = pages[0].original;
            if (original) {
              res = original.source;
            }
          }
        }
      }

      if (!res || res.length <= 0) {
        res = "/Logo.png";
      }

      setFormInputs({ agentName: agentName });
      setAgentImage(res);
    };
    x.send();
  };

  const onChange = (e) =>
    setFormInputs({ ...formInputs, [e.target.name]: e.target.value });

  const startConversation = async () => {
    if (formInputs.agentName !== null && formInputs.agentName !== "") {
      setPageState(1);
      await sendMessage(formInputs.agentName);
      setPageState(2);
      setFormInputs({ agentName: "" });
    }
  };

  const startConversationFromImage = async (ai_name) => {
    setPageState(1);
    await sendMessage(ai_name);
    setPageState(2);
  };

  return (
    <div className="App">
      <img src='SuperReality_Background.svg' style={{ position: "absolute" }} width="100%" alt='background' />
      {pageState > 0 && (
        <div className="ChatWrapper">
          <Chat
            agentImage={agentImage}
            handleClick={() => {
              window.location.reload(false);
              setPageState(0);
            }}
            agentName={formInputs.agentName}
            startingMessage={startingMessage}
          />
        </div>
      )}
      {pageState === 0 && (
        <div className="joinChatContainer">
          <img src="/Logo.png" className="logo-big" />
          <div className="mainInput">
            <input
              type="text"
              placeholder="Who or what do you want to talk to?"
              name="agentName"
              value={formInputs.agentName}
              onKeyPress={(event) => {
                event.key === "Enter" && startConversation();
              }}
              onChange={onChange}
            />
            <button onClick={startConversation} />
          </div>
          <div style={{ marginTop: "2em" }}>
            <b>Try talking to these AIs</b>
          </div>
          <div className="flex-container">
            <span className="flex-item">
              <img
                src="tree.png"
                alt="ai"
                className="ai-img"
                onClick={async () => {
                  await startConversationFromImage("tree");
                }}
              />
            </span>
            <span className="flex-item">
              <img
                src="sunflower.png"
                alt="ai"
                className="ai-img"
                onClick={async () => {
                  await startConversationFromImage("sunflower");
                }}
              />
            </span>
            <span className="flex-item">
              <img
                src="rabbit.png"
                alt="ai"
                className="ai-img"
                onClick={async () => {
                  await startConversationFromImage("rabbit");
                }}
              />
            </span>
            <span className="flex-item">
              <img
                src="ant.png"
                alt="ai"
                className="ai-img"
                onClick={async () => {
                  await startConversationFromImage("ant");
                }}
              />
            </span>
            <span className="flex-item">
              <img
                src="rainbow.png"
                alt="ai"
                className="ai-img"
                onClick={async () => {
                  await startConversationFromImage("rainbow");
                }}
              />
            </span>

            <span className="flex-item">
              <img
                src="earth.png"
                alt="ai"
                className="ai-img"
                onClick={async () => {
                  await startConversationFromImage("earth");
                }}
              />
            </span>
            <span className="flex-item">
              <img
                src="socrates.png"
                alt="ai"
                className="ai-img"
                onClick={async () => {
                  await startConversationFromImage("socrates");
                }}
              />
            </span>
            <span className="flex-item">
              <img
                src="galileo.png"
                alt="ai"
                className="ai-img"
                onClick={async () => {
                  await startConversationFromImage("Galileo");
                }}
              />
            </span>
            <span className="flex-item">
              <img
                src="tesla.png"
                alt="ai"
                className="ai-img"
                onClick={async () => {
                  await startConversationFromImage("Nikola Tesla");
                }}
              />
            </span>
            <span className="flex-item">
              <img
                src="newton.png"
                alt="ai"
                className="ai-img"
                onClick={async () => {
                  await startConversationFromImage("Isaac Newton");
                }}
              />
            </span>

            <span className="flex-item">
              <img
                src="ada.png"
                alt="ai"
                className="ai-img"
                onClick={async () => {
                  await startConversationFromImage("Ada Lovelace");
                }}
              />
            </span>
            <span className="flex-item">
              <img
                src="rosalind.png"
                alt="ai"
                className="ai-img"
                onClick={async () => {
                  await startConversationFromImage("Rosalind Franklin");
                }}
              />
            </span>
            <span className="flex-item">
              <img
                src="energy.png"
                alt="ai"
                className="ai-img"
                onClick={async () => {
                  await startConversationFromImage("Mass–energy equivalence");
                }}
              />
            </span>
            <span className="flex-item">
              <img
                src="atom.png"
                alt="ai"
                className="ai-img"
                onClick={async () => {
                  await startConversationFromImage("atom");
                }}
              />
            </span>
            <span className="flex-item">
              <img
                src="caffeine.png"
                alt="ai"
                className="ai-img"
                onClick={async () => {
                  await startConversationFromImage("caffeine");
                }}
              />
            </span>
            <span className="flex-item">
              <img
                src="cell.png"
                alt="ai"
                className="ai-img"
                onClick={async () => {
                  await startConversationFromImage("cell (biology)");
                }}
              />
            </span>
            <span className="flex-item">
              <img
                src="sun.png"
                alt="ai"
                className="ai-img"
                onClick={async () => {
                  await startConversationFromImage("sun");
                }}
              />
            </span>
            <span className="flex-item">
              <img
                src="shakespeare.png"
                alt="ai"
                className="ai-img"
                onClick={async () => {
                  await startConversationFromImage("shakespeare");
                }}
              />
            </span>
          </div>
          <ReactPlayer
            style={{
              margin: "3em auto",
              maxWidth: "100%",
              width: "100%",
            }}
            url="https://www.youtube.com/watch?v=Ar54k0sMWe0"
          />
          <div className="EditorLinks">
            <span>
              <Link to="/agents" className="btn btn-primary">
                Agents
              </Link>
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
