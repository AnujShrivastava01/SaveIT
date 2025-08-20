import React, { useState, useEffect, useMemo } from "react";
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
  Briefcase,
  Home,
  ShoppingBag,
  Camera,
  Music,
  Video,
  FileText,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Users,
  Settings,
  Zap,
  Target,
  Award,
  Lightbulb,
  Palette,
  Gamepad2,
  Utensils,
  Car,
  Plane,
  Train,
  Bus,
  Bike,
  Dumbbell,
  Trophy,
  Gift,
  ShoppingCart,
  CreditCard,
  Wallet,
  PiggyBank,
  Building,
  School,
  GraduationCap,
  Microscope,
  Calculator,
  Compass,
  Globe2,
  Map,
  Navigation,
  Anchor,
  Ship,
  Rocket,
  Satellite,
  Wifi,
  Bluetooth,
  Battery,
  Power,
  Lock,
  Key,
  Shield,
  Eye,
  EyeOff,
  Bell,
  Clock,
  Timer,
  Watch,
  CalendarDays,
  Sun,
  Moon,
  Cloud,
  CloudRain,
  CloudSnow,
  Wind,
  Umbrella,
  Snowflake,
  Thermometer,
  Droplets,
  Waves,
  Mountain,
  Trees,
  Leaf,
  Flower,
  Bug,
  Fish,
  Bird,
  Cat,
  Dog,
  PawPrint,
  Bone,
  Egg,
  Milk,
  Apple,
  Grid3X3,
  List,
  Carrot,
  Pizza,
  Cake,
  Coffee,
  Wine,
  Beer,
  IceCream,
  Cookie,
  Candy,
  Smartphone,
  Database,
  Server,
  MessageCircle,
  TrendingUp,
  Wrench,
  Archive,
  Save,
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
  SelectContentWithScrollbar,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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

