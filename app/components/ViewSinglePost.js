import React, { useEffect, useState } from "react";
import Page from "./Page";
import Axios from "axios";
import { Link, useParams } from "react-router-dom";
import LoadingDots from "./LoadingDots";
import ReactMarkdown from "react-markdown"

function ViewSinglePost(param) {
  const { id } = useParams();
  const [singlePost, setSinglePost] = useState({});
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function getSinglePost() {
      try {
        const response = await Axios.get(`/post/${id}`);
        setSinglePost(response.data);
        setLoading(false);
        console.log(response.data);
      } catch (error) {
        setLoading(false);

        console.log("Error loading post");
      }
    }
    getSinglePost();
  }, []);
  if (loading)
    return (
      <Page title="Loading">
        <LoadingDots />
      </Page>
    );

  return (
    <Page title={singlePost.title}>
      <div className="d-flex justify-content-between">
        <h2>{singlePost.title}</h2>
        <span className="pt-2">
          <Link to={`/post/${singlePost._id}/edit`} className="text-primary mr-2" title="Edit">
            <i className="fas fa-edit"></i>
          </Link>
          <Link
            to={`/`}
            className="delete-post-button text-danger"
            title="Delete"
          >
            <i className="fas fa-trash"></i>
          </Link>
        </span>
      </div>

      <p className="text-muted small mb-4">
        <Link to={`/profile/${singlePost.author?.username}`}>
          <img className="avatar-tiny" src={singlePost.author?.avatar} />
        </Link>
        Posted by{" "}
        <Link to={`/profile/${singlePost.author?.username}`}>
          {singlePost.author?.username}
        </Link>{" "}
        on {new Date(singlePost.createdDate).toDateString()}
      </p>

      <div className="body-content">
        <ReactMarkdown children={singlePost.body} allowedElements = {["p", "a", ]}/>
      </div>
    </Page>
  );
}

export default ViewSinglePost;
