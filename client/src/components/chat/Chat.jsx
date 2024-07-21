import { useContext, useEffect, useRef, useState } from "react";
import "./chat.scss";
import { AuthContext } from "../../context/AuthContext"
import apiRequest from "../../lib/apiRequest.js"
import { format } from "timeago.js"
import { SocketContext } from "../../context/SocketContext.jsx";

function Chat({ chats }) {
  const { currentUser } = useContext(AuthContext);
  const { socket } = useContext(SocketContext)
  const [chat, setChat] = useState(null);
  const [messages, setMessages] = useState([]);

  const messageEndRef = useRef();

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat])

  const handleOpenChat = async (id, receiver) => {

    try {
      const res = await apiRequest(`chats/${id}`);

      setChat({ ...res.data, receiver })

      const fetchMessages = res.data.messages;

      setMessages(fetchMessages)


    } catch (err) {
      console.log(err)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formdata = new FormData(e.target);

    const text = formdata.get("text");

    if (!text) return;
    try {

      const res = await apiRequest.post("/messages/" + chat.id, { text });
      setChat((prev) => ({ ...prev, messages: [...prev.messages, res.data] }));
      e.target.reset();

      socket.emit("sendMessage", {
        receiverId: chat.receiver.id,
        data: res.data,
      });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const read = async () => {
      try {
        await apiRequest.put("/chats/read/" + chat.id);
      } catch (err) {
        console.log(err);
      }
    };
    if (chat && socket) {
      socket.on("getMessage", (data) => {
        if (chat.id === data.chatId) {
          setChat((prev) => ({ ...prev, messages: [...prev.messages, data] }));
          read();
        }
      });
    }
    return () => {
      socket.off("getMessage");
    };
  }, [socket, chat]);


  return (
    <div className="chat">
      <div className="messages">
        <h1>Messages</h1>
        {chats?.map((chat, index) => (
          <div className="message"
            key={index}
            style={{ backgroundColor: chat.seenBy.includes(currentUser.id) ? "white" : "#fecd514e" }}
            onClick={() => handleOpenChat(chat.id, chat.receiver)}
          >
            <img
              src={chat.receiver.avatar || "https://thumbs.dreamstime.com/b/unisex-default-profile-picture-white-faceless-person-black-background-304887214.jpg"}
              alt=""
            />
            <span>{chat.receiver.username}</span>
            <p>{chat.lastMessage}</p>
          </div>
        ))}
      </div>
      {chat && (
        <div className="chatBox">
          <div className="top">
            <div className="user">
              <img
                src={chat.receiver.avatar || "https://thumbs.dreamstime.com/b/unisex-default-profile-picture-white-faceless-person-black-background-304887214.jpg"}
                alt=""
              />
              {chat.receiver.username}
            </div>
            <span className="close" onClick={() => setChat(null)}>X</span>
          </div>
          <div className="center">

            {
              chat.messages.map((message, index) => (
                <div className={`chatMessage ${message.userId === currentUser.id ? "own" : ""}`} key={index}>
                  <p>{message?.text}</p>
                  <span>{format(message.createdAt)}</span>
                </div>
              ))

            }

            <div ref={messageEndRef}></div>
          </div>
          <form onSubmit={handleSubmit} className="bottom">
            <textarea name="text"></textarea>
            <button>Send</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Chat;
