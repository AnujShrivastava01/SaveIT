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
  Linkedin,
  Github,
  Twitter,
  Pencil,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import { useDatabase } from "@/hooks/useDatabase";
import Navbar from '@/components/Navbar';
import Footer from "@/components/Footer";
import SignInPage from "@/components/SignInPage";
import Preloader from "@/components/Preloader";
import { SavedItem, CustomFolder } from "@/utils/supabase";
import { useTheme } from "../contexts/ThemeContext";
import { motion } from 'framer-motion';
import gsap from 'gsap';

const defaultCategories = [
  { name: "Coding", icon: Code, color: "bg-blue-500" },
  { name: "Study", icon: BookOpen, color: "bg-green-500" },
  { name: "Personal", icon: Heart, color: "bg-pink-500" },
  { name: "Work", icon: Folder, color: "bg-orange-500" },
];

// No longer needed since we're using database for custom folders

// Utility function to extract domain from a URL
function getDomain(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

// Utility function to get icon for item
function getIconForItem(item: SavedItem) {
  // Priority 1: Custom image from user
  if (item.custom_image && item.custom_image.trim()) {
    return (
      <img
        src={item.custom_image}
        alt="custom icon"
        className="w-5 h-5 rounded object-cover"
        style={{ background: "#fff" }}
        onError={(e) => {
          // Fallback if custom image fails to load
          e.currentTarget.style.display = "none";
        }}
      />
    );
  }

  // Priority 2: Social media specific icons
  if (item.content?.includes("linkedin.com"))
    return <Linkedin className="w-5 h-5 text-blue-600" />;
  if (item.content?.includes("github.com"))
    return <Github className="w-5 h-5 text-gray-800" />;
  if (item.content?.includes("twitter.com"))
    return <Twitter className="w-5 h-5 text-blue-400" />;

  // Priority 3: Favicon from domain
  const domain = getDomain(item.content);
  if (domain) {
    return (
      <img
        src={`https://www.google.com/s2/favicons?domain=${domain}`}
        alt={domain}
        className="w-5 h-5 rounded"
        style={{ background: "#fff" }}
        onError={(e) => {
          // Hide the image on error to prevent 404 console errors
          e.currentTarget.style.display = "none";
        }}
      />
    );
  }

  // Priority 4: Default globe icon
  return <Globe className="w-5 h-5 text-slate-400" />;
}

const Index = () => {
  const {
    items,
    customFolders,
    loading,
    addItem,
    deleteItem,
    togglePin,
    loadItems,
    updateItem,
    addCustomFolder,
    deleteCustomFolder,
  } = useDatabase();
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
    custom_image: "",
  });
  // Combine default categories with custom folders
  const allCategories = [
    ...defaultCategories.map(cat => ({ ...cat, isCustom: false, id: undefined })),
    ...customFolders.map(folder => ({
      name: folder.name,
      icon: Folder, // Default to Folder icon for custom folders
      color: folder.color,
      isCustom: true,
      id: folder.id
    }))
  ];
  const [showAddFolder, setShowAddFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const { toast } = useToast();
  const [confirmDeleteIdx, setConfirmDeleteIdx] = useState<number | null>(null);
  const [editItem, setEditItem] = useState<SavedItem | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    title: "",
    content: "",
    description: "",
    tags: "",
    category: "Coding",
    type: "link" as "link" | "text",
    custom_image: "",
  });
  const { theme } = useTheme();

  // No longer need localStorage persistence since we're using database

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
        category: newItem.category.trim(),
        type: newItem.type,
        is_pinned: false,
        custom_image: newItem.custom_image,
      });

      await loadItems(); // Refresh items after adding

      // Reset form
      setNewItem({
        title: "",
        content: "",
        description: "",
        tags: "",
        category: "Coding",
        type: "link",
        custom_image: "",
      });
      setIsAddDialogOpen(false);
      setSelectedCategory(newItem.category);
    } catch (error) {
      // Error is already handled in the hook
    }
  };

  // Handle edit open
  const openEditDialog = (item: SavedItem) => {
    setEditItem(item);
    setEditForm({
      title: item.title,
      content: item.content,
      description: item.description || "",
      tags: item.tags.join(", "),
      category: item.category,
      type: item.type,
      custom_image: item.custom_image || "",
    });
    setEditDialogOpen(true);
  };

  // Handle edit save
  const handleEditSave = async () => {
    if (!editItem) return;
    try {
      await updateItem(editItem.id, {
        title: editForm.title,
        content: editForm.content,
        description: editForm.description,
        tags: editForm.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        category: editForm.category,
        type: editForm.type,
        custom_image: editForm.custom_image,
      });
      setEditDialogOpen(false);
      setEditItem(null);
      toast({ title: "Success", description: "Item updated successfully!" });
      // Optionally reload items here if not auto-updating
      // await loadItems();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update item",
        variant: "destructive",
      });
    }
  };

  // Define filtered before the JSX return
  const filtered = items.filter((item) => {
    let match = true;
    if (selectedCategory !== "all") {
      match =
        item.category &&
        item.category.trim().toLowerCase() ===
          selectedCategory.trim().toLowerCase();
    }
    if (searchQuery) {
      match =
        match &&
        (item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item.description
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ??
            false) ||
        item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.tags.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase())
          ));
    }
    return match;
  });

  // GSAP demo: pulse heading color on hover
  const headingRef = React.useRef<HTMLHeadingElement>(null);
  const handleHeadingHover = () => {
    if (headingRef.current) {
      gsap.fromTo(
        headingRef.current,
        { color: theme === 'dark' ? '#fff' : '#232b39' },
        { color: '#a855f7', duration: 0.5, yoyo: true, repeat: 1, onComplete: () => {
          gsap.to(headingRef.current, { color: theme === 'dark' ? '#fff' : '#232b39', duration: 0.5 });
        } }
      );
    }
  };
  return (
    <>
      <Preloader />
      <div
        className={
          `relative overflow-x-hidden min-h-screen ` +
          (theme === 'dark'
            ? 'bg-gradient-to-br from-[#232b39] to-[#181e29]'
            : 'bg-gradient-to-br from-white via-blue-50 to-pink-100')
        }
      >
        <SignedOut>
          <SignInPage />
        </SignedOut>

        <SignedIn>
          <Navbar>
            <div className="flex items-center space-x-2 md:space-x-4 animate-slide-in-right">
              {/* Google/User icon area from Header */}
              {import.meta.env.VITE_CLERK_PUBLISHABLE_KEY ? (
                <>
                  <SignedOut>
                    <SignInButton>
                      <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-purple-500/25 text-sm md:text-base px-3 md:px-4 py-2">
                        <span className="relative z-10">Sign In</span>
                      </Button>
                    </SignInButton>
                  </SignedOut>
                  <SignedIn>
                    <div className="transform hover:scale-105 transition-transform duration-300">
                      <UserButton />
                    </div>
                  </SignedIn>
                </>
              ) : (
                <Button
                  disabled
                  className="bg-gray-500 cursor-not-allowed text-sm md:text-base px-3 md:px-4 py-2">
                  Auth Disabled
                </Button>
              )}
            </div>
          </Navbar>

          {/* Main content area with reduced top padding for fixed navbar */}
          <div className={
            'relative overflow-y-auto pb-24 pt-20 min-h-[calc(100vh-80px)] flex flex-col ' +
            (theme === 'light' ? 'text-charcoal' : 'text-white')
          }>
            {/* Animated blurred pastel background for light mode and deep blurred blobs for dark mode */}
            {theme === 'light' && (
              <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
                <div className="absolute top-10 left-1/4 w-96 h-96 bg-purple-300/30 rounded-full blur-3xl animate-float-slow" />
                <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-pink-200/40 rounded-full blur-2xl animate-float-slower" />
                <div className="absolute top-1/2 right-10 w-72 h-72 bg-blue-200/30 rounded-full blur-2xl animate-float-medium" />
              </div>
            )}
            {/* Remove the dark.jpg overlay and blobs for dark mode */}
            {theme === 'dark' && null}
            {/* Search and Filters */}
            <div className={
              (theme === 'light'
                ? 'backdrop-blur-xl bg-white/60 border-b border-white/40 shadow-sm'
                : 'backdrop-blur-sm border-b border-slate-700') +
              ' px-0 md:px-0 pt-4 pb-6'
            }>
              <div className="container mx-auto px-4">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <motion.h2
                      ref={headingRef}
                      className="text-2xl font-bold animate-fade-in cursor-pointer"
                      style={{ color: theme === 'light' ? '#2D3748' : '#fff' }}
                      initial={{ opacity: 0, y: -30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8 }}
                      onMouseEnter={handleHeadingHover}
                    >
                      My Collection
                    </motion.h2>
                    {loading && (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-500"></div>
                    )}
                  </div>

                  <Dialog
                    open={isAddDialogOpen}
                    onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 animate-scale-in"
                        onClick={() => {
                          setNewItem((prev) => ({
                            ...prev,
                            category:
                              selectedCategory !== "all"
                                ? selectedCategory
                                : allCategories[0]?.name || "Coding",
                          }));
                        }}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Item
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-slate-800 border-slate-700 text-white" aria-describedby="add-item-description">
                      <DialogHeader>
                        <DialogTitle>Add New Item</DialogTitle>
                        <DialogDescription id="add-item-description">
                          Add a new item to your collection. Fill in the details below.
                        </DialogDescription>
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
                              setNewItem({
                                ...newItem,
                                content: e.target.value,
                              })
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
                                {allCategories.map((cat) => (
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
                        <div>
                          <Label htmlFor="custom-image">
                            Custom Image URL (optional)
                          </Label>
                          <Input
                            id="custom-image"
                            value={newItem.custom_image}
                            onChange={(e) =>
                              setNewItem({
                                ...newItem,
                                custom_image: e.target.value,
                              })
                            }
                            placeholder="https://example.com/image.png"
                            className="bg-slate-700 border-slate-600"
                          />
                          <p className="text-xs text-slate-400 mt-1">
                            Add a custom image URL to display as the card icon
                            (overrides favicon)
                          </p>
                          {newItem.custom_image && (
                            <div className="mt-2 flex items-center space-x-2">
                              <span className="text-sm text-slate-300">
                                Preview:
                              </span>
                              <img
                                src={newItem.custom_image}
                                alt="preview"
                                className="w-8 h-8 rounded object-cover border border-slate-600"
                                onError={(e) => {
                                  e.currentTarget.style.display = "none";
                                }}
                              />
                            </div>
                          )}
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
                      className={
                        (theme === 'light'
                          ? 'pl-10 bg-white/90 border border-slate-300 text-charcoal placeholder-slate-400 w-full min-w-0 shadow-sm'
                          : 'pl-10 bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 w-full min-w-0')
                      }
                    />
                  </div>
                  <div className="flex flex-wrap gap-2 w-full md:w-auto items-center">
                    <Button
                      variant={
                        selectedCategory === "all" ? "default" : "outline"
                      }
                      onClick={() => setSelectedCategory("all")}
                      className={
                        selectedCategory === "all"
                          ? (theme === 'light'
                              ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-md'
                              : 'bg-purple-600 hover:bg-purple-700 shadow-md')
                          : (theme === 'light'
                              ? 'border-slate-300 text-charcoal bg-white/90 shadow-md'
                              : 'border-slate-600 text-slate-300 shadow-md')
                      }>
                      <span className={selectedCategory === "all" && theme === 'light' ? 'text-white' : theme === 'light' ? 'text-charcoal' : 'text-slate-300'}>
                        All
                      </span>
                    </Button>
                                            {allCategories.map((category, idx) => (
                      <div
                        key={category.name}
                        className="relative group inline-block">
                        <Button
                          variant={
                            selectedCategory === category.name
                              ? "default"
                              : "outline"
                          }
                          onClick={() => {
                            setSelectedCategory(category.name);
                            setNewItem((prev) => ({
                              ...prev,
                              category: category.name,
                            }));
                          }}
                          className={
                            selectedCategory === category.name
                              ? (theme === 'light'
                                  ? 'bg-purple-600 hover:bg-purple-700 text-white pr-8 shadow-md'
                                  : category.name === 'Coding'
                                    ? 'bg-blue-500 hover:bg-blue-600 text-white pr-8 shadow-md'
                                  : category.name === 'Study'
                                    ? 'bg-green-500 hover:bg-green-600 text-white pr-8 shadow-md'
                                  : category.name === 'Personal'
                                    ? 'bg-pink-500 hover:bg-pink-600 text-white pr-8 shadow-md'
                                  : category.name === 'Work'
                                    ? 'bg-orange-400 hover:bg-orange-500 text-white pr-8 shadow-md'
                                  : 'bg-purple-600 hover:bg-purple-700 text-white pr-8 shadow-md')
                              : (theme === 'light'
                                  ? 'border-slate-300 text-charcoal bg-white/90 pr-8 shadow-md'
                                  : category.name === 'Coding'
                                    ? 'bg-slate-800 border-blue-400 text-blue-300 pr-8 shadow-md'
                                    : category.name === 'Study'
                                      ? 'bg-slate-800 border-green-400 text-green-300 pr-8 shadow-md'
                                      : category.name === 'Personal'
                                        ? 'bg-slate-800 border-pink-400 text-pink-300 pr-8 shadow-md'
                                        : category.name === 'Work'
                                          ? 'bg-slate-800 border-orange-300 text-orange-200 pr-8 shadow-md'
                                          : 'bg-slate-800 border-purple-400 text-purple-300 pr-8 shadow-md')
                          }>
                          <category.icon className={
                            selectedCategory === category.name
                              ? 'w-3 h-3 mr-1 text-white'
                              : theme === 'light'
                                ? 'w-3 h-3 mr-1 text-charcoal'
                                : category.name === 'Coding'
                                  ? 'w-3 h-3 mr-1 text-blue-300'
                                  : category.name === 'Study'
                                    ? 'w-3 h-3 mr-1 text-green-300'
                                    : category.name === 'Personal'
                                      ? 'w-3 h-3 mr-1 text-pink-300'
                                      : category.name === 'Work'
                                        ? 'w-3 h-3 mr-1 text-orange-200'
                                        : 'w-3 h-3 mr-1 text-purple-300'
                          } />
                          {category.name}
                        </Button>
                        {/* Show delete for every folder except 'All' */}
                        <button
                          className="absolute top-1/2 right-2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-red-500"
                          title={`Delete ${category.name}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setConfirmDeleteIdx(idx);
                          }}>
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    {/* Confirm Delete Dialog */}
                    <Dialog
                      open={confirmDeleteIdx !== null}
                      onOpenChange={(open) =>
                        !open && setConfirmDeleteIdx(null)
                      }>
                      <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-xs">
                        <DialogHeader>
                          <DialogTitle>Delete Folder?</DialogTitle>
                        </DialogHeader>
                        <div className="py-2">
                          Are you sure you want to delete the folder{" "}
                          <b>
                            {confirmDeleteIdx !== null
                              ? allCategories[confirmDeleteIdx]?.name
                              : ""}
                          </b>
                          ? This cannot be undone.
                        </div>
                        <div className="flex justify-end space-x-2 mt-4">
                          <Button
                            variant="outline"
                            onClick={() => setConfirmDeleteIdx(null)}
                            className="border-slate-600 text-slate-300">
                            Cancel
                          </Button>
                          <Button
                            onClick={() => {
                              if (confirmDeleteIdx !== null) {
                                const delName =
                                  allCategories[confirmDeleteIdx].name;
                                // For custom folders, delete from database
                                if (allCategories[confirmDeleteIdx].isCustom) {
                                  deleteCustomFolder(allCategories[confirmDeleteIdx].id);
                                }
                                if (selectedCategory === delName)
                                  setSelectedCategory("all");
                                setConfirmDeleteIdx(null);
                              }
                            }}
                            className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600">
                            Delete
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                    {/* End Confirm Delete Dialog */}
                    <Dialog
                      open={showAddFolder}
                      onOpenChange={setShowAddFolder}>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          className="border-slate-600 text-slate-300"
                          onClick={() => setShowAddFolder(true)}>
                          + Add Folder
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-slate-800 border-slate-700 text-white" aria-describedby="add-folder-description">
                        <DialogHeader>
                          <DialogTitle>Add New Folder</DialogTitle>
                          <DialogDescription id="add-folder-description">
                            Create a new custom folder to organize your items.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <Input
                            placeholder="Folder name"
                            value={newFolderName}
                            onChange={(e) => setNewFolderName(e.target.value)}
                            className="bg-slate-700 border-slate-600"
                          />
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="outline"
                              onClick={() => setShowAddFolder(false)}
                              className="border-slate-600 text-slate-300">
                              Cancel
                            </Button>
                            <Button
                                                          onClick={async () => {
                              if (
                                newFolderName.trim() &&
                                !allCategories.some(
                                  (cat) =>
                                    cat.name.toLowerCase() ===
                                    newFolderName.trim().toLowerCase()
                                )
                              ) {
                                try {
                                  await addCustomFolder({
                                    name: newFolderName.trim(),
                                    icon: "Folder",
                                    color: "bg-gray-500",
                                  });
                                  setNewFolderName("");
                                  setShowAddFolder(false);
                                } catch (error) {
                                  // Error is handled in the hook
                                }
                              }
                            }}
                              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                              Add
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>
            </div>

            {/* Items Grid */}
            <div className="container mx-auto px-2 sm:px-4 py-8 w-full">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                  <span className="ml-3 text-slate-400">
                    Loading your items...
                  </span>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {filtered.length === 0 ? (
                    <div className="flex flex-1 items-center justify-center min-h-[60vh] w-full">
                      <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto">
                      <div className="w-24 h-24 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                        <BookOpen className="w-12 h-12 text-slate-400" />
                      </div>
                        <h3 className={
                          'text-xl font-semibold mb-2 ' +
                          (theme === 'light' ? 'text-charcoal' : 'text-white')
                        }>
                        No items found
                      </h3>
                        <p className="text-slate-400 mb-6 text-center">
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
                    </div>
                  ) : (
                    filtered.map((item, index) => (
                      <Card
                        key={item.id}
                        className={
                          (theme === 'light'
                            ? 'bg-white/70 border border-white/60 shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl text-charcoal'
                            : 'bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-all duration-300 animate-slide-up glass text-white')
                          + ' rounded-xl'
                        }
                        style={{ animationDelay: `${index * 100}ms` }}>
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-2">
                              {item.is_pinned && (
                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              )}
                              <CardTitle className={
                                (theme === 'light' ? 'flex items-center gap-2 text-charcoal text-sm font-medium truncate' : 'flex items-center gap-2 text-white text-sm font-medium truncate')
                              }>
                                {getIconForItem(item)}
                                {item.title}
                              </CardTitle>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  togglePin(item.id, !item.is_pinned)
                                }
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
                                onClick={() => openEditDialog(item)}
                                className="h-8 w-8 p-0 text-slate-400 hover:text-blue-400"
                                title="Edit">
                                <Pencil className="w-4 h-4" />
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
                          <p className={
                            (theme === 'light' ? 'text-slate-700 text-sm mb-3 line-clamp-2' : 'text-slate-300 text-sm mb-3 line-clamp-2')
                          }>
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
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Hero Section for Empty State */}
            {!loading && items.length === 0 && (
              <div className="py-16 text-center animate-fade-in">
                <div className="space-y-6">
                  <div className="relative">
                    <h2 className={
                      'text-4xl md:text-5xl font-bold mb-4 ' +
                      (theme === 'light' ? 'text-charcoal' : 'text-white')
                    }>
                      Welcome to Your
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                        {" "}
                        Digital Library
                      </span>
                    </h2>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-3xl -z-10"></div>
                  </div>

                  <p className={
                    'text-xl max-w-2xl mx-auto ' +
                    (theme === 'light' ? 'text-slate-700' : 'text-slate-300')
                  }>
                    Organize your links, save important notes, and access
                    everything in one beautiful place.
                  </p>

                  <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-400">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                      <span>Save Links & Notes</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse"></div>
                      <span>Organize by Categories</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                      <span>Search & Filter</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </SignedIn>
      </div>
      <Footer />
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="bg-slate-800 border-slate-700 text-white" aria-describedby="edit-item-description">
          <DialogHeader>
            <DialogTitle>Edit Item</DialogTitle>
            <DialogDescription id="edit-item-description">
              Modify the details of your saved item.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                value={editForm.title}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, title: e.target.value }))
                }
                className="bg-slate-700 border-slate-600"
              />
            </div>
            <div>
              <Label htmlFor="edit-content">Content/URL</Label>
              <Textarea
                id="edit-content"
                value={editForm.content}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, content: e.target.value }))
                }
                className="bg-slate-700 border-slate-600"
                rows={4}
              />
            </div>
            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={editForm.description}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, description: e.target.value }))
                }
                className="bg-slate-700 border-slate-600"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="edit-tags">Tags (comma-separated)</Label>
              <Input
                id="edit-tags"
                value={editForm.tags}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, tags: e.target.value }))
                }
                className="bg-slate-700 border-slate-600"
              />
            </div>
            <div>
              <Label htmlFor="edit-custom-image">
                Custom Image URL (optional)
              </Label>
              <Input
                id="edit-custom-image"
                value={editForm.custom_image}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, custom_image: e.target.value }))
                }
                placeholder="https://example.com/image.png"
                className="bg-slate-700 border-slate-600"
              />
              <p className="text-xs text-slate-400 mt-1">
                Add a custom image URL to display as the card icon (overrides
                favicon)
              </p>
              {editForm.custom_image && (
                <div className="mt-2 flex items-center space-x-2">
                  <span className="text-sm text-slate-300">Preview:</span>
                  <img
                    src={editForm.custom_image}
                    alt="preview"
                    className="w-8 h-8 rounded object-cover border border-slate-600"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-category">Category</Label>
                <Select
                  value={editForm.category}
                  onValueChange={(value) =>
                    setEditForm((f) => ({ ...f, category: value }))
                  }>
                  <SelectTrigger className="bg-slate-700 border-slate-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    {allCategories.map((cat) => (
                      <SelectItem key={cat.name} value={cat.name}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-type">Type</Label>
                <Select
                  value={editForm.type}
                  onValueChange={(value) =>
                    setEditForm((f) => ({
                      ...f,
                      type: value as "link" | "text",
                    }))
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
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setEditDialogOpen(false)}
                className="border-slate-600 text-slate-300">
                Cancel
              </Button>
              <Button
                onClick={handleEditSave}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Index;
