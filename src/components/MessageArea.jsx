import "./MessageArea.css";

import { useRef, useState } from "react";

import { formatDistanceToNow } from "date-fns";
import {
  doc,
  getDoc,
  getFirestore,
  setDoc,
  Timestamp,
} from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { FaArrowLeft, FaCamera, FaPaperPlane } from "react-icons/fa";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import { useAuthContext } from "../hooks/useAuthContext";
import { useDocument } from "../hooks/useDocument";
import { useFirestore } from "../hooks/useFirestore";
import { usePushNotifications } from "../hooks/usePushNotifications";

function MessageArea({ chatId, messagedUser }) {
  const { user } = useAuthContext();
  const [message, setMessage] = useState("");
  const { pushNotification } = usePushNotifications();

  const firestore = getFirestore();

  const { document } = useDocument("chats", chatId);
  const { updateDocument } = useFirestore("chats");

  const messagesHolder = useRef();

  const sendMessage = async () => {
    const chat = doc(firestore, "chats", chatId);

    const chatDocument = await getDoc(chat);

    if (!chatDocument.exists()) {
      await setDoc(chat, {
        users: {
          you: {
            nickname: user.displayName,
            photoURL: user.photoURL,
            id: user.uid,
          },
          partner: {
            nickname: messagedUser.nickname,
            photoURL: messagedUser.photoURL,
            id: messagedUser.id,
          },
        },
        messages: [
          {
            content: message,
            sender: {
              nickname: user.displayName,
              photoURL: user.photoURL,
              id: user.uid,
            },
            receiver: {
              nickname: messagedUser.nickname,
              photoURL: messagedUser.photoURL,
              id: messagedUser.id,
            },
            sentAt: Timestamp.fromDate(new Date()),
          },
        ],
        id: `${user.uid}-${messagedUser.id}`,
        createdAt: Timestamp.fromDate(new Date()),
        chatId: chatId,
      });
      setMessage("");

      await pushNotification({
        notificationContent: `${user.displayName} has sent you a message`,
        directedTo: messagedUser.id,
        linkTo: `message-to/${chatId}`,
        isRead: false,
        notificationTime: Timestamp.fromDate(new Date()),
        changeConcering: user.photoURL,
      });

      const bottomOfChat = messagesHolder.current;
      bottomOfChat.scrollTo(0, bottomOfChat.scrollHeight);
    }

    if (message.trim() === "") {
      toast.error("Brah, no way!");
      return;
    }
    let newArray;

    if (document) {
      newArray = document.messages;

      newArray.push({
        content: message,
        sender: {
          nickname: user.displayName,
          photoURL: user.photoURL,
          id: user.uid,
        },
        receiver: {
          nickname: messagedUser.nickname,
          photoURL: messagedUser.photoURL,
          id: messagedUser.id,
        },
        sentAt: Timestamp.fromDate(new Date()),
      });

      await updateDocument(chatId, {
        messages: newArray,
      });

      await pushNotification({
        notificationContent: `${user.displayName} has sent you a message`,
        directedTo: messagedUser.id,
        linkTo: `message-to/${chatId}`,
        isRead: false,
        notificationTime: Timestamp.fromDate(new Date()),
        changeConcering: user.photoURL,
      });

      setMessage("");
      const bottomOfChat = messagesHolder.current;
      bottomOfChat.scrollTo(0, bottomOfChat.scrollHeight);
    }
  };

  const addImageMessage = async (e) => {
    const files = Array.from(e.target.files);

    const chat = doc(firestore, "chats", chatId);

    const chatDocument = await getDoc(chat);

    const inacceptableFiles = files.filter((file) => {
      return file.size > 100000 || !file.type.includes("image");
    });

    const acceptableFiles = files.filter((file) => {
      return file.size <= 100000 && file.type.includes("image");
    });

    console.log(acceptableFiles, inacceptableFiles);

    if (acceptableFiles.length > 5) {
      toast.error("You can send maximum 5 pictures.");
      return;
    }

    if (inacceptableFiles.length > 0) {
      toast.error("Some Files were not acceptable.");
      return;
    }

    if (inacceptableFiles.length === 0 && acceptableFiles.length === 0) {
      toast.error("It seems, you haven't uploaded anything 🤪.");
      return;
    }

    acceptableFiles.map(async (file) => {
      const storage = getStorage();

      const uploadPath = `messages/uid${user.uid}-${messagedUser.id}/${file.name}`;

      const image = ref(storage, uploadPath);

      const snapshot = await uploadBytes(image, file);
      const messagedPhoto = await getDownloadURL(image);

      if (!chatDocument.exists()) {
        await setDoc(chat, {
          users: {
            you: {
              nickname: user.displayName,
              photoURL: user.photoURL,
              id: user.uid,
            },
            partner: {
              nickname: messagedUser.nickname,
              photoURL: messagedUser.photoURL,
              id: messagedUser.id,
            },
          },
          messages: [
            {
              content: messagedPhoto,
              sender: {
                nickname: user.displayName,
                photoURL: user.photoURL,
                id: user.uid,
              },
              receiver: {
                nickname: messagedUser.nickname,
                photoURL: messagedUser.photoURL,
                id: messagedUser.id,
              },
              sentAt: Timestamp.fromDate(new Date()),
            },
          ],
          id: `${user.uid}-${messagedUser.id}`,
          createdAt: Timestamp.fromDate(new Date()),
          chatId: chatId,
        });

        await pushNotification({
          notificationContent: `${user.displayName} has sent you a message`,
          directedTo: messagedUser.id,
          linkTo: `message-to/${chatId}`,
          isRead: false,
          notificationTime: Timestamp.fromDate(new Date()),
          changeConcering: user.photoURL,
        });

        const bottomOfChat = messagesHolder.current;
        bottomOfChat.scrollTo(0, bottomOfChat.scrollHeight);
      }

      // eslint-disable-next-line no-lone-blocks
      {
        /*https://firebasestorage.googleapis.com/ */
      }

      let newArray;

      if (document) {
        newArray = document.messages;

        newArray.push({
          content: messagedPhoto,
          sender: {
            nickname: user.displayName,
            photoURL: user.photoURL,
            id: user.uid,
          },
          receiver: {
            nickname: messagedUser.nickname,
            photoURL: messagedUser.photoURL,
            id: messagedUser.id,
          },
          sentAt: Timestamp.fromDate(new Date()),
        });
        await updateDocument(chatId, {
          messages: newArray,
        });

        await pushNotification({
          notificationContent: `${user.displayName} has sent you a message`,
          directedTo: messagedUser.id,
          linkTo: `message-to/${chatId}`,
          isRead: false,
          notificationTime: Timestamp.fromDate(new Date()),
          changeConcering: user.photoURL,
        });

        const bottomOfChat = messagesHolder.current;
        bottomOfChat.scrollTo(0, bottomOfChat.scrollHeight);
      }
    });
  };

  return (
    <>
      {window.outerWidth < 1025 && (
        <Link to="/your-chats" className="back-to-btn">
          <FaArrowLeft /> Back
        </Link>
      )}
      <div className="messaging-container">
        <div className="messages-holder" ref={messagesHolder}>
          {document &&
            document.messages.map((message, i) => (
              <>
                {message.sender.id === user.uid ? (
                  <>
                    <div className="owner-message" key={i}>
                      <div className="message-content">
                        {message.content &&
                        message.content.includes(
                          "https://firebasestorage.googleapis.com/"
                        ) ? (
                          <>
                            <div className="sent-image">
                              <img src={message.content} alt="" />
                            </div>
                          </>
                        ) : (
                          <p>{message.content}</p>
                        )}
                        <small>
                          {formatDistanceToNow(message.sentAt.toDate())} ago
                        </small>
                      </div>
                      <div className="owner-picture">
                        <img src={message.sender.photoURL} alt="" />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="from-message" key={i}>
                      <div className="from-picture">
                        <img src={message.sender.photoURL} alt="" />
                      </div>

                      <div className="message-content">
                        {message.content &&
                        message.content.includes(
                          "https://firebasestorage.googleapis.com/"
                        ) ? (
                          <>
                            <div className="sent-image">
                              <img src={message.content} alt="" />
                            </div>
                          </>
                        ) : (
                          <p>{message.content}</p>
                        )}
                        <small>
                          {formatDistanceToNow(message.sentAt.toDate())} ago
                        </small>
                      </div>
                    </div>
                  </>
                )}
              </>
            ))}
        </div>

        <div className="message-managment">
          <label className="btn add-photo">
            <input type="file" onChange={addImageMessage} multiple />
            <FaCamera />
          </label>

          <label>
            <span>Message:</span>
            <textarea
              style={{ height: 50 }}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            ></textarea>
          </label>

          <button className="btn send" onClick={sendMessage}>
            <FaPaperPlane />
          </button>
        </div>
      </div>
    </>
  );
}

export default MessageArea;
