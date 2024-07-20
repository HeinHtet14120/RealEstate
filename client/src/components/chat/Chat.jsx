import { useContext, useState } from "react";
import "./chat.scss";
import { AuthContext } from "../../context/AuthContext"
import apiRequest from "../../lib/apiRequest.js"
import { format } from "timeago.js"

function Chat({ chats }) {
  const { currentUser } = useContext(AuthContext);
  const [chat, setChat] = useState(null);
  const [messages, setMessages] = useState([]);

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
    } catch (err) {
      console.log(err)
    }
  }

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
