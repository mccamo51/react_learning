import React, { useContext, useEffect, useState } from "react";
import Page from "./Page";
import LoadingDots from "./LoadingDots";
import { useParams } from "react-router-dom";
import Axios from "axios";
import { useImmerReducer } from "use-immer";
import stateContext from "../StateContext";
import DispatchContext from "../DispatchContext";

function EditPost(props) {
  const stateCon = useContext(stateContext);
  const appDispatch = useContext(DispatchContext);
  const { id } = useParams();

  const initialState = {
    title: {
      value: "",
      hasError: false,
      message: "",
    },
    body: {
      value: "",
      hasError: false,
      message: "",
    },
    id: id,
    isLoading: true,
  };

  function ourReducer(draft, action) {
    switch (action.type) {
      case "fectchData":
        draft.body.value = action.value.body;
        draft.title.value = action.value.title;
        draft.isLoading = false;
        break;
      case "titleChange":
        draft.title.value = action.value;
        break;
      case "bodyChange":
        draft.body.value = action.value;
        break;
      case "finishUpdate":
        if (!draft.title.hasError) {
        }
        break;
      case "startUpdate":
        draft;
        break;
      case "titleError":
        if (!action.value.trim()) {
          draft.title.hasError = true;
          draft.title.message = "Cannot accept empty work.";
        }
        break;
      default:
        break;
    }
  }

  function startUpdate() {
    // dispatch({ type: "startUpdate" });
  }

  const [state, dispatch] = useImmerReducer(ourReducer, initialState);

  useEffect(() => {
    const controller = new AbortController();

    async function getSinglePost() {
      try {
        const response = await Axios.get(`/post/${id}`, {
          signal: controller.signal,
        });
        dispatch({ type: "fectchData", value: response.data });
      } catch (error) {
        console.log("Error loading  ", id);
      }
    }
    getSinglePost();
    return () => {
      controller.abort();
    };
  }, []);

  function updatePost(e) {
    e.preventDefault();

    startUpdate();
    try {
      const response = Axios.post(`/post/${id}/edit`, {
        token: stateCon.user.token,
        title: state.title.value,
        body: state.body.value,
      });
      dispatch({ type: "finishUpdate", value: response.data });
      console.log(response.data);
      appDispatch({ type: "flashMessage", value: "Updated successful" });
    } catch (error) {
      console.log("error updating");
    }
  }
  if (state.isLoading)
    return (
      <Page title="Loading">
        <LoadingDots />
      </Page>
    );
  return (
    <div>
      <Page title="Edit Post">
        <form onSubmit={updatePost}>
          <div className="form-group">
            <label htmlFor="post-title" className="text-muted mb-1">
              <small>Title</small>
            </label>
            <input
              autoFocus
              name="title"
              onBlur={(e) => {
                dispatch({ type: "titleError", value: e.target.value });
              }}
              value={state.title.value}
              id="post-title"
              onChange={(e) => {
                dispatch({
                  type: "titleChange",
                  value: e.target.value,
                });
              }}
              className="form-control form-control-lg form-control-title"
              type="text"
              placeholder=""
              autoComplete="off"
            />
            {state.title.hasError && (
              <div className="alert alert-danger small liveValidateMessage">
                {state.title.message}
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="post-body" className="text-muted mb-1 d-block">
              <small>Body Content</small>
            </label>
            <textarea
              name="body"
              id="post-body"
              onChange={(e) => {
                dispatch({ type: "bodyChange", value: e.target.value });
              }}
              value={state.body.value}
              className="body-content tall-textarea form-control"
              type="text"
            ></textarea>
          </div>

          <button className="btn btn-primary">Update Post</button>
        </form>
      </Page>
    </div>
  );
}

export default EditPost;
