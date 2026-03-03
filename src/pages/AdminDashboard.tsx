import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../contexts/AdminContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Shield,
  LogOut,
  Users,
  FolderOpen,
  FileText,
  Search,
  Eye,
  RefreshCw,
  Loader2,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import {
  collection,
  getDocs,
} from 'firebase/firestore';
import { db, COLLECTIONS, isFirebaseConfigured } from '../utils/firebase';

interface UserProfile {
  id: string;
  clerk_user_id: string;
  email: string;
  name: string;
  avatar_url?: string;
  created_at: string;
}

interface SavedItem {
  id: string;
  user_id: string;
}

interface CustomFolder {
  id: string;
  user_id: string;
}

interface UserWithStats extends UserProfile {
  itemCount: number;
  folderCount: number;
}

const AdminDashboard: React.FC = () => {
  const { isAdminAuthenticated, adminLogout } = useAdmin();
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState({ users: 0, items: 0, folders: 0 });
  const [sortField, setSortField] = useState<'name' | 'email' | 'created_at' | 'itemCount' | 'folderCount'>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAdminAuthenticated) {
      navigate('/admin');
    }
  }, [isAdminAuthenticated, navigate]);

  // Load all users
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    if (!db || !isFirebaseConfigured) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      // Get all users
      const usersSnapshot = await getDocs(collection(db, COLLECTIONS.USER_PROFILES));
      const usersData = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as UserProfile[];

      // Get all items and folders to calculate per-user counts
      const itemsSnapshot = await getDocs(collection(db, COLLECTIONS.SAVED_ITEMS));
      const foldersSnapshot = await getDocs(collection(db, COLLECTIONS.CUSTOM_FOLDERS));

      const itemsData = itemsSnapshot.docs.map(doc => doc.data()) as SavedItem[];
      const foldersData = foldersSnapshot.docs.map(doc => doc.data()) as CustomFolder[];

      // Create user count maps
      const itemCountMap: Record<string, number> = {};
      const folderCountMap: Record<string, number> = {};

      itemsData.forEach(item => {
        itemCountMap[item.user_id] = (itemCountMap[item.user_id] || 0) + 1;
      });

      foldersData.forEach(folder => {
        folderCountMap[folder.user_id] = (folderCountMap[folder.user_id] || 0) + 1;
      });

      // Merge counts with user data
      const usersWithStats: UserWithStats[] = usersData.map(user => ({
        ...user,
        itemCount: itemCountMap[user.id] || 0,
        folderCount: folderCountMap[user.id] || 0,
      }));
      
      setUsers(usersWithStats);
      
      setStats({
        users: usersData.length,
        items: itemsSnapshot.size,
        folders: foldersSnapshot.size,
      });
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    adminLogout();
    navigate('/admin');
  };

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredUsers = users.filter(user =>
    user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    let comparison = 0;
    
    switch (sortField) {
      case 'name':
        comparison = (a.name || '').localeCompare(b.name || '');
        break;
      case 'email':
        comparison = (a.email || '').localeCompare(b.email || '');
        break;
      case 'created_at':
        comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        break;
      case 'itemCount':
        comparison = a.itemCount - b.itemCount;
        break;
      case 'folderCount':
        comparison = a.folderCount - b.folderCount;
        break;
    }
    
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  // Pagination
  const totalPages = Math.ceil(sortedUsers.length / itemsPerPage);
  const paginatedUsers = sortedUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return 'Unknown';
    }
  };

  if (!isAdminAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-sm border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-sm text-slate-400">SaveIt Management</p>
            </div>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-slate-600 text-slate-300 hover:bg-slate-700"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Total Users</p>
                <p className="text-2xl font-bold text-white">{stats.users}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Total Items</p>
                <p className="text-2xl font-bold text-white">{stats.items}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-600/20 rounded-lg flex items-center justify-center">
                <FolderOpen className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Total Folders</p>
                <p className="text-2xl font-bold text-white">{stats.folders}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Users Table */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-6">
            {/* Search and Refresh */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500"
                />
              </div>
              <Button
                onClick={loadUsers}
                variant="outline"
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-24">
                <Loader2 className="w-10 h-10 text-purple-400 animate-spin" />
              </div>
            ) : (
              <>
                {/* Table */}
                <div className="rounded-lg border border-slate-700 overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-700/50 hover:bg-slate-700/50 border-slate-700">
                        <TableHead className="text-slate-300 w-12">#</TableHead>
                        <TableHead>
                          <Button
                            variant="ghost"
                            onClick={() => handleSort('name')}
                            className="text-slate-300 hover:text-white -ml-4"
                          >
                            Name
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          </Button>
                        </TableHead>
                        <TableHead>
                          <Button
                            variant="ghost"
                            onClick={() => handleSort('email')}
                            className="text-slate-300 hover:text-white -ml-4"
                          >
                            Email
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          </Button>
                        </TableHead>
                        <TableHead>
                          <Button
                            variant="ghost"
                            onClick={() => handleSort('folderCount')}
                            className="text-slate-300 hover:text-white -ml-4"
                          >
                            Folders
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          </Button>
                        </TableHead>
                        <TableHead>
                          <Button
                            variant="ghost"
                            onClick={() => handleSort('itemCount')}
                            className="text-slate-300 hover:text-white -ml-4"
                          >
                            Items
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          </Button>
                        </TableHead>
                        <TableHead>
                          <Button
                            variant="ghost"
                            onClick={() => handleSort('created_at')}
                            className="text-slate-300 hover:text-white -ml-4"
                          >
                            Joined
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          </Button>
                        </TableHead>
                        <TableHead className="text-slate-300 text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedUsers.length > 0 ? (
                        paginatedUsers.map((user, index) => (
                          <TableRow
                            key={user.id}
                            className="border-slate-700 hover:bg-slate-700/30"
                          >
                            <TableCell className="text-slate-400 font-mono text-sm">
                              {(currentPage - 1) * itemsPerPage + index + 1}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                {user.avatar_url ? (
                                  <img
                                    src={user.avatar_url}
                                    alt={user.name || 'User'}
                                    className="w-8 h-8 rounded-full object-cover"
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).style.display = 'none';
                                      (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                                    }}
                                  />
                                ) : null}
                                <div className={`w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-medium ${user.avatar_url ? 'hidden' : ''}`}>
                                  {(user.name || user.email)?.[0]?.toUpperCase() || '?'}
                                </div>
                                <span className="text-white font-medium">
                                  {user.name || 'No Name'}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="text-slate-300">
                              {user.email}
                            </TableCell>
                            <TableCell>
                              <span className="inline-flex items-center gap-1 text-yellow-400">
                                <FolderOpen className="w-4 h-4" />
                                {user.folderCount}
                              </span>
                            </TableCell>
                            <TableCell>
                              <span className="inline-flex items-center gap-1 text-green-400">
                                <FileText className="w-4 h-4" />
                                {user.itemCount}
                              </span>
                            </TableCell>
                            <TableCell className="text-slate-400">
                              {formatDate(user.created_at)}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => navigate(`/admin/user/${user.id}`)}
                                className="text-purple-400 hover:text-purple-300 hover:bg-purple-600/20"
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                View
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-12 text-slate-400">
                            {searchQuery ? 'No users found matching your search' : 'No users registered yet'}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-4">
                    <p className="text-sm text-slate-400">
                      Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                      {Math.min(currentPage * itemsPerPage, sortedUsers.length)} of{' '}
                      {sortedUsers.length} users
                    </p>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="border-slate-600 text-slate-300 hover:bg-slate-700 disabled:opacity-50"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <span className="text-sm text-slate-300">
                        Page {currentPage} of {totalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="border-slate-600 text-slate-300 hover:bg-slate-700 disabled:opacity-50"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminDashboard;
