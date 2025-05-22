import { useState, useEffect } from "react";
import { showErrorToast, showSuccessToast } from "../../Utilities/Toast.js";
import "./Comment.css";
import { IconBack } from "../ContentEdit/Icons";
import axios from "axios";
import CookieManager from "../../Managers/CookieManager";
import { format, newDate } from "date-fns-jalali";
import { parseISO } from "date-fns";
import { faIR } from "date-fns-jalali/locale";

const commentsBaseAPI = "http://iransanad.fiust.ir/api/v1/docs/document";
const replyBaseAPI = "http://iransanad.fiust.ir/api/v1/docs/commentreply";

export default function CommentSystem({ documentId, currentUser, onClose }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentText, setEditCommentText] = useState("");
  const [replyingToCommentId, setReplyingToCommentId] = useState(null);
  const [replyText, setReplyText] = useState("");

  const [editingReplyId, setEditingReplyId] = useState(null);
  const [editReplyText, setEditReplyText] = useState("");

  const token = CookieManager.LoadToken();

  // const commentType = {
  // "id": 1,
  // "author_username": "erfan",
  // "text": "این یک یادداشت است",
  // "range_start": {},
  // "range_end": {},
  // "is_resolved": false,
  // "resolved_by": 1,
  //  created_at: "",
  //  updated_at: "",
  //  commentreply_set = [
  //  {
  //   "id": 1,
  //   "author_username": "test",
  //   "comment": 1,
  //   "text": "hello guys!!!",
  //   "created_at": "2025-05-22T16:00:14.773191+03:30",
  //   "updated_at": "2025-05-22T16:00:14.773236+03:30"
  //  }
  // ]
  // };

  // Convert Date
  const convertDate = (dateString) => {
    const date = parseISO(dateString);
    const persianDate = format(date, "d MMMM - HH:mm", { locale: faIR });
    return persianDate;
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

        const mockData = [
          {
            id: "1",
            text: "ابزار بالا نیاز به افزایش دارد.",
            author: "حامد",
            authorId: "user1",
            createdAt: new Date(),
            replies: [
              {
                id: "1-1",
                text: "موافقم، مهران باید اصلاح کند.",
                author: "کوروش",
                authorId: "user2",
                createdAt: new Date(),
              },
            ],
          },
          {
            id: "2",
            text: "الان عالی شد!",
            author: "مهران",
            authorId: "user3",
            createdAt: new Date(),
            replies: [],
          },
        ];
        setComments(mockData);
      });
  }, [documentId]);

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

        const added_comment = response.data;
        setComments([...comments, added_comment]);
        setNewComment("");
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

        const editted_comment = response.data;

        setComments(
          comments.map((comment) =>
            comment.id === commentId ? editted_comment : comment
          )
        );
        setEditingCommentId(null);
        setEditCommentText("");
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

        console.log(response);

        const added_reply = response.data;

        const updatedComments = comments.map((comment) => {
          if (comment.id === commentId) {
            return {
              ...comment,
              commentreply_set: [...comment.commentreply_set, added_reply],
            };
          }
          return comment;
        });

        setComments(updatedComments);
        setReplyingToCommentId(null);
        setReplyText("");
      } catch (error) {
        console.log(error);
        showErrorToast("ثبت پاسخ با خطا مواجه شد!");
      }
    }
  };

  const deleteComment = (commentId) => {
    if (window.confirm("آیا مطمئنید که می‌خواهید یادداشت را حذف کنید؟")) {
      setComments(comments.filter((comment) => comment.id !== commentId));
      axios.delete(`${commentsBaseAPI}/${documentId}/comment/${commentId}`);
    }
  };

  const deleteReply = (commentId, replyId) => {
    if (
      window.confirm("آیا مطمئنید که می‌خواهید پاسخ به یادداشت را حذف کنید؟")
    ) {
      setComments(
        comments.map((comment) => {
          if (comment.id === commentId) {
            return {
              ...comment,
              commentreply_set: comment.commentreply_set.filter(
                (reply) => reply.id !== replyId
              ),
            };
          }
          return comment;
        })
      );

      axios.delete(`${replyBaseAPI}/${replyId}`);
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
        console.log(response);

        const editted_reply = response.data;

        setComments(
          comments.map((comment) => {
            if (comment.id === commentId) {
              return {
                ...comment,
                commentreply_set: comment.commentreply_set.map((reply) =>
                  reply.id === replyId ? editted_reply : reply
                ),
              };
            }
            return comment;
          })
        );

        setEditingReplyId(null);
        setEditReplyText("");
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
                <div className="comment-text">{comment.text}</div>
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
                        <div className="reply-text">{reply.text}</div>
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
