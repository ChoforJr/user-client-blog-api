import styles from "./posts.module.css";
import { useNavigate } from "react-router-dom";
import { ItemContext } from "../ItemContext";
import { useContext } from "react";

const Posts = () => {
  const { posts, comments } = useContext(ItemContext);
  const navigate = useNavigate();
  function getPost(event) {
    const { id } = event.currentTarget;
    navigate(`/posts/${id}`, { replace: false });
  }

  if (posts.length == 0) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className={styles.posts}>
      {posts.map((item) => (
        <article
          key={item.keyID}
          className={styles.postArticle}
          id={item.id}
          onClick={getPost}
        >
          <h2>{item.title} </h2>
          <p className={styles.content}>{item.content}</p>
          <p>Created On: {new Date(item.createdAt).toLocaleString()}</p>
          <p>
            Comments:{" "}
            {comments.filter((comment) => comment.postId === item.id).length}
          </p>
          <p style={{ color: "#ADFF2F" }}>
            {" "}
            Published On: {new Date(item.publishedAt).toLocaleString()}
          </p>
        </article>
      ))}
    </div>
  );
};

export default Posts;
