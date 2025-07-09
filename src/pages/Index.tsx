import React, { useState, useEffect } from 'react';
import { Search, Plus, Copy, Tag, Folder, BookOpen, Code, Globe, Heart, Star, Trash2, Filter, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { SignedIn, SignedOut } from '@clerk/clerk-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface SavedItem {
  id: string;
  title: string;
  content: string;
  description?: string;
  tags: string[];
  category: string;
  type: 'link' | 'text';
  isPinned: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const categories = [
  { name: 'Coding', icon: Code, color: 'bg-blue-500' },
  { name: 'Study', icon: BookOpen, color: 'bg-green-500' },
  { name: 'Tools', icon: Globe, color: 'bg-purple-500' },
  { name: 'Personal', icon: Heart, color: 'bg-pink-500' },
  { name: 'Work', icon: Folder, color: 'bg-orange-500' },
];

const Index = () => {
  const [items, setItems] = useState<SavedItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<SavedItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    title: '',
    content: '',
    description: '',
    tags: '',
    category: 'Coding',
    type: 'link' as 'link' | 'text'
  });
  const { toast } = useToast();

  // Sample data for demonstration
  useEffect(() => {
    const sampleItems: SavedItem[] = [
      {
        id: '1',
        title: 'React Documentation',
        content: 'https://react.dev',
        description: 'Official React documentation for learning hooks and components',
        tags: ['react', 'documentation', 'frontend'],
        category: 'Coding',
        type: 'link',
        isPinned: true,
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15')
      },
      {
        id: '2',
        title: 'JavaScript Array Methods',
        content: `// Common array methods cheatsheet
const arr = [1, 2, 3, 4, 5];

// map - transform elements
arr.map(x => x * 2); // [2, 4, 6, 8, 10]

// filter - select elements
arr.filter(x => x > 3); // [4, 5]

// reduce - accumulate
arr.reduce((sum, x) => sum + x, 0); // 15`,
        description: 'Quick reference for JavaScript array methods',
        tags: ['javascript', 'arrays', 'cheatsheet'],
        category: 'Coding',
        type: 'text',
        isPinned: false,
        createdAt: new Date('2024-01-16'),
        updatedAt: new Date('2024-01-16')
      },
      {
        id: '3',
        title: 'Tailwind CSS Docs',
        content: 'https://tailwindcss.com/docs',
        description: 'Utility-first CSS framework documentation',
        tags: ['css', 'tailwind', 'styling'],
        category: 'Tools',
        type: 'link',
        isPinned: false,
        createdAt: new Date('2024-01-17'),
        updatedAt: new Date('2024-01-17')
      }
    ];
    setItems(sampleItems);
    setFilteredItems(sampleItems);
  }, []);

  // Filter items based on search and category
  useEffect(() => {
    let filtered = items;

    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
        item.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    // Sort by pinned first, then by date
    filtered.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });

    setFilteredItems(filtered);
  }, [items, searchQuery, selectedCategory]);

  const handleCopy = async (content: string, title: string) => {
    try {
      await navigator.clipboard.writeText(content);
      toast({
        title: "Copied!",
        description: `"${title}" copied to clipboard`,
      });
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const handleAddItem = () => {
    if (!newItem.title || !newItem.content) {
      toast({
        title: "Missing fields",
        description: "Please fill in title and content",
        variant: "destructive",
      });
      return;
    }

    const item: SavedItem = {
      id: Date.now().toString(),
      title: newItem.title,
      content: newItem.content,
      description: newItem.description,
      tags: newItem.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      category: newItem.category,
      type: newItem.type,
      isPinned: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setItems(prev => [item, ...prev]);
    setNewItem({
      title: '',
      content: '',
      description: '',
      tags: '',
      category: 'Coding',
      type: 'link'
    });
    setIsAddDialogOpen(false);

    toast({
      title: "Item saved!",
      description: `"${item.title}" has been added to your collection`,
    });
  };

  const togglePin = (id: string) => {
    setItems(prev => prev.map(item =>
      item.id === id ? { ...item, isPinned: !item.isPinned } : item
    ));
  };

  const deleteItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
    toast({
      title: "Item deleted",
      description: "Item has been removed from your collection",
    });
  };

  const getCategoryIcon = (categoryName: string) => {
    const category = categories.find(cat => cat.name === categoryName);
    return category ? category.icon : Folder;
  };

  const getCategoryColor = (categoryName: string) => {
    const category = categories.find(cat => cat.name === categoryName);
    return category ? category.color : 'bg-gray-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col">
      <Header />

      <SignedOut>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-12 h-12 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Welcome to SaveIt</h3>
            <p className="text-slate-400 mb-6">
              Please sign in to start saving and organizing your links and notes
            </p>
          </div>
        </div>
      </SignedOut>

      <SignedIn>
        {/* Search and Filters */}
        <div className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <h2 className="text-xl font-semibold text-white">My Collection</h2>
              </div>
              
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Item
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-slate-800 border-slate-700 text-white">
                  <DialogHeader>
                    <DialogTitle>Add New Item</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="type">Type</Label>
                      <Select value={newItem.type} onValueChange={(value: 'link' | 'text') => setNewItem(prev => ({ ...prev, type: value }))}>
                        <SelectTrigger className="bg-slate-700 border-slate-600">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-700 border-slate-600">
                          <SelectItem value="link">Link</SelectItem>
                          <SelectItem value="text">Text/Code</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        value={newItem.title}
                        onChange={(e) => setNewItem(prev => ({ ...prev, title: e.target.value }))}
                        className="bg-slate-700 border-slate-600"
                        placeholder="Enter title..."
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="content">{newItem.type === 'link' ? 'URL' : 'Content'}</Label>
                      <Textarea
                        id="content"
                        value={newItem.content}
                        onChange={(e) => setNewItem(prev => ({ ...prev, content: e.target.value }))}
                        className="bg-slate-700 border-slate-600 min-h-[100px]"
                        placeholder={newItem.type === 'link' ? 'https://...' : 'Enter your text or code...'}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="description">Description (optional)</Label>
                      <Input
                        id="description"
                        value={newItem.description}
                        onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
                        className="bg-slate-700 border-slate-600"
                        placeholder="Brief description..."
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select value={newItem.category} onValueChange={(value) => setNewItem(prev => ({ ...prev, category: value }))}>
                        <SelectTrigger className="bg-slate-700 border-slate-600">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-700 border-slate-600">
                          {categories.map(category => (
                            <SelectItem key={category.name} value={category.name}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="tags">Tags (comma-separated)</Label>
                      <Input
                        id="tags"
                        value={newItem.tags}
                        onChange={(e) => setNewItem(prev => ({ ...prev, tags: e.target.value }))}
                        className="bg-slate-700 border-slate-600"
                        placeholder="react, javascript, tutorial"
                      />
                    </div>
                    
                    <Button onClick={handleAddItem} className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                      Save Item
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by title, tags, or content..."
                  className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder-slate-400"
                />
              </div>
              
              <div className="flex gap-2 overflow-x-auto">
                <Button
                  variant={selectedCategory === 'all' ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory('all')}
                  className={selectedCategory === 'all' ? 'bg-purple-500 hover:bg-purple-600' : 'border-slate-600 text-slate-300 hover:bg-slate-700'}
                >
                  All
                </Button>
                {categories.map(category => {
                  const IconComponent = category.icon;
                  return (
                    <Button
                      key={category.name}
                      variant={selectedCategory === category.name ? 'default' : 'outline'}
                      onClick={() => setSelectedCategory(category.name)}
                      className={selectedCategory === category.name 
                        ? 'bg-purple-500 hover:bg-purple-600' 
                        : 'border-slate-600 text-slate-300 hover:bg-slate-700'
                      }
                    >
                      <IconComponent className="w-4 h-4 mr-2" />
                      {category.name}
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 container mx-auto px-4 py-8">
          {filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-12 h-12 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No items found</h3>
              <p className="text-slate-400 mb-6">
                {searchQuery || selectedCategory !== 'all' 
                  ? 'Try adjusting your search or filters' 
                  : 'Start by adding your first link or note'
                }
              </p>
              {!searchQuery && selectedCategory === 'all' && (
                <Button 
                  onClick={() => setIsAddDialogOpen(true)}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Item
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map(item => {
                const IconComponent = getCategoryIcon(item.category);
                return (
                  <Card key={item.id} className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/10 group">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-2 flex-1">
                          <div className={`w-8 h-8 ${getCategoryColor(item.category)} rounded-lg flex items-center justify-center flex-shrink-0`}>
                            <IconComponent className="w-4 h-4 text-white" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <CardTitle className="text-white text-sm font-medium truncate">{item.title}</CardTitle>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge variant="outline" className="border-slate-600 text-slate-300 text-xs">
                                {item.type}
                              </Badge>
                              {item.isPinned && <Star className="w-3 h-3 text-yellow-400 fill-current" />}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => togglePin(item.id)}
                            className="h-8 w-8 p-0 text-slate-400 hover:text-yellow-400"
                          >
                            <Star className={`w-4 h-4 ${item.isPinned ? 'fill-current text-yellow-400' : ''}`} />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => deleteItem(item.id)}
                            className="h-8 w-8 p-0 text-slate-400 hover:text-red-400"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      {item.description && (
                        <p className="text-slate-400 text-sm mb-3 line-clamp-2">{item.description}</p>
                      )}
                      
                      <div className="bg-slate-900/50 rounded-lg p-3 mb-3">
                        <p className="text-slate-300 text-sm font-mono break-all line-clamp-3">
                          {item.content}
                        </p>
                      </div>
                      
                      {item.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {item.tags.slice(0, 3).map(tag => (
                            <Badge key={tag} className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-xs">
                              <Tag className="w-3 h-3 mr-1" />
                              {tag}
                            </Badge>
                          ))}
                          {item.tags.length > 3 && (
                            <Badge className="bg-slate-600/20 text-slate-400 border-slate-600/30 text-xs">
                              +{item.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <Button
                          onClick={() => handleCopy(item.content, item.title)}
                          className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white flex-1 mr-2"
                          size="sm"
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          Copy
                        </Button>
                        
                        {item.type === 'link' && (
                          <Button
                            onClick={() => window.open(item.content, '_blank')}
                            variant="outline"
                            size="sm"
                            className="border-slate-600 text-slate-300 hover:bg-slate-700"
                          >
                            <Globe className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                      
                      <div className="mt-3 text-xs text-slate-500">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </SignedIn>

      <Footer />
    </div>
  );
};

export default Index;