// Utility function to get appropriate icon for folder based on name
function getIconForFolder(folderName: string) {
  const name = folderName.toLowerCase();
  
  // Work/Professional related
  if (name.includes('work') || name.includes('job') || name.includes('career') || name.includes('office')) return Briefcase;
  if (name.includes('project') || name.includes('task') || name.includes('todo')) return Target;
  if (name.includes('meeting') || name.includes('appointment')) return Calendar;
  if (name.includes('client') || name.includes('customer')) return Users;
  if (name.includes('business') || name.includes('company')) return Building;
  if (name.includes('finance') || name.includes('money') || name.includes('budget')) return Wallet;
  if (name.includes('invoice') || name.includes('billing')) return CreditCard;
  if (name.includes('salary') || name.includes('payroll')) return PiggyBank;
  
  // Education/Study related
  if (name.includes('study') || name.includes('learn') || name.includes('education')) return BookOpen;
  if (name.includes('school') || name.includes('college') || name.includes('university')) return School;
  if (name.includes('course') || name.includes('class') || name.includes('lecture')) return GraduationCap;
  if (name.includes('research') || name.includes('lab')) return Microscope;
  if (name.includes('science') || name.includes('experiment')) return Microscope;
  if (name.includes('math') || name.includes('calculation')) return Calculator;
  
  // Technology/Coding related
  if (name.includes('coding') || name.includes('programming') || name.includes('dev')) return Code;
  if (name.includes('tech') || name.includes('technology') || name.includes('software')) return Zap;
  if (name.includes('web') || name.includes('website') || name.includes('site')) return Globe;
  if (name.includes('app') || name.includes('mobile') || name.includes('ios') || name.includes('android')) return Smartphone;
  if (name.includes('database') || name.includes('data')) return Database;
  if (name.includes('api') || name.includes('backend')) return Server;
  if (name.includes('frontend') || name.includes('ui') || name.includes('ux')) return Palette;
  if (name.includes('design') || name.includes('graphic')) return Palette;
  
  // Personal/Lifestyle related
  if (name.includes('personal') || name.includes('private') || name.includes('life')) return Heart;
  if (name.includes('home') || name.includes('house') || name.includes('family')) return Home;
  if (name.includes('health') || name.includes('fitness') || name.includes('gym')) return Dumbbell;
  if (name.includes('sport') || name.includes('exercise') || name.includes('workout')) return Trophy;
  if (name.includes('food') || name.includes('cooking') || name.includes('recipe')) return Utensils;
  if (name.includes('restaurant') || name.includes('dining')) return ShoppingBag;
  if (name.includes('travel') || name.includes('trip') || name.includes('vacation')) return Plane;
  if (name.includes('car') || name.includes('vehicle') || name.includes('transport')) return Car;
  if (name.includes('shopping') || name.includes('buy') || name.includes('purchase')) return ShoppingCart;
  
  // Entertainment/Media related
  if (name.includes('music') || name.includes('song') || name.includes('audio')) return Music;
  if (name.includes('video') || name.includes('movie') || name.includes('film')) return Video;
  if (name.includes('photo') || name.includes('image') || name.includes('picture')) return Camera;
  if (name.includes('game') || name.includes('gaming') || name.includes('play')) return Gamepad2;
  if (name.includes('book') || name.includes('reading') || name.includes('novel')) return FileText;
  if (name.includes('art') || name.includes('creative') || name.includes('drawing')) return Palette;
  
  // Communication/Social related
  if (name.includes('social') || name.includes('network') || name.includes('connect')) return Users;
  if (name.includes('email') || name.includes('mail') || name.includes('message')) return Mail;
  if (name.includes('phone') || name.includes('call') || name.includes('contact')) return Phone;
  if (name.includes('chat') || name.includes('message') || name.includes('conversation')) return MessageCircle;
  if (name.includes('linkedin')) return Linkedin;
  if (name.includes('github')) return Github;
  if (name.includes('twitter') || name.includes('x')) return Twitter;
  
  // Finance/Investment related
  if (name.includes('investment') || name.includes('stock') || name.includes('trading')) return TrendingUp;
  if (name.includes('bank') || name.includes('account') || name.includes('saving')) return PiggyBank;
  if (name.includes('expense') || name.includes('cost') || name.includes('spending')) return CreditCard;
  
  // Travel/Transportation related
  if (name.includes('train') || name.includes('railway')) return Train;
  if (name.includes('bus') || name.includes('public')) return Bus;
  if (name.includes('bike') || name.includes('cycling')) return Bike;
  if (name.includes('ship') || name.includes('boat') || name.includes('cruise')) return Ship;
  if (name.includes('hotel') || name.includes('accommodation')) return Building;
  if (name.includes('map') || name.includes('location') || name.includes('place')) return MapPin;
  
  // Nature/Outdoor related
  if (name.includes('nature') || name.includes('outdoor') || name.includes('park')) return Trees;
  if (name.includes('garden') || name.includes('plant') || name.includes('flower')) return Flower;
  if (name.includes('mountain') || name.includes('hiking') || name.includes('climb')) return Mountain;
  if (name.includes('beach') || name.includes('ocean') || name.includes('sea')) return Waves;
  if (name.includes('weather') || name.includes('climate')) return Cloud;
  
  // Time/Calendar related
  if (name.includes('schedule') || name.includes('time') || name.includes('clock')) return Clock;
  if (name.includes('reminder') || name.includes('alarm') || name.includes('notification')) return Bell;
  if (name.includes('event') || name.includes('party') || name.includes('celebration')) return Gift;
  
  // Security/Privacy related
  if (name.includes('security') || name.includes('password') || name.includes('lock')) return Lock;
  if (name.includes('privacy') || name.includes('private') || name.includes('secret')) return Shield;
  
  // Settings/Configuration related
  if (name.includes('setting') || name.includes('config') || name.includes('preference')) return Settings;
  if (name.includes('tool') || name.includes('utility') || name.includes('helper')) return Wrench;
  
  // Default fallback icons based on common patterns
  if (name.includes('idea') || name.includes('inspiration') || name.includes('creative')) return Lightbulb;
  if (name.includes('goal') || name.includes('target') || name.includes('objective')) return Target;
  if (name.includes('achievement') || name.includes('success') || name.includes('win')) return Award;
  if (name.includes('favorite') || name.includes('like') || name.includes('love')) return Heart;
  if (name.includes('important') || name.includes('priority') || name.includes('urgent')) return Star;
  if (name.includes('new') || name.includes('recent') || name.includes('latest')) return Zap;
  if (name.includes('old') || name.includes('archive') || name.includes('history')) return Archive;
  if (name.includes('backup') || name.includes('save') || name.includes('store')) return Save;
  
  // If no specific match, return a default icon
  return Folder;
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

// Utility function to ensure color classes are properly applied
const getColorClass = (color: string | undefined) => {
  if (!color) return 'text-gray-500';
  
  // Convert bg- to text- and ensure the class exists
  const textColor = color.replace('bg-', 'text-');
  
  // Safelist of all possible color classes to prevent Tailwind from purging them
  const colorClasses = [
    'text-red-500', 'text-pink-500', 'text-purple-500', 'text-blue-500', 'text-cyan-500', 'text-teal-500',
    'text-green-500', 'text-lime-500', 'text-yellow-500', 'text-orange-500', 'text-gray-500', 'text-slate-500'
  ];
  
  // Return the color if it's in our safelist, otherwise fallback to gray
  return colorClasses.includes(textColor) ? textColor : 'text-gray-500';
};

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
    updateCustomFolder,
  } = useDatabase();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"cards" | "list">("cards");
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
  const allCategories = useMemo(() => [
    ...defaultCategories.map(cat => ({ ...cat, isCustom: false, id: undefined })),
    ...customFolders.map(folder => ({
      name: folder.name,
      icon: getIconForFolder(folder.name), // Use intelligent icon assignment
      color: folder.color,
      isCustom: true,
      id: folder.id
    }))
  ], [customFolders]);
  const [showAddFolder, setShowAddFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [selectedFolderColor, setSelectedFolderColor] = useState("bg-blue-500");
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
  const [editFolderDialogOpen, setEditFolderDialogOpen] = useState(false);
  const [editingFolder, setEditingFolder] = useState<CustomFolder | null>(null);
  const [editFolderForm, setEditFolderForm] = useState({
    name: "",
    color: "bg-gray-500",
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

  // Handle edit folder open
  const openEditFolderDialog = (folder: CustomFolder) => {
    setEditingFolder(folder);
    setEditFolderForm({
      name: folder.name,
      color: folder.color,
    });
    setEditFolderDialogOpen(true);
  };

  // Handle edit folder save
  const handleEditFolderSave = async () => {
    if (!editingFolder) return;
    
    // Store the current selected category and whether it was the folder being edited
    const wasEditingSelectedFolder = selectedCategory === editingFolder.name;
    const newFolderName = editFolderForm.name;
    
    try {
      await updateCustomFolder(editingFolder.id, {
        name: editFolderForm.name,
        color: editFolderForm.color,
      });
      setEditFolderDialogOpen(false);
      setEditingFolder(null);
      toast({ title: "Success", description: "Folder updated successfully!" });
      
      // Reload items to reflect the updated folder names
      await loadItems();
      
      // If we were editing the currently selected folder, update the selection to the new name
      if (wasEditingSelectedFolder) {
        setSelectedCategory(newFolderName);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update folder",
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

  // Ensure selectedCategory is valid when allCategories changes
  useEffect(() => {
    if (selectedCategory !== "all") {
      const categoryExists = allCategories.some(cat => cat.name === selectedCategory);
      if (!categoryExists) {
        // If the selected category no longer exists, reset to "all"
        setSelectedCategory("all");
      }
    }
  }, [allCategories, selectedCategory]);

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
                    <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-[95vw] w-[95vw] sm:max-w-lg sm:w-auto max-h-[90vh] overflow-y-auto p-4 sm:p-6 dialog-scrollable" aria-describedby="add-item-description">
                      <DialogHeader>
                        <DialogTitle>Add New Item</DialogTitle>
                        <DialogDescription id="add-item-description">
                          Add a new item to your collection. Fill in the details below.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-3">
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
                            rows={3}
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
                            rows={2}
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                  <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <Input
                      placeholder="Search your saved items..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className={
                        (theme === 'light'
                          ? 'pl-10 bg-white/90 border border-slate-300 text-charcoal placeholder-slate-400 shadow-sm'
                          : 'pl-10 bg-slate-700/50 border-slate-600 text-white')
                      }
                    />
                  </div>
                  
                  {/* View Mode Toggle */}
                  <div className="flex items-center gap-1">
                    <Button
                      variant={viewMode === "cards" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode("cards")}
                      className={
                        viewMode === "cards"
                          ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                          : theme === 'light'
                          ? 'border-slate-300 text-charcoal bg-white/90 shadow-md'
                          : 'border-slate-600 text-slate-300 shadow-md'
                      }
                      title="Card view"
                    >
                      <Grid3X3 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode("list")}
                      className={
                        viewMode === "list"
                          ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                          : theme === 'light'
                          ? 'border-slate-300 text-charcoal bg-white/90 shadow-md'
                          : 'border-slate-600 text-slate-300 shadow-md'
                      }
                      title="List view"
                    >
                      <List className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 w-full md:w-auto items-center">
                    {/* Folder Filter Dropdown */}
                    <div className="relative">
                      <Select
                        value={selectedCategory}
                        onValueChange={(value) => {
                          setSelectedCategory(value);
                          setNewItem((prev) => ({
                            ...prev,
                            category: value === "all" ? "Coding" : value,
                          }));
                        }}>
                        <SelectTrigger className={
                          theme === 'light'
                            ? 'bg-white/90 border border-slate-300 text-charcoal shadow-md min-w-[200px]'
                            : 'bg-slate-700/50 border-slate-600 text-white shadow-md min-w-[200px]'
                        }>
                          <SelectValue placeholder="Select folder...">
                            {selectedCategory === "all" ? (
                              <div className="flex items-center gap-2">
                                <Folder className="w-4 h-4 text-purple-500" />
                                <span className="font-medium">All Folders</span>
                              </div>
                            ) : (
                              (() => {
                                const category = allCategories.find(cat => cat.name === selectedCategory);
                                return category ? (
                                  <div className="flex items-center gap-2">
                                    <category.icon className={`w-4 h-4 ${getColorClass(category.color)}`} />
                                    <span className="font-medium">{category.name}</span>
                                  </div>
                                ) : (
                                  <span>Select folder...</span>
                                );
                              })()
                            )}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContentWithScrollbar 
                          className={
                            theme === 'light'
                              ? 'bg-white border border-slate-300 max-h-[300px]'
                              : 'bg-slate-800 border-slate-600 max-h-[300px]'
                          }
                        >
                          <SelectItem value="all" className="py-2">
                            <div className="flex items-center gap-2">
                              <Folder className="w-4 h-4 text-purple-500" />
                              <span className="font-medium">All Folders</span>
                            </div>
                          </SelectItem>
                          {allCategories.map((category) => {
                            const colorClass = getColorClass(category.color);
                            return (
                              <SelectItem 
                                key={category.name} 
                                value={category.name}
                                className="py-2"
                              >
                                <div className="flex items-center gap-2">
                                  <category.icon className={`w-4 h-4 ${colorClass}`} />
                                  <span className="font-medium">{category.name}</span>
                                </div>
                              </SelectItem>
                            );
                          })}
                        </SelectContentWithScrollbar>
                      </Select>
                    </div>
                    
                    {/* Edit/Delete buttons for selected custom folder */}
                    {selectedCategory !== "all" && allCategories.find(cat => cat.name === selectedCategory)?.isCustom && (
                      <div className="flex items-center gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const customFolder = customFolders.find(f => f.name === selectedCategory);
                            if (customFolder) {
                              openEditFolderDialog(customFolder);
                            }
                          }}
                          className={
                            theme === 'light'
                              ? 'border-slate-300 text-charcoal bg-white/90 shadow-md'
                              : 'border-slate-600 text-slate-300 shadow-md'
                          }
                          title="Edit folder"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setConfirmDeleteIdx(allCategories.findIndex(c => c.name === selectedCategory));
                          }}
                          className={
                            theme === 'light'
                              ? 'border-slate-300 text-red-500 bg-white/90 shadow-md hover:bg-red-50'
                              : 'border-slate-600 text-red-400 shadow-md hover:bg-red-900/20'
                          }
                          title="Delete folder"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
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
                          
                          {/* Color Picker */}
                          <div className="space-y-2">
                            <Label className="text-sm font-medium">Folder Color</Label>
                            <div className="grid grid-cols-6 gap-2">
                              {[
                                "bg-red-500", "bg-pink-500", "bg-purple-500", "bg-blue-500", "bg-cyan-500", "bg-teal-500",
                                "bg-green-500", "bg-lime-500", "bg-yellow-500", "bg-orange-500", "bg-gray-500", "bg-slate-500"
                              ].map((color) => (
                                <button
                                  key={color}
                                  type="button"
                                  onClick={() => setSelectedFolderColor(color)}
                                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                                    selectedFolderColor === color 
                                      ? 'border-white scale-110 shadow-lg' 
                                      : 'border-slate-600 hover:scale-105'
                                  } ${color}`}
                                  title={color.replace('bg-', '').replace('-500', '')}
                                />
                              ))}
                            </div>
                          </div>
                          
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
                                  const result = await addCustomFolder({
                                    name: newFolderName.trim(),
                                    icon: getIconForFolder(newFolderName.trim()).name,
                                    color: selectedFolderColor,
                                  });
                                  setNewFolderName("");
                                  setSelectedFolderColor("bg-blue-500");
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

            {/* Items Display */}
            <div className="container mx-auto px-2 sm:px-4 py-8 w-full">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                  <span className="ml-3 text-slate-400">
                    Loading your items...
                  </span>
                </div>
              ) : (
                <>
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
                  ) : viewMode === "cards" ? (
                    // Card View
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                      {filtered.map((item, index) => (
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
                      ))}
                    </div>
                  ) : (
                    // List View
                    <div className="space-y-3">
                      {filtered.map((item, index) => (
                        <Card
                          key={item.id}
                          className={
                            (theme === 'light'
                              ? 'bg-white/70 border border-white/60 shadow-lg backdrop-blur-md transition-all duration-300 hover:shadow-xl text-charcoal'
                              : 'bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-all duration-300 animate-slide-up glass text-white')
                            + ' rounded-xl'
                          }
                          style={{ animationDelay: `${index * 50}ms` }}>
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                              <div className="flex items-start space-x-4 flex-1 min-w-0">
                                <div className="flex-shrink-0 mt-1">
                                  {getIconForItem(item)}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center space-x-2 mb-2">
                                    {item.is_pinned && (
                                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                    )}
                                    <h3 className={
                                      (theme === 'light' ? 'text-charcoal text-lg font-semibold truncate' : 'text-white text-lg font-semibold truncate')
                                    }>
                                      {item.title}
                                    </h3>
                                  </div>
                                  
                                  {item.description && (
                                    <p className={
                                      (theme === 'light' ? 'text-slate-700 text-sm mb-3' : 'text-slate-300 text-sm mb-3')
                                    }>
                                      {item.description}
                                    </p>
                                  )}

                                  {item.type === "link" ? (
                                    <div className="flex items-center space-x-2 mb-3">
                                      <Globe className="w-4 h-4 text-blue-400 flex-shrink-0" />
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
                                        className="h-6 w-6 p-0 text-slate-400 hover:text-white flex-shrink-0">
                                        <Copy className="w-3 h-3" />
                                      </Button>
                                    </div>
                                  ) : (
                                    <div className="mb-3">
                                      <p className={
                                        (theme === 'light' ? 'text-slate-700 text-sm' : 'text-slate-300 text-sm')
                                      }>
                                        {item.content}
                                      </p>
                                    </div>
                                  )}

                                  <div className="flex items-center justify-between">
                                    <div className="flex flex-wrap gap-1">
                                      {item.tags.map((tag, tagIndex) => (
                                        <Badge
                                          key={tagIndex}
                                          variant="secondary"
                                          className="text-xs bg-slate-700 text-slate-300">
                                          {tag}
                                        </Badge>
                                      ))}
                                    </div>
                                    <div className="flex items-center space-x-2 text-xs text-slate-500">
                                      <span>{item.category}</span>
                                      <span>•</span>
                                      <span>{new Date(item.created_at).toLocaleDateString()}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex items-center space-x-1 ml-4">
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
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </>
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

      {/* Edit Folder Dialog */}
      <Dialog open={editFolderDialogOpen} onOpenChange={setEditFolderDialogOpen}>
        <DialogContent className={
          theme === 'light'
            ? 'bg-white border border-slate-300 text-charcoal'
            : 'bg-slate-800 border-slate-700 text-white'
        }>
          <DialogHeader>
            <DialogTitle>Edit Folder: {editingFolder?.name}</DialogTitle>
            <DialogDescription>
              Update the folder name and color. Press Enter to save or Escape to cancel.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-folder-name">Folder Name</Label>
              <Input
                id="edit-folder-name"
                value={editFolderForm.name}
                onChange={(e) =>
                  setEditFolderForm({ ...editFolderForm, name: e.target.value })
                }
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleEditFolderSave();
                  } else if (e.key === 'Escape') {
                    setEditFolderDialogOpen(false);
                  }
                }}
                placeholder="Enter folder name..."
                className={
                  theme === 'light'
                    ? 'bg-white border border-slate-300 text-charcoal'
                    : 'bg-slate-700 border-slate-600'
                }
                autoFocus
              />
            </div>
            <div>
              <Label htmlFor="edit-folder-color">Folder Color</Label>
              <Select
                value={editFolderForm.color}
                onValueChange={(value) =>
                  setEditFolderForm({ ...editFolderForm, color: value })
                }>
                <SelectTrigger className={
                  theme === 'light'
                    ? 'bg-white border border-slate-300 text-charcoal'
                    : 'bg-slate-700 border-slate-600'
                }>
                  <SelectValue />
                </SelectTrigger>
                <SelectContentWithScrollbar className={
                  theme === 'light'
                    ? 'bg-white border border-slate-300 max-h-[200px]'
                    : 'bg-slate-700 border-slate-600 max-h-[200px]'
                }>
                  <SelectItem value="bg-blue-500" className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-blue-500"></div>
                    <span>Blue</span>
                  </SelectItem>
                  <SelectItem value="bg-green-500" className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-green-500"></div>
                    <span>Green</span>
                  </SelectItem>
                  <SelectItem value="bg-pink-500" className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-pink-500"></div>
                    <span>Pink</span>
                  </SelectItem>
                  <SelectItem value="bg-orange-500" className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-orange-500"></div>
                    <span>Orange</span>
                  </SelectItem>
                  <SelectItem value="bg-purple-500" className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-purple-500"></div>
                    <span>Purple</span>
                  </SelectItem>
                  <SelectItem value="bg-red-500" className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-red-500"></div>
                    <span>Red</span>
                  </SelectItem>
                  <SelectItem value="bg-yellow-500" className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-yellow-500"></div>
                    <span>Yellow</span>
                  </SelectItem>
                  <SelectItem value="bg-gray-500" className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-gray-500"></div>
                    <span>Gray</span>
                  </SelectItem>
                </SelectContentWithScrollbar>
              </Select>
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setEditFolderDialogOpen(false)}
                className={
                  theme === 'light'
                    ? 'border-slate-300 text-charcoal bg-white'
                    : 'border-slate-600 text-slate-300'
                }>
                Cancel
              </Button>
              <Button
                onClick={handleEditFolderSave}
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
