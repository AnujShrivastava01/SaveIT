import React, { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Copy,
  Globe,
  Star,
  Trash2,
  BookOpen,
  Code,
  Heart,
  Folder,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import { useDatabase } from "@/hooks/useDatabase";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SignInPage from "@/components/SignInPage";
import { SavedItem } from "@/utils/supabase";

const categories = [
  { name: "Coding", icon: Code, color: "bg-blue-500" },
  { name: "Study", icon: BookOpen, color: "bg-green-500" },
  { name: "Personal", icon: Heart, color: "bg-pink-500" },
  { name: "Work", icon: Folder, color: "bg-orange-500" },
];

const Index = () => {
  const { items, loading, addItem, deleteItem, togglePin } = useDatabase();
  const [filteredItems, setFilteredItems] = useState<SavedItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    title: "",
    content: "",
    description: "",
    tags: "",
    category: "Coding",
    type: "link" as "link" | "text",
  });
  const { toast } = useToast();

  // Update filtered items when items change
  useEffect(() => {
    let filtered = items;

    if (searchQuery) {
      filtered = items.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.tags.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((item) => item.category === selectedCategory);
    }

    setFilteredItems(filtered);
  }, [items, searchQuery, selectedCategory]);

  const handleAddItem = async () => {
    if (!newItem.title || !newItem.content) {
      toast({
        title: "Error",
        description: "Please fill in title and content",
        variant: "destructive",
      });
      return;
    }

    try {
      await addItem({
        title: newItem.title,
        content: newItem.content,
        description: newItem.description,
        tags: newItem.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag !== ""),
        category: newItem.category,
        type: newItem.type,
        is_pinned: false,
      });

      // Reset form
      setNewItem({
        title: "",
        content: "",
        description: "",
        tags: "",
        category: "Coding",
        type: "link",
      });
      setIsAddDialogOpen(false);
    } catch (error) {
      // Error is already handled in the hook
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <SignedOut>
        <SignInPage />
      </SignedOut>

      <SignedIn>
        <Header />

        {/* Search and Filters */}
        <div className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <h2 className="text-xl font-semibold text-white animate-fade-in">
                  My Collection
                </h2>
                {loading && (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-500"></div>
                )}
              </div>

              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 animate-scale-in">
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
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        value={newItem.title}
                        onChange={(e) =>
                          setNewItem({ ...newItem, title: e.target.value })
                        }
                        placeholder="Enter title..."
                        className="bg-slate-700 border-slate-600"
                      />
                    </div>
                    <div>
                      <Label htmlFor="content">Content/URL</Label>
                      <Textarea
                        id="content"
                        value={newItem.content}
                        onChange={(e) =>
                          setNewItem({ ...newItem, content: e.target.value })
                        }
                        placeholder="Enter URL or content..."
                        className="bg-slate-700 border-slate-600"
                        rows={4}
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={newItem.description}
                        onChange={(e) =>
                          setNewItem({
                            ...newItem,
                            description: e.target.value,
                          })
                        }
                        placeholder="Enter description..."
                        className="bg-slate-700 border-slate-600"
                        rows={3}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="category">Category</Label>
                        <Select
                          value={newItem.category}
                          onValueChange={(value) =>
                            setNewItem({ ...newItem, category: value })
                          }>
                          <SelectTrigger className="bg-slate-700 border-slate-600">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-700 border-slate-600">
                            {categories.map((cat) => (
                              <SelectItem key={cat.name} value={cat.name}>
                                {cat.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="type">Type</Label>
                        <Select
                          value={newItem.type}
                          onValueChange={(value: "link" | "text") =>
                            setNewItem({ ...newItem, type: value })
                          }>
                          <SelectTrigger className="bg-slate-700 border-slate-600">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-700 border-slate-600">
                            <SelectItem value="link">Link</SelectItem>
                            <SelectItem value="text">Text</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="tags">Tags (comma-separated)</Label>
                      <Input
                        id="tags"
                        value={newItem.tags}
                        onChange={(e) =>
                          setNewItem({ ...newItem, tags: e.target.value })
                        }
                        placeholder="react, javascript, tutorial"
                        className="bg-slate-700 border-slate-600"
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => setIsAddDialogOpen(false)}
                        className="border-slate-600 text-slate-300">
                        Cancel
                      </Button>
                      <Button
                        onClick={handleAddItem}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                        Save Item
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Search and Category Filter */}
            <div className="flex flex-col md:flex-row gap-4 animate-slide-up">
              <div className="flex-1 relative min-w-0">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Search your saved items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 w-full min-w-0"
                />
              </div>
              <div className="flex flex-wrap gap-2 w-full md:w-auto">
                <Button
                  variant={selectedCategory === "all" ? "default" : "outline"}
                  onClick={() => setSelectedCategory("all")}
                  className={
                    selectedCategory === "all"
                      ? "bg-purple-600 hover:bg-purple-700"
                      : "border-slate-600 text-slate-300"
                  }>
                  All
                </Button>
                {categories.map((category) => (
                  <Button
                    key={category.name}
                    variant={
                      selectedCategory === category.name ? "default" : "outline"
                    }
                    onClick={() => setSelectedCategory(category.name)}
                    className={
                      selectedCategory === category.name
                        ? "bg-purple-600 hover:bg-purple-700"
                        : "border-slate-600 text-slate-300"
                    }>
                    <category.icon className="w-3 h-3 mr-1" />
                    {category.name}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Items Grid */}
        <div className="container mx-auto px-2 sm:px-4 py-8 w-full">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
              <span className="ml-3 text-slate-400">Loading your items...</span>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-12 animate-fade-in">
              <div className="w-24 h-24 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-12 h-12 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                No items found
              </h3>
              <p className="text-slate-400 mb-6">
                {searchQuery || selectedCategory !== "all"
                  ? "No items match your current filters"
                  : "Start by adding your first link or note"}
              </p>
              <Button
                onClick={() => setIsAddDialogOpen(true)}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Item
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredItems.map((item, index) => (
                <Card
                  key={item.id}
                  className="bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-all duration-300 animate-slide-up glass"
                  style={{ animationDelay: `${index * 100}ms` }}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        {item.is_pinned && (
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        )}
                        <CardTitle className="text-white text-sm font-medium truncate">
                          {item.title}
                        </CardTitle>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => togglePin(item.id, !item.is_pinned)}
                          className="h-8 w-8 p-0 text-slate-400 hover:text-yellow-400">
                          <Star
                            className={`w-4 h-4 ${
                              item.is_pinned
                                ? "fill-current text-yellow-400"
                                : ""
                            }`}
                          />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteItem(item.id)}
                          className="h-8 w-8 p-0 text-slate-400 hover:text-red-400">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-slate-300 text-sm mb-3 line-clamp-2">
                      {item.description ||
                        (item.type === "link"
                          ? "No description"
                          : item.content)}
                    </p>

                    {item.type === "link" && (
                      <div className="flex items-center space-x-2 mb-3">
                        <Globe className="w-4 h-4 text-blue-400" />
                        <a
                          href={item.content}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 text-sm truncate flex-1">
                          {item.content}
                        </a>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            navigator.clipboard.writeText(item.content);
                            toast({
                              title: "Copied!",
                              description: "Link copied to clipboard",
                            });
                          }}
                          className="h-6 w-6 p-0 text-slate-400 hover:text-white">
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {item.tags.slice(0, 3).map((tag, tagIndex) => (
                          <Badge
                            key={tagIndex}
                            variant="secondary"
                            className="text-xs bg-slate-700 text-slate-300">
                            {tag}
                          </Badge>
                        ))}
                        {item.tags.length > 3 && (
                          <Badge
                            variant="secondary"
                            className="text-xs bg-slate-700 text-slate-300">
                            +{item.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                      <span className="text-xs text-slate-500">
                        {new Date(item.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        <Footer />
      </SignedIn>
    </div>
  );
};

export default Index;
