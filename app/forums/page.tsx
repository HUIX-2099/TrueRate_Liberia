"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { 
  MessageSquare, TrendingUp, AlertTriangle, Star, 
  ThumbsUp, MessageCircle, Clock, Plus, Search,
  Flame, Pin, Shield, Users, Eye
} from "lucide-react"
import { useAuth } from "@/lib/auth/auth-context"

interface ForumPost {
  id: string
  title: string
  content: string
  author: string
  authorAvatar?: string
  category: 'scams' | 'tips' | 'news' | 'reviews' | 'general'
  createdAt: string
  replies: number
  views: number
  likes: number
  isPinned?: boolean
  isHot?: boolean
  tags: string[]
}

const mockPosts: ForumPost[] = [
  {
    id: '1',
    title: '⚠️ WARNING: Fake $100 bills circulating in Red Light Market',
    content: 'Be very careful when exchanging at Red Light today. Several traders have reported receiving counterfeit $100 notes...',
    author: 'SafeTrader',
    category: 'scams',
    createdAt: '2024-12-05T08:30:00Z',
    replies: 45,
    views: 1250,
    likes: 89,
    isPinned: true,
    isHot: true,
    tags: ['Red Light', 'Counterfeit', 'Alert']
  },
  {
    id: '2',
    title: 'Best time of day to exchange? My findings after 6 months',
    content: 'After tracking rates for 6 months, I found that rates are usually best between 10 AM and 12 PM...',
    author: 'RateExpert',
    category: 'tips',
    createdAt: '2024-12-04T15:20:00Z',
    replies: 32,
    views: 890,
    likes: 67,
    isHot: true,
    tags: ['Tips', 'Strategy', 'Timing']
  },
  {
    id: '3',
    title: 'CBL announces new forex regulations starting January 2025',
    content: 'The Central Bank of Liberia has announced new foreign exchange regulations that will affect...',
    author: 'NewsBot',
    category: 'news',
    createdAt: '2024-12-03T10:00:00Z',
    replies: 28,
    views: 2100,
    likes: 45,
    isPinned: true,
    tags: ['CBL', 'Regulations', 'Official']
  },
  {
    id: '4',
    title: 'Review: Liberty Exchange on Broad Street - Very Professional!',
    content: 'Just wanted to share my positive experience at Liberty Exchange. Fast service, good rates, and very trustworthy...',
    author: 'HappyCustomer',
    category: 'reviews',
    createdAt: '2024-12-02T14:45:00Z',
    replies: 12,
    views: 456,
    likes: 34,
    tags: ['Review', 'Broad Street', 'Recommended']
  },
  {
    id: '5',
    title: 'Dollar dropping next week? What do you all think?',
    content: 'Based on the predictions and some news I\'ve been reading, it seems like the dollar might drop...',
    author: 'Trader101',
    category: 'general',
    createdAt: '2024-12-01T09:15:00Z',
    replies: 67,
    views: 780,
    likes: 23,
    isHot: true,
    tags: ['Discussion', 'Predictions', 'Analysis']
  },
]

const categories = [
  { id: 'all', name: 'All Topics', icon: <MessageSquare className="h-4 w-4" /> },
  { id: 'scams', name: 'Scam Alerts', icon: <AlertTriangle className="h-4 w-4" />, color: 'text-destructive' },
  { id: 'tips', name: 'Exchange Tips', icon: <TrendingUp className="h-4 w-4" />, color: 'text-secondary' },
  { id: 'news', name: 'Market News', icon: <Flame className="h-4 w-4" />, color: 'text-primary' },
  { id: 'reviews', name: 'Changer Reviews', icon: <Star className="h-4 w-4" />, color: 'text-accent' },
  { id: 'general', name: 'General', icon: <Users className="h-4 w-4" /> },
]

