import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import GameCard from '../components/GameCard';

interface Game {
  id: string;
  title: string;
  createdAt: string;
  pieces: any[];
}

export default function Dashboard() {
  const { user } = useAuth();
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'pieces'>('date');

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/games`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setGames(response.data);
    } catch (error) {
      console.error('Error fetching games:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (gameId: string) => {
    if (!window.confirm('Are you sure you want to delete this game?')) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/games/${gameId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setGames(games.filter(game => game.id !== gameId));
    } catch (error) {
      console.error('Error deleting game:', error);
    }
  };

  const filteredGames = games
    .filter(game => 
      game.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.title.localeCompare(b.title);
        case 'pieces':
          return (b.pieces?.length || 0) - (a.pieces?.length || 0);
        case 'date':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

  if (!user) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to Game Creator</h2>
        <p className="text-gray-600 mb-8">Please log in to view your games.</p>
        <Link
          to="/login"
          className="bg-primary-600 text-white px-6 py-3 rounded-md hover:bg-primary-700"
        >
          Login
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Games</h1>
          <p className="text-gray-600 mt-1">You have created {games.length} games</p>
        </div>
        <Link
          to="/editor"
          className="bg-primary-600 text-white px-6 py-3 rounded-md hover:bg-primary-700 inline-flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create New Game
        </Link>
      </div>

      {/* Search and Sort */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Search Games
            </label>
            <div className="relative">
              <input
                type="text"
                id="search"
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                placeholder="Search by game title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
          <div>
            <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-1">
              Sort By
            </label>
            <select
              id="sort"
              className="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
            >
              <option value="date">Latest</option>
              <option value="name">Name</option>
              <option value="pieces">Most Pieces</option>
            </select>
          </div>
        </div>
      </div>

      {/* Games Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGames.length === 0 ? (
          searchTerm ? (
            <div className="col-span-full text-center py-12 bg-white rounded-lg shadow">
              <p className="text-gray-600">No games found matching "{searchTerm}"</p>
            </div>
          ) : (
            <div className="col-span-full text-center py-12 bg-white rounded-lg shadow">
              <p className="text-gray-600">No games yet. Create your first game!</p>
            </div>
          )
        ) : (
          filteredGames.map(game => (
            <GameCard
              key={game.id}
              {...game}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </div>
  );
} 