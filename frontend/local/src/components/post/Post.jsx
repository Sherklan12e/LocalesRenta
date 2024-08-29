import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PostPage = () => {
    const [content, setContent] = useState('');
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const token = localStorage.getItem('access_token');
                const response = await axios.get('http://localhost:8000/api/posts/', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setPosts(response.data);
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    console.error('Unauthorized - Token may have expired');
                    // Redirigir al usuario al login o refrescar el token si estás usando refresh tokens
                } else {
                    console.error('Error fetching posts:', error);
                }
            }
        };

        fetchPosts();
    }, []);

    const refreshAccessToken = async () => {
        try {
            const response = await axios.post('http://localhost:8000/api/token/refresh/', {
                refresh: localStorage.getItem('refresh_token'),
            });
            localStorage.setItem('access_token', response.data.access);
            return response.data.access; // Devuelve el nuevo token de acceso
        } catch (error) {
            console.error('Error refreshing access token:', error);
            window.location.href = '/login'; // Redirigir al usuario a la página de login
            throw error; // Propaga el error
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = await refreshAccessToken(); // Refrescar el token de acceso

            await axios.post('http://localhost:8000/api/posts/', { content }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setContent('');
            const response = await axios.get('http://localhost:8000/api/posts/', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setPosts(response.data);
        } catch (error) {
            console.error('Error creating post:', error);
        }
    };

    const handleDelete = async (postId) => {
        try {
            const token = await refreshAccessToken(); // Refrescar el token de acceso

            await axios.delete(`http://localhost:8000/api/posts/${postId}/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            // Actualizar el estado después de eliminar el post
            setPosts(posts.filter(post => post.id !== postId));
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Create a Post</h2>
        <form onSubmit={handleSubmit} className="mb-6">
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What's on your mind?"
                className="w-full p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
                type="submit"
                className="mt-2 px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                Post
            </button>
        </form>

        <h3 className="text-xl font-semibold mb-2">Posts</h3>
        <ul className="space-y-4">
            {posts.map(post => (
                <li key={post.id} className="p-4 bg-gray-100 rounded-lg shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <strong className="text-lg font-medium">{post.username}:</strong>
                        {post.username === localStorage.getItem('username') && (
                            <button
                                onClick={() => handleDelete(post.id)}
                                className="px-2 py-1 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                            >
                                Delete
                            </button>
                        )}
                    </div>
                    <p className="text-gray-700">{post.content}</p>
                    <em className="text-sm text-gray-500">{new Date(post.created_at).toLocaleString()}</em>
                </li>
            ))}
        </ul>
    </div>
    );
};

export default PostPage;
