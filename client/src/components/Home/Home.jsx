import React, { useState, useEffect } from "react";
import {
  Container,
  Grow,
  Grid,
  Paper,
  AppBar,
  TextField,
  Button,
  Autocomplete,
} from "@mui/material";
import Posts from "../Posts/Posts";
import { useNavigate, useLocation } from "react-router-dom";
import Form from "../Form/Form.jsx";
import { getPosts, getPostsBySearch } from "../../actions/posts";
import { useDispatch } from "react-redux";
import useStyles from "./styles";
import Pagination from "../Pagination.jsx";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const Home = () => {
  const [currentId, setCurrentId] = useState(0);
  const classes = useStyles();
  const dispatch = useDispatch();
  const query = useQuery();
  const navigate = useNavigate();
  const page = query.get("page") || 1;
  const searchQuery = query.get("searchQuery");
  const [search, setSearch] = useState("");
  const [tags, setTags] = useState([]);

  useEffect(() => {
    dispatch(getPosts(page));
  }, [dispatch, page]);

  const searchPost = () => {
    if (search.trim() || (tags && tags.length > 0)) {
      const formattedTags = tags
        .map((tag) => tag.trim().toLowerCase())
        .join(",");
      dispatch(getPostsBySearch({ search, tags: formattedTags }));
      navigate(
        `/posts/search?searchQuery=${search || "none"}&tags=${formattedTags}`
      );
    } else {
      navigate("/");
    }
  };

  const handleKeyPress = (e) => {
    if (e.keyCode === "13") {
      searchPost();
    }
  };

  return (
    <Grow in>
      <Container maxWidth="xl">
        <Grid
          className={classes.gridContainer}
          container
          justifyContent="space-between"
          alignItems="stretch"
          spacing={3}
        >
          <Grid item xs={12} sm={6} md={9}>
            <Posts setCurrentId={setCurrentId} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <AppBar
              className={classes.appBarSearch}
              position="static"
              color="inherit"
            >
              <TextField
                name="search"
                variant="outlined"
                label="Search Memories"
                onKeyDown={handleKeyPress}
                fullWidth
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Autocomplete
                multiple
                freeSolo
                options={[]}
                value={tags}
                onChange={(event, newValue) => setTags(newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    label="Search Tags"
                  />
                )}
                style={{ margin: "10px 0" }}
              />
              <Button
                onClick={searchPost}
                className={classes.searchButton}
                variant="contained"
                color="primary"
              >
                Search
              </Button>{" "}
            </AppBar>
            <Form currentId={currentId} setCurrentId={setCurrentId} />
            {!searchQuery && !tags.length && (
              <Paper elevation={6} className={classes.pagination}>
                <Pagination page={page} />
              </Paper>
            )}
          </Grid>
        </Grid>
      </Container>
    </Grow>
  );
};

export default Home;
