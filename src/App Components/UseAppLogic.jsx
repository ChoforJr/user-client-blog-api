import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
const apiUrl = import.meta.env.VITE_BLOG_API_URL;

export function useAppLogic() {
  const { id } = useParams();
  const [auth, setAuth] = useState(false);
  const [posts, setPosts] = useState([]);
  const [account, setAccount] = useState([]);
  const [comments, setComments] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function getComments() {
      try {
        const response = await fetch(`${apiUrl}/comments`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }

        const result = await response.json();
        const neededItems = result.comments.map((item) => {
          return {
            id: item.id,
            keyID: crypto.randomUUID(),
            content: item.content,
            userId: item.userId,
            postId: item.postId,
            createdAt: item.createdAt,
          };
        });
        setComments(neededItems);
      } catch (error) {
        console.error("Network error:", error);
      }
    }
    getComments();

    async function getProfiles() {
      try {
        const response = await fetch(`${apiUrl}/profiles`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }

        const result = await response.json();
        const neededItems = result.profiles.map((item) => {
          return {
            id: item.id,
            keyID: crypto.randomUUID(),
            userId: item.userId,
            displayName: item.displayName,
            bio: item.bio,
            createdAt: item.createdAt,
          };
        });
        setProfiles(neededItems);
      } catch (error) {
        console.error("Network error:", error);
      }
    }
    getProfiles();

    async function getPosts() {
      try {
        const response = await fetch(`${apiUrl}/post`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }

        const result = await response.json();
        const neededItems = result.publishedPosts.map((item) => {
          return {
            id: item.id,
            keyID: crypto.randomUUID(),
            title: item.title,
            content: item.content,
            published: item.published,
            createdAt: item.createdAt,
            userId: item.userId,
            publishedAt: item.publishedAt,
          };
        });
        setPosts(neededItems);
      } catch (error) {
        console.error("Network error:", error);
      }
    }
    getPosts();
  }, []);

  useEffect(() => {
    const authToken = localStorage.getItem("authorization");
    if (authToken) {
      async function getAccountInfo() {
        try {
          const response = await fetch(`${apiUrl}/user/myProfile`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              authorization: `${authToken}`,
            },
          });
          if (!response.ok) {
            if (response.status == 401) {
              setAccount([]);
              setAuth(false);
              localStorage.removeItem("authorization");
            }
            throw new Error(`Response status: ${response.status}`);
          }

          const result = await response.json();
          const neededItems = {
            id: result.user.id,
            keyID: crypto.randomUUID(),
            username: result.user.username,
            createdAt: result.user.createdAt,
            role: result.user.role,
            displayName: result.user.profile.displayName,
            bio: result.user.profile.bio,
          };

          setAccount(neededItems);
          setAuth(true);
        } catch (error) {
          console.error("Network error:", error);
        }
      }
      getAccountInfo();
    }
  }, [auth]);

  function addComment(newComment) {
    setComments((prevComments) => {
      return [...prevComments, newComment];
    });
  }
  function changeComment(newComment) {
    setComments((prevComments) => {
      const updatedComments = prevComments.map((comment) => {
        if (comment.id == newComment.id) {
          return {
            ...comment,
            content: newComment.content,
          };
        }
        return comment;
      });
      return updatedComments;
    });
  }
  async function deleteComment(event, id) {
    event.preventDefault();
    try {
      const authToken = localStorage.getItem("authorization");

      const response = await fetch(`${apiUrl}/user/post/comment/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          authorization: `${authToken}`,
        },
      });

      if (response.ok) {
        setComments((prevComments) => {
          const updatedComments = prevComments.filter(
            (comment) => comment.id != id
          );
          return updatedComments;
        });
      } else {
        const result = await response.json();
        console.log(result);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  }

  function changeAccountInfo(name, value) {
    setAccount((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  }
  async function deleteAccount(event) {
    event.preventDefault();
    try {
      const authToken = localStorage.getItem("authorization");

      const response = await fetch(`${apiUrl}/user/myProfile`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          authorization: `${authToken}`,
        },
      });

      if (response.ok) {
        setAuth(false);
        setAccount([]);
        localStorage.removeItem("authorization");
        navigate("/signIn", { replace: true });
      } else {
        const result = await response.json();
        console.error(result.errors);
        alert("Error, see console logs");
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  }

  return {
    id,
    auth,
    setAuth,
    posts,
    comments,
    addComment,
    changeComment,
    deleteComment,
    account,
    changeAccountInfo,
    deleteAccount,
    profiles,
  };
}