export default function ForumsPage() {
  const { user } = useAuth()
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [newPostOpen, setNewPostOpen] = useState(false)
  const [newPost, setNewPost] = useState({ title: '', content: '', category: 'general' })

  const filteredPosts = mockPosts.filter(post => {
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory
    const matchesSearch = searchQuery === '' || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'scams': return 'bg-destructive/10 text-destructive border-destructive/30'
      case 'tips': return 'bg-secondary/10 text-secondary border-secondary/30'
      case 'news': return 'bg-primary/10 text-primary border-primary/30'
      case 'reviews': return 'bg-accent/10 text-accent border-accent/30'
      default: return 'bg-muted'
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (diff < 60) return 'Just now'
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
    return `${Math.floor(diff / 86400)}d ago`
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-12 md:py-16 bg-gradient-to-b from-primary/10 to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <div className="flex justify-center mb-4">
                <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center">
                  <MessageSquare className="h-8 w-8 text-primary" />
                </div>
              </div>
              <Badge className="mb-4">Community Forums</Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
                Discussion Forums
              </h1>
              <p className="text-lg text-muted-foreground text-pretty">
                Share tips, report scams, discuss market trends, and connect with fellow Liberians
              </p>
            </div>
          </div>
        </section>

        {/* Forum Content */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              {/* Search and New Post */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search discussions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Dialog open={newPostOpen} onOpenChange={setNewPostOpen}>
                  <DialogTrigger asChild>
                    <Button className="gap-2">
                      <Plus className="h-4 w-4" />
                      Start New Topic
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                      <DialogTitle>Start New Discussion</DialogTitle>
                      <DialogDescription>
                        Share your knowledge, ask questions, or alert the community
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Category</label>
                        <select 
                          className="w-full p-2 border rounded-md"
                          value={newPost.category}
                          onChange={(e) => setNewPost(prev => ({ ...prev, category: e.target.value }))}
                        >
                          {categories.filter(c => c.id !== 'all').map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Title</label>
                        <Input
                          placeholder="Enter a descriptive title..."
                          value={newPost.title}
                          onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Content</label>
                        <Textarea
                          placeholder="Share your thoughts, questions, or information..."
                          value={newPost.content}
                          onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                          rows={5}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setNewPostOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={() => {
                        // In production, this would save to database
                        alert('Post created! (Demo)')
                        setNewPostOpen(false)
                        setNewPost({ title: '', content: '', category: 'general' })
                      }}>
                        Post Discussion
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid md:grid-cols-4 gap-6">
                {/* Categories Sidebar */}
                <div className="md:col-span-1">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Categories</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-1 p-0 pb-4">
                      {categories.map(cat => (
                        <button
                          key={cat.id}
                          className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                            selectedCategory === cat.id 
                              ? 'bg-primary/10 text-primary border-l-2 border-primary' 
                              : 'hover:bg-muted'
                          }`}
                          onClick={() => setSelectedCategory(cat.id)}
                        >
                          <span className={cat.color}>{cat.icon}</span>
                          <span className="text-sm font-medium">{cat.name}</span>
                        </button>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Forum Stats */}
                  <Card className="mt-4">
                    <CardHeader>
                      <CardTitle className="text-lg">Forum Stats</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Total Topics</span>
                        <span className="font-semibold">1,234</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Total Replies</span>
                        <span className="font-semibold">8,567</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Members</span>
                        <span className="font-semibold">5,678</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Online Now</span>
                        <span className="font-semibold text-secondary">127</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Posts List */}
                <div className="md:col-span-3 space-y-4">
                  {/* Pinned Posts */}
                  {filteredPosts.filter(p => p.isPinned).length > 0 && (
                    <div className="space-y-2 mb-6">
                      <h3 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                        <Pin className="h-4 w-4" />
                        Pinned
                      </h3>
                      {filteredPosts.filter(p => p.isPinned).map(post => (
                        <Card key={post.id} className="border-primary/30 bg-primary/5">
                          <CardContent className="p-4">
                            <div className="flex items-start gap-4">
                              <Avatar>
                                <AvatarFallback>{post.author[0]}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <Badge variant="outline" className={`${getCategoryColor(post.category)} text-xs`}>
                                    {categories.find(c => c.id === post.category)?.name}
                                  </Badge>
                                  {post.isHot && (
                                    <Badge variant="destructive" className="text-xs gap-1">
                                      <Flame className="h-3 w-3" />
                                      Hot
                                    </Badge>
                                  )}
                                </div>
                                <h3 className="font-semibold mb-1 hover:text-primary cursor-pointer">
                                  {post.title}
                                </h3>
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                  {post.content}
                                </p>
                                <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                                  <span>{post.author}</span>
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {formatTimeAgo(post.createdAt)}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <MessageCircle className="h-3 w-3" />
                                    {post.replies}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Eye className="h-3 w-3" />
                                    {post.views}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <ThumbsUp className="h-3 w-3" />
                                    {post.likes}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}

                  {/* Regular Posts */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-muted-foreground">
                      Recent Discussions
                    </h3>
                    {filteredPosts.filter(p => !p.isPinned).map(post => (
                      <Card key={post.id} className="hover:border-muted-foreground/50 transition-colors cursor-pointer">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-4">
                            <Avatar>
                              <AvatarFallback>{post.author[0]}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge variant="outline" className={`${getCategoryColor(post.category)} text-xs`}>
                                  {categories.find(c => c.id === post.category)?.name}
                                </Badge>
                                {post.isHot && (
                                  <Badge variant="destructive" className="text-xs gap-1">
                                    <Flame className="h-3 w-3" />
                                    Hot
                                  </Badge>
                                )}
                              </div>
                              <h3 className="font-semibold mb-1 hover:text-primary">
                                {post.title}
                              </h3>
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {post.content}
                              </p>
                              <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                                <span>{post.author}</span>
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {formatTimeAgo(post.createdAt)}
                                </span>
                                <span className="flex items-center gap-1">
                                  <MessageCircle className="h-3 w-3" />
                                  {post.replies}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Eye className="h-3 w-3" />
                                  {post.views}
                                </span>
                                <span className="flex items-center gap-1">
                                  <ThumbsUp className="h-3 w-3" />
                                  {post.likes}
                                </span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {filteredPosts.length === 0 && (
                    <Card>
                      <CardContent className="p-8 text-center">
                        <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="font-semibold mb-2">No discussions found</h3>
                        <p className="text-sm text-muted-foreground">
                          Be the first to start a discussion in this category!
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}



