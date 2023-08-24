import React from "react";

const NewsItem = (props)=> {
    const { title, description, imgUrl, newsUrl, author, date } = props;
    return (
      <div>
        <div className="card">
          <img
            src={
              !imgUrl
                ? "https://i.gadgets360cdn.com/large/spacex_reuters_1556260807227.JPG"
                : imgUrl
            }
            className="card-img-top"
            alt="..."
            style={{ height: "170px" }}
          />
          <div className="card-body">
            <h5 className="card-title">{title}...</h5>
            <p className="card-text">{description}...</p>
            <p className="card-text">
              <small className="text-muted">
                By {!author ? "unknown" : author} on{" "}
                {new Date(date).toGMTString()}
              </small>
            </p>
            <a
              href={newsUrl}
              target="_blank"
              rel="noreferrer"
              className="btn btn-sm btn-dark"
            >
              Read More
            </a>
          </div>
        </div>
      </div>
    );
  }

export default NewsItem;
