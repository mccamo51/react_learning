import React, { useEffect, useContext, useState } from "react";
import Axios from "axios";
import { Link, useParams } from "react-router-dom";
import LoadingDots from "./LoadingDots";
import Page from "./Page";

function ProfilePost(param) {
  const { username } = useParams(param);
  const [userPost, setUserPost] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getAllPost() {
      try {
        const response = await Axios.get(`/profile/${username}/posts`);
        setLoading(false);
        setUserPost(response.data);
      } catch (error) {
        setLoading(false);

        console.log("Error loading post");
      }
    }
    getAllPost();
  }, []);
  if (loading)
    return (
      <Page title="Loading">
        <LoadingDots />
      </Page>
    );
  return (
    <div>
      <div className="list-group">
        {userPost.map((post) => {
          return (
            <div key={post._id}>
              <Link
                to={`/post/${post._id}`}
                className="list-group-item list-group-item-action"
              >
                <img className="avatar-tiny" src={post.author.avatar} />{" "}
                <strong>{post.title}</strong>
                <span className="text-muted small">
                  {" "}
                  on {new Date(post.createdDate).toDateString()}{" "}
                </span>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ProfilePost;
