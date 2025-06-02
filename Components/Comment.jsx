import { useState, useEffect, useRef } from "react";
import { showErrorToast, showSuccessToast } from "@/utils/toast.js";
import "../Styles/Comment.css";
import { IconBack } from "@/pages/ContentEdit/Icons";
import axios from "axios";
import CookieManager from "@/managers/CookieManager";
import { format, newDate } from "date-fns-jalali";
import { parseISO } from "date-fns";
import { faIR } from "date-fns-jalali/locale";
import { toPersianDigit } from "@/utils/persianNumberConverter.js";

const commentsBaseAPI = "http://iransanad.fiust.ir/api/v1/docs/document";
const replyBaseAPI = "http://iransanad.fiust.ir/api/v1/docs/commentreply";
const WebsocketBaseURL = "ws://iransanad.fiust.ir/ws/docs";

export default function Comment({ documentId, currentUser, onClose }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentText, setEditCommentText] = useState("");
  const [replyingToCommentId, setReplyingToCommentId] = useState(null);
  const [replyText, setReplyText] = useState("");

  const [editingReplyId, setEditingReplyId] = useState(null);
  const [editReplyText, setEditReplyText] = useState("");

  const token = CookieManager.LoadToken();
  const socketRef = useRef(null);

  // Convert Date
  const convertDate = (dateString) => {
    const date = parseISO(dateString);
    const persianDate = format(date, "d MMMM - HH:mm", { locale: faIR });
    return toPersianDigit(persianDate);
  };

  // Get All Comments
  useEffect(() => {
    axios
      .get(`${commentsBaseAPI}/${documentId}/comment`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `JWT ${token}`,
        },
      })
      .then((response) => {
        setComments(response.data);
        console.log(response);
      })
      .catch((error) => {
        console.error("Error fetching comments:", error);
        showErrorToast("خطا در بارگذاری یادداشت‌ها!");
        setComments([]);
      });
  }, [documentId]);

  // WebSocket Connection and Handling
  useEffect(() => {
    socketRef.current = new WebSocket(
      WebsocketBaseURL + "/" + documentId + "/?Authorization=" + token
    );

    socketRef.current.onopen = () => {
      console.log("WebSocket connected!");
    };

    socketRef.current.onmessage = (event) => {
      try {
        let messageData;
        if (!(event.data instanceof Blob)) {
          messageData = event.data;

          const data = JSON.parse(messageData);
          console.log("WebSocket message received:", data);
          handleWebSocketUpdate(data);
        }
      } catch (error) {
        console.error("Error processing WebSocket message:", error);
      }
    };

    socketRef.current.onerror = (error) => {
      console.error("WebSocket error:", error);
      showErrorToast("خطا در به‌روزرسانی زنده!");
    };

    socketRef.current.onclose = () => {
      console.log("WebSocket disconnected.");
    };
  }, [documentId]);

  const handleWebSocketUpdate = (data) => {
    switch (data.type) {
      case "comment_created":
        setComments((prev) => {
          const exists = prev.some((c) => c.id === data.data.id);
          if (!exists) {
            // showSuccessToast("یادداشت جدید!");
            return [...prev, data.data];
          }
          return prev;
        });
        break;

      case "comment_updated":
        setComments((prevComments) =>
          prevComments.map((comment) =>
            comment.id === data.data.id
              ? { ...comment, text: data.data.text }
              : comment
          )
        );
        break;

      case "comment_deleted":
        setComments((prev) => {
          const exists = prev.some((c) => c.id === data.data);
          if (exists) {
            // showSuccessToast("یادداشت حذف شده!");
            return prev.filter((comment) => comment.id !== data.data);
          }
          return prev;
        });
        break;

      case "reply_created":
        console.log(data);
        setComments((prev) =>
          prev.map((comment) => {
            if (comment.id === data.data.comment) {
              const exists = comment.commentreply_set.some(
                (r) => r.id === data.data.id
              );
              if (!exists) {
                // showSuccessToast("پاسخ جدید!");
                return {
                  ...comment,
                  commentreply_set: [...comment.commentreply_set, data.data],
                };
              }
            }
            return comment;
          })
        );
        break;

      case "reply_updated":
        setComments((prev) =>
          prev.map((comment) => {
            if (comment.id === data.data.comment) {
              return {
                ...comment,
                commentreply_set: comment.commentreply_set.map((reply) =>
                  reply.id === data.data.id ? data.data : reply
                ),
              };
            }
            return comment;
          })
        );
        // showSuccessToast("پاسخ به‌روز شد");
        break;

      case "reply_deleted":
        setComments((prev) =>
          prev.map((comment) => {
            if (comment.id === data.data.comment) {
              // showSuccessToast("پاسخ حذف شد");
              return {
                ...comment,
                commentreply_set: comment.commentreply_set.filter(
                  (reply) => reply.id !== data.data.reply
                ),
              };
            }
            return comment;
          })
        );
        break;

      default:
        console.warn("Unknown WebSocket message type:", data.type);
    }
  };

  //////////////// APIS //////////////////

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      try {
        const response = await axios.post(
          `${commentsBaseAPI}/${documentId}/comment/`,
          {
            document_uuid: documentId,
            author: currentUser.username,
            text: newComment,
            range_start: {},
            range_end: {},
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `JWT ${token}`,
            },
          }
        );
        console.log(response);

        // const added_comment = response.data;
        // setComments([...comments, added_comment]);
        setNewComment("");

        if (
          socketRef.current &&
          socketRef.current.readyState === WebSocket.OPEN
        ) {
          socketRef.current.send(
            JSON.stringify({ type: "comment_created", data: response.data })
          );
        }
      } catch (error) {
        console.log(error);
        showErrorToast("ثبت یادداشت با خطا مواجه شد!");
      }
    }
  };

  const startEditingComment = (commentId, currentText) => {
    setEditingCommentId(commentId);
    setEditCommentText(currentText);
    setReplyingToCommentId(null); // Cancel any active reply
  };

  const cancelEditing = () => {
    setEditingCommentId(null);
    setEditCommentText("");
  };

  const submitEditComment = async (commentId, e) => {
    e.preventDefault();
    if (editCommentText.trim()) {
      try {
        const response = await axios.patch(
          `${commentsBaseAPI}/${documentId}/comment/${commentId}/`,
          {
            text: editCommentText,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `JWT ${token}`,
            },
          }
        );

        setEditingCommentId(null);
        setEditCommentText("");

        if (
          socketRef.current &&
          socketRef.current.readyState === WebSocket.OPEN
        ) {
          socketRef.current.send(
            JSON.stringify({ type: "comment_updated", data: response.data })
          );
        }
      } catch (error) {
        console.log(error);
        showErrorToast("ویرایش یادداشت با خطا مواجه شد!");
      }
    }
  };

  const startReply = (commentId) => {
    setReplyingToCommentId(commentId);
    setReplyText("");
    setEditingCommentId(null); // Cancel any active edit
  };

  const cancelReply = () => {
    setReplyingToCommentId(null);
    setReplyText("");
  };

  const submitReply = async (commentId, e) => {
    e.preventDefault();
    if (replyText.trim()) {
      try {
        const response = await axios.post(
          `${replyBaseAPI}/`,
          {
            author: currentUser.username,
            comment: commentId,
            text: replyText,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `JWT ${token}`,
            },
          }
        );

        // console.log(response);

        // const added_reply = response.data;

        // const updatedComments = comments.map((comment) => {
        //   if (comment.id === commentId) {
        //     return {
        //       ...comment,
        //       commentreply_set: [...comment.commentreply_set, added_reply],
        //     };
        //   }
        //   return comment;
        // });
        // setComments(updatedComments);

        setReplyingToCommentId(null);
        setReplyText("");

        if (
          socketRef.current &&
          socketRef.current.readyState === WebSocket.OPEN
        ) {
          socketRef.current.send(
            JSON.stringify({ type: "reply_created", data: response.data })
          );
        }
      } catch (error) {
        console.log(error);
        showErrorToast("ثبت پاسخ با خطا مواجه شد!");
      }
    }
  };

  const deleteComment = async (commentId) => {
    if (window.confirm("آیا مطمئنید که می‌خواهید یادداشت را حذف کنید؟")) {
      const response = await axios.delete(
        `${commentsBaseAPI}/${documentId}/comment/${commentId}`
      );

      if (
        socketRef.current &&
        socketRef.current.readyState === WebSocket.OPEN
      ) {
        socketRef.current.send(
          JSON.stringify({ type: "comment_deleted", data: commentId })
        );
      }
    }
  };

  const deleteReply = (commentId, replyId) => {
    if (
      window.confirm("آیا مطمئنید که می‌خواهید پاسخ به یادداشت را حذف کنید؟")
    ) {
      axios.delete(`${replyBaseAPI}/${replyId}`);

      if (
        socketRef.current &&
        socketRef.current.readyState === WebSocket.OPEN
      ) {
        socketRef.current.send(
          JSON.stringify({
            type: "reply_deleted",
            data: { comment: commentId, reply: replyId },
          })
        );
      }
    }
  };

  const startEditingReply = (replyId, text) => {
    setEditingReplyId(replyId);
    setEditReplyText(text);
    setEditingCommentId(null);
    setEditCommentText(null);
  };

  const cancelEditingReply = () => {
    setEditingReplyId(null);
    setEditReplyText("");
  };

  const submitEditReply = async (commentId, replyId, e) => {
    e.preventDefault();
    if (editReplyText.trim()) {
      try {
        const response = await axios.patch(
          `${replyBaseAPI}/${replyId}/`,
          {
            text: editReplyText,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `JWT ${token}`,
            },
          }
        );

        setEditingReplyId(null);
        setEditReplyText("");

        if (
          socketRef.current &&
          socketRef.current.readyState === WebSocket.OPEN
        ) {
          socketRef.current.send(
            JSON.stringify({ type: "reply_updated", data: response.data })
          );
        }
      } catch (error) {
        console.log(error);
        showErrorToast("ویرایش پاسخ با خطا مواجه شد!");
      }
    }
  };

  return (
    <div className="comment-system-container">
      <div className="comment-system-header">
        <p>یادداشت‌ها</p>
        <button className="close-button" onClick={onClose}>
          <IconBack />
        </button>
      </div>

      <div className="comment-list">
        {comments.length === 0 ? (
          <p className="no-comments">یادداشتی وجود ندارد!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="comment-item">
              <div className="comment-header">
                <div className="comment-author">
                  {comment.author_username === currentUser.username
                    ? "شما"
                    : comment.author_firstname && comment.author_firstname
                    ? `${comment.author_firstname} ${comment.author_lastname}`
                    : comment.author_username}
                </div>
                <div className="comment-time">
                  {convertDate(comment.updated_at)}
                </div>
                {comment.author_username === currentUser.username && (
                  <div className="comment-actions">
                    <button
                      className="action-button edit-button"
                      onClick={() => {
                        startEditingComment(comment.id, comment.text);
                      }}
                    >
                      ویرایش
                    </button>
                    <button
                      className="action-button delete-button"
                      onClick={() => deleteComment(comment.id)}
                    >
                      حذف
                    </button>
                  </div>
                )}
              </div>

              {editingCommentId === comment.id ? (
                <form
                  onSubmit={(e) => submitEditComment(comment.id, e)}
                  className="edit-comment-form"
                >
                  <textarea
                    type="text"
                    value={editCommentText}
                    onChange={(e) => setEditCommentText(e.target.value)}
                    className="edit-comment-input"
                    autoFocus
                  />
                  <div className="edit-actions">
                    <button type="submit" className="save-button">
                      ذخیره
                    </button>
                    <button
                      type="button"
                      className="cancel-button"
                      onClick={cancelEditing}
                    >
                      لغو
                    </button>
                  </div>
                </form>
              ) : (
                <div className="comment-text">
                  {toPersianDigit(comment.text)}
                </div>
              )}

              <button
                className="reply-button"
                onClick={() => startReply(comment.id)}
              >
                پاسخ
              </button>

              {replyingToCommentId === comment.id && (
                <form
                  onSubmit={(e) => submitReply(comment.id, e)}
                  className="reply-form"
                >
                  <textarea
                    type="text"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="به این یادداشت پاسخ دهید..."
                    className="reply-input"
                    autoFocus
                    rows={1}
                  />
                  <div className="reply-actions">
                    <button type="submit" className="post-reply-button">
                      ثبت
                    </button>
                    <button
                      type="button"
                      className="cancel-reply-button"
                      onClick={cancelReply}
                    >
                      لغو
                    </button>
                  </div>
                </form>
              )}
              {/*  */}
              {comment.commentreply_set.length > 0 && (
                <div className="comment-replies">
                  {comment.commentreply_set.map((reply) => (
                    <div key={reply.id} className="reply-item">
                      <div className="comment-header">
                        <div className="reply-author">
                          {reply.author_username === currentUser.username
                            ? "شما"
                            : reply.author_username}
                        </div>
                        <div className="comment-time">
                          {convertDate(reply.updated_at)}
                        </div>
                        {reply.author_username === currentUser.username && (
                          <div className="comment-actions">
                            <button
                              className="action-button edit-button"
                              onClick={() => {
                                startEditingReply(reply.id, reply.text);
                              }}
                            >
                              ویرایش
                            </button>
                            <button
                              className="action-button delete-reply-button"
                              onClick={() => deleteReply(comment.id, reply.id)}
                            >
                              حذف
                            </button>
                          </div>
                        )}
                      </div>
                      {editingReplyId === reply.id ? (
                        <form
                          onSubmit={(e) =>
                            submitEditReply(comment.id, reply.id, e)
                          }
                          className="edit-comment-form"
                        >
                          <textarea
                            type="text"
                            value={editReplyText}
                            onChange={(e) => setEditReplyText(e.target.value)}
                            className="edit-comment-input"
                            autoFocus
                            rows={1}
                          />
                          <div className="edit-actions">
                            <button type="submit" className="save-button">
                              ذخیره
                            </button>
                            <button
                              type="button"
                              className="cancel-button"
                              onClick={cancelEditingReply}
                            >
                              لغو
                            </button>
                          </div>
                        </form>
                      ) : (
                        <div className="reply-text">
                          {toPersianDigit(reply.text)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleSubmitComment} className="comment-form">
        <textarea
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="یادداشت جدید ثبت کنید..."
          className="comment-input"
          rows={1}
        />
        <button type="submit" className="comment-submit">
          ثبت
        </button>
      </form>
    </div>
  );
}
