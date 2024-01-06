import { useEffect, useState } from 'react'
import ScrollToBottom from "react-scroll-to-bottom";



const Chat = ({ socket, username, room }) => {
  const [currentMessage, setCurrentMessage] = useState('')
  const [messageList, setMessageList] = useState([])

  const sendMessage = async (e) => {
    e.preventDefault()

    if (currentMessage.trim() == "") return

    const messageData = {
      room: room,
      author: username,
      message: currentMessage,
      time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes() + ":" + new Date(Date.now()).getSeconds()
    }

    await socket.emit("send_message", messageData)
    setMessageList(prev => [...prev, messageData])
    setCurrentMessage('')
  }

  useEffect(() => {
    socket.on("get_message", (data) => {
      setMessageList(prev => [...prev, data])
    })
  }, [socket])

  return (
    <>
      <h2>Joined As {username}</h2>
      <div className="chat-window">
        <div className="chat-header">
          <p>Live Chat</p>
        </div>
        <div className="chat-body">
          <ScrollToBottom className="message-container">
            {messageList.map((messageContent, index) => {
              return (
                <div
                  key={index}
                  className="message"
                  id={username === messageContent.author ? "other" : "you"}
                >
                  <div>
                    <div className="message-content">
                      <p>{messageContent.message}</p>
                    </div>
                    <div className="message-meta">
                      <p id="time">{messageContent.time}</p>
                      <p id="author">{messageContent.author}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </ScrollToBottom>
        </div>
        <form onSubmit={sendMessage} className="chat-footer">
          <input
            type="text"
            value={currentMessage}
            placeholder="Hey..."
            onChange={(event) => {
              setCurrentMessage(event.target.value);
            }}

          />
          <button >&#9658;</button>
        </form>
      </div>
    </>
  )
}

export default Chat