import React, { useEffect, useState } from "react";
import * as apiCalls from "../../api/apiCalls";
import UserListItem from "./UserListItem";

const UserList = () => {
  const [page, setPage] = useState({
    content: [],
    number: 0,
    size: 3,
  });

  const [loadError, setLoadError] = useState();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = (requestedPage = 0) => {
    apiCalls
      .listUsers({ page: requestedPage, size: 3 })
      .then((response) => {
        setPage(response.data);
        setLoadError();
      })
      .catch((error) => {
        setLoadError("User load failed");
      });
  };

  const onClickNext = () => {
    loadData(page.number + 1);
  };

  const onClickPrevious = () => {
    loadData(page.number - 1);
  };

  const { content, first, last } = page;

  return (
    <div className="card">
      <h3 className="card-title m-auto">Users</h3>
      <div className="list-group list-group-flush" data-testid="usergroup">
        {content.map((user) => {
          return <UserListItem key={user.username} user={user} />;
        })}
      </div>
      <div className="clearfix">
        {!first && (
          <span
            className="badge text-bg-light float-start"
            onClick={onClickPrevious}
            style={{ cursor: "pointer" }}
          >
            {"<"} previous
          </span>
        )}
        {!last && (
          <span
            className="badge text-bg-light float-end"
            onClick={onClickNext}
            style={{ cursor: "pointer" }}
          >
            next {">"}
          </span>
        )}
      </div>
      {loadError && (
        <span className="text-center text-danger">{loadError}</span>
      )}
    </div>
  );
};

export default UserList;
