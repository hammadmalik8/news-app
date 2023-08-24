import React, { useEffect, useState } from "react";
import NewsItem from "./NewsItem";
import Spinner from "./Spinner";
import InfiniteScroll from "react-infinite-scroll-component";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const News = (props) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("");
  const [source, setSource] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [topHeading, setTopHeading] = useState("");
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(20);
  const [publish_date_start, setpublish_date_start] = useState("");
  const [publish_date_end, setpublish_date_end] = useState("");

  const handleStartDateChange = (date) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
  };

  const updateNews = async () => {
    props.setProgress(10);
    let data = await fetch(`http://127.0.0.1:8000/api/search`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("Authorization"),
      },
      body: JSON.stringify({
        title,
        author,
        category,
        source,
        pagesize: page,
        perpage: totalResults,
      }),
    });
    setLoading(true);
    props.setProgress(30);
    let parseData = await data.json();
    props.setProgress(70);
    setArticles([...parseData.data]);
    setTotalResults(parseData.size);
    setLoading(false);
    props.setProgress(100);
    setPage(page + 1);
  };
  useEffect(() => {
    updateNews();
    // eslint-disable-next-line
  }, []);
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const filterNews = async () => {
    const fromDate =
      startDate === ""
        ? ""
        : `${startDate.getFullYear()}-${(startDate.getMonth() + 1)
          .toString()
          .padStart(2, 0)}-${startDate.getDate()}`;
    const toDate =
      endDate === ""
        ? ""
        : `${endDate.getFullYear()}-${(endDate.getMonth() + 1)
          .toString()
          .padStart(2, 0)}-${endDate.getDate()}`;
    try {
      props.setProgress(10);
      const response = await fetch(
        `http://localhost:8000/api/search`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("Authorization"),
          },
          body: JSON.stringify({
            title: title.trim(),
            author,
            category,
            source,
            publish_date_start: fromDate,
            publish_date_end: toDate,
            pagesize: 1,
          }),
        }
      );
      setpublish_date_start(fromDate)
      setpublish_date_end(toDate)
      setLoading(true);
      if (response.ok) {
        setPage(2);
        props.setProgress(30);
        const parseData = await response.json();
        setTopHeading(category);
        props.setProgress(70);
        setArticles([...parseData.data]);
        setTotalResults(parseData.size);
        setLoading(false);
        props.setProgress(100);
      } else {
        console.log("Response error");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchMoreData = async () => {
    props.setProgress(10);
    let data = await fetch(`http://localhost:8000/api/search`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("Authorization"),
      },
      body: JSON.stringify({
        title,
        author,
        category,
        source,
        publish_date_start,
        publish_date_end,
        pagesize: page,
        perpage: totalResults,
      }),
    });
    setPage(page + 1);
    let parseData = await data.json();
    setArticles((prevState) => [...prevState, ...parseData.data]);
    setTotalResults(parseData.size);
    props.setProgress(100);
  };
  return (
    <>
      <div className="container" style={{ paddingTop: "65px" }}>
        <div className="row">
          <div className="col-md-6 col-sm-4">
            <h2>Top - {capitalizeFirstLetter(topHeading)} News</h2>
          </div>
          <div className="col-md-4 col-sm-8 text-end">
            <div className="form-outline form-white mb-2">
              <input
                className="form-control"
                type="text"
                placeholder="Search the title"
                aria-label="default input example"
                onChange={(e) => setTitle(e.target.value.trim())}
              />
            </div>
          </div>
          <div className="col-md-2 col-sm-2 text-end">
            <button
              type="button"
              className="btn btn-dark me-1"
              onClick={filterNews}
              style={{ padding: "0.375rem 1.5rem" }}
            >
              Search
            </button>
            <button
              type="button"
              className="btn btn-dark"
              data-bs-toggle="modal"
              data-bs-target="#exampleModal"
              style={{ padding: "0.375rem 1.5rem" }}
            >
              Filter
            </button>
          </div>
        </div>
      </div>

      {/* {loading && <Spinner />} */}
      <InfiniteScroll
        dataLength={articles.length}
        next={fetchMoreData}
        hasMore={totalResults > 0}
        loader={<Spinner />}
      >
        <div className="container">
          <div className="row">
            {articles.map((element, index) => {
              return (
                <div className="col-md-4 my-2" key={index}>
                  <NewsItem
                    title={
                      element.title ? element.title.slice(0, 50) : "Unknown ..."
                    }
                    description={
                      element.content ? element.content.slice(0, 90) : ""
                    }
                    imgUrl={element.urlToImage}
                    newsUrl={element.url}
                    author={element.author}
                    date={element.publishedAt}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </InfiniteScroll>

      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Filter
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="form-outline form-white mb-4">
                <input
                  className="form-control"
                  type="text"
                  placeholder="Author"
                  aria-label="default input example"
                  onChange={(e) => setAuthor(e.target.value)}
                />
              </div>
              <div className="form-outline form-white mb-4">
                <select
                  className="form-select"
                  aria-label="Category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">Select Category</option>
                  <option value="technology">technology</option>
                  <option value="business">business</option>
                  <option value="health">health</option>
                  <option value="science">science</option>
                  <option value="sports">sports</option>
                  <option value="entertainment">entertainment</option>
                  <option value="general">general</option>
                </select>
              </div>

              <div className="form-outline form-white mb-4">
                <select
                  className="form-select"
                  aria-label="Source"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                >
                  <option value="">Select Source</option>
                  <option value="News Api">News Api</option>
                  <option value="New York Times">New York Times</option>
                </select>
              </div>

              <div className="form-outline form-white mb-4">
                <DatePicker
                  className="me-1 datePicker"
                  selected={startDate}
                  onChange={handleStartDateChange}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  placeholderText="Start Date"
                  dateFormat={"yyyy-MM-dd"}
                />
              </div>
              <div className="form-outline form-white mb-4">
                <DatePicker
                  className="me-1 datePicker"
                  selected={endDate}
                  onChange={handleEndDateChange}
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  minDate={startDate}
                  placeholderText="End Date"
                  dateFormat={"yyyy-MM-dd"}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-dark"
                onClick={filterNews}
                data-bs-dismiss="modal"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default News;
