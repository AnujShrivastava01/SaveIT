import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAdmin } from '../contexts/AdminContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Shield,
  LogOut,
  FolderOpen,
  FileText,
  ArrowLeft,
  ExternalLink,
  Loader2,
  User,
  Calendar,
  Mail,
  Pin,
  Copy,
  Check,
} from 'lucide-react';
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
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
  title: string;
  content: string;
  description?: string;
  category: string;
  type: string;
  is_pinned: boolean;
  created_at: string;
}

interface CustomFolder {
  id: string;
  user_id: string;
  name: string;
  icon: string;
  color: string;
  created_at: string;
}

const AdminUserDetails: React.FC = () => {
  const { isAdminAuthenticated, adminLogout } = useAdmin();
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [items, setItems] = useState<SavedItem[]>([]);
  const [folders, setFolders] = useState<CustomFolder[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFolder, setActiveFolder] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (!isAdminAuthenticated) {
      navigate('/admin');
    }
  }, [isAdminAuthenticated, navigate]);

  useEffect(() => {
    if (userId) {
      loadUserData(userId);
    }
  }, [userId]);

  const loadUserData = async (id: string) => {
    if (!db || !isFirebaseConfigured) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      // Get user profile
      const userDoc = await getDoc(doc(db, COLLECTIONS.USER_PROFILES, id));
      if (userDoc.exists()) {
        setUser({ id: userDoc.id, ...userDoc.data() } as UserProfile);
      }

      // Get user's saved items
      const itemsQuery = query(
        collection(db, COLLECTIONS.SAVED_ITEMS),
        where('user_id', '==', id)
      );
      const itemsSnapshot = await getDocs(itemsQuery);
      const itemsData = itemsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as SavedItem[];
      setItems(itemsData.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      ));

      // Get user's custom folders
      const foldersQuery = query(
        collection(db, COLLECTIONS.CUSTOM_FOLDERS),
        where('user_id', '==', id)
      );
      const foldersSnapshot = await getDocs(foldersQuery);
      const foldersData = foldersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as CustomFolder[];
      setFolders(foldersData.sort((a, b) => a.name.localeCompare(b.name)));
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    adminLogout();
    navigate('/admin');
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'Unknown';
    }
  };

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const getItemsByFolder = (folderName: string) => {
    if (folderName === 'all') return items;
    if (folderName === 'uncategorized') return items.filter(item => !item.category || item.category === 'Uncategorized');
    return items.filter(item => item.category === folderName);
  };

  const getItemCount = (folderName: string) => {
    return getItemsByFolder(folderName).length;
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
            <Button
              onClick={() => navigate('/admin/dashboard')}
              variant="ghost"
              size="sm"
              className="text-slate-400 hover:text-white mr-2"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back
            </Button>
            <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">User Details</h1>
              <p className="text-sm text-slate-400">View user's folder-wise data</p>
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
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-10 h-10 text-purple-400 animate-spin" />
          </div>
        ) : user ? (
          <>
            {/* User Info Card */}
            <Card className="bg-slate-800/50 border-slate-700 mb-6">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                  {user.avatar_url ? (
                    <img
                      src={user.avatar_url}
                      alt={user.name || 'User'}
                      className="w-20 h-20 rounded-full object-cover border-4 border-purple-500/30"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                        (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  <div className={`w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center ${user.avatar_url ? 'hidden' : ''}`}>
                    <User className="w-10 h-10 text-white" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <h2 className="text-2xl font-bold text-white">{user.name || 'No Name'}</h2>
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center gap-2 text-slate-400">
                        <Mail className="w-4 h-4" />
                        <span>{user.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-400">
                        <Calendar className="w-4 h-4" />
                        <span>Joined {formatDate(user.created_at)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <Card className="bg-slate-700/50 border-slate-600">
                      <CardContent className="p-4 text-center">
                        <p className="text-2xl font-bold text-white">{folders.length}</p>
                        <p className="text-xs text-slate-400">Folders</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-slate-700/50 border-slate-600">
                      <CardContent className="p-4 text-center">
                        <p className="text-2xl font-bold text-white">{items.length}</p>
                        <p className="text-xs text-slate-400">Items</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Folder-wise Data */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <FolderOpen className="w-5 h-5 text-yellow-400" />
                  Folder-wise Data
                </CardTitle>
                <CardDescription className="text-slate-400">
                  View items organized by folders
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeFolder} onValueChange={setActiveFolder} className="w-full">
                  <ScrollArea className="w-full">
                    <TabsList className="bg-slate-700/50 p-1 mb-4 flex flex-wrap gap-1 h-auto">
                      <TabsTrigger
                        value="all"
                        className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-slate-400"
                      >
                        All Items ({items.length})
                      </TabsTrigger>
                      {folders.map((folder) => (
                        <TabsTrigger
                          key={folder.id}
                          value={folder.name}
                          className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-slate-400"
                        >
                          <span 
                            className="w-2 h-2 rounded-full mr-2" 
                            style={{ backgroundColor: folder.color || '#3B82F6' }}
                          />
                          {folder.name} ({getItemCount(folder.name)})
                        </TabsTrigger>
                      ))}
                      <TabsTrigger
                        value="uncategorized"
                        className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-slate-400"
                      >
                        Uncategorized ({getItemCount('uncategorized')})
                      </TabsTrigger>
                    </TabsList>
                  </ScrollArea>

                  {/* All Items Tab */}
                  <TabsContent value="all" className="mt-0">
                    <ItemsGrid items={items} copyToClipboard={copyToClipboard} copiedId={copiedId} formatDate={formatDate} />
                  </TabsContent>

                  {/* Folder Tabs */}
                  {folders.map((folder) => (
                    <TabsContent key={folder.id} value={folder.name} className="mt-0">
                      <div className="mb-4 p-3 bg-slate-700/30 rounded-lg border border-slate-600">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
                            style={{ backgroundColor: folder.color || '#3B82F6' }}
                          >
                            {folder.icon || '📁'}
                          </div>
                          <div>
                            <h3 className="text-white font-medium">{folder.name}</h3>
                            <p className="text-xs text-slate-400">Created: {formatDate(folder.created_at)}</p>
                          </div>
                        </div>
                      </div>
                      <ItemsGrid 
                        items={getItemsByFolder(folder.name)} 
                        copyToClipboard={copyToClipboard} 
                        copiedId={copiedId} 
                        formatDate={formatDate}
                      />
                    </TabsContent>
                  ))}

                  {/* Uncategorized Tab */}
                  <TabsContent value="uncategorized" className="mt-0">
                    <ItemsGrid 
                      items={getItemsByFolder('uncategorized')} 
                      copyToClipboard={copyToClipboard} 
                      copiedId={copiedId} 
                      formatDate={formatDate}
                    />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-24">
            <User className="w-16 h-16 text-slate-600 mb-4" />
            <h2 className="text-xl text-white mb-2">User Not Found</h2>
            <p className="text-slate-400 mb-4">The requested user could not be found.</p>
            <Button
              onClick={() => navigate('/admin/dashboard')}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Back to Dashboard
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

// Items Grid Component
interface ItemsGridProps {
  items: SavedItem[];
  copyToClipboard: (text: string, id: string) => void;
  copiedId: string | null;
  formatDate: (dateStr: string) => string;
}

const ItemsGrid: React.FC<ItemsGridProps> = ({ items, copyToClipboard, copiedId, formatDate }) => {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <FileText className="w-12 h-12 text-slate-600 mb-4" />
        <p className="text-slate-400">No items in this folder</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[500px]">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item) => (
          <Card key={item.id} className="bg-slate-700/30 border-slate-600">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h4 className="text-white font-medium truncate flex-1">
                  {item.title || 'Untitled'}
                </h4>
                <div className="flex items-center gap-1">
                  {item.is_pinned && (
                    <Pin className="w-4 h-4 text-yellow-400" />
                  )}
                  {item.type === 'link' && item.content && (
                    <a
                      href={item.content}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-400 hover:text-purple-300"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
              
              <div className="bg-slate-800/50 rounded p-2 mb-3 group relative">
                <p className="text-sm text-slate-300 break-all line-clamp-3">
                  {item.content}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(item.content, item.id)}
                  className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0 text-slate-400 hover:text-white"
                >
                  {copiedId === item.id ? (
                    <Check className="w-3 h-3 text-green-400" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </Button>
              </div>

              {item.description && (
                <p className="text-xs text-slate-400 mb-3 line-clamp-2">
                  {item.description}
                </p>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs border-slate-600 text-slate-400">
                    {item.category || 'Uncategorized'}
                  </Badge>
                  <Badge variant="outline" className="text-xs border-slate-600 text-slate-400">
                    {item.type}
                  </Badge>
                </div>
                <span className="text-xs text-slate-500">{formatDate(item.created_at)}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
};

export default AdminUserDetails;
