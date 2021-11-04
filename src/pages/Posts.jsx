import React, {useEffect, useState} from "react";
import {usePosts} from "../hooks/usePosts";
import {getPageCount, getPagesArray} from "../utils/pages";
import {useFetching} from "../hooks/useFetching";
import PostService from "../API/PostService";
import MyButton from "../components/UI/button/MyButton";
import MyModal from "../components/UI/MyModal/MyModal";
import PostFilter from "../components/PostFilter";
import PostForm from "../components/PostForm";
import PostList from "../components/PostList";
import Loader from "../components/UI/Loader/Loader";

function Posts() {

    const [posts, setPosts] = useState([])
    const [filter, setFilter] = useState({sort: '', query: ''})
    const [modal, setModal] = useState(false)
    const sortedAndSearchPosts = usePosts(posts, filter.sort, filter.query)
    const [totalPages, setTotalPages] = useState(0)
    const [limit, setLimit] = useState(10)
    const [page, setPage] = useState(1)

    let pagesArray = getPagesArray(totalPages)

    const [fetchPosts, isPostsLoading, postError] = useFetching(async () => {
        const response = await PostService.getAll(limit, page)
        setPosts(response.data)
        const totalCount = response.headers['x-total-count']
        setTotalPages(getPageCount(totalCount, limit))
    })

    useEffect(() => {
        fetchPosts()
    }, [page])

    const createPost = (newPost) => {
        setPosts([...posts, newPost])
        setModal(false)
    }

    const removePost = (post) => {
        setPosts(posts.filter(p => p.id !== post.id))
    }

    const changePage = (page) => {
        setPage(page)
    }

    return (
        <div className="App">
            <MyButton style={{marginTop: 30}} onClick={() => setModal(true)}>
                Создать пользователя
            </MyButton>
            <MyModal visible={modal} setVisible={setModal}>
                <PostForm create={createPost}/>
            </MyModal>
            <hr style={{margin: '15px 0'}}/>
            <PostFilter
                filter={filter}
                setFilter={setFilter}
            />
            {postError &&
                <h1>Произошла ошибка</h1>
            }

            <PostList remove={removePost} posts={sortedAndSearchPosts} title="Список постов"/>
            {isPostsLoading &&
                 <div style={{display: 'flex', justifyContent: 'center', marginTop: 50}}><Loader/></div>
            }

            <div className="page__wrapper">
                {pagesArray.map(p =>
                    <span
                        onClick={() => changePage(p)}
                        key={p}
                        className={page === p ? 'page page__current' : 'page'}>
                        {p}
                    </span>
                )}
            </div>
        </div>
    );
}

export default Posts;
