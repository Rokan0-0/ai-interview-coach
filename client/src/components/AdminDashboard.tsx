import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardSidebar } from "./DashboardSidebar";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "./ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Shield, Users, MessageSquare, Search, Plus, Pencil, Trash2, Eye } from "lucide-react";

interface AdminDashboardProps {
  userEmail: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

interface User {
  id: number;
  email: string;
  createdAt: string;
  apiCallCount: number;
  role: string;
  provider: string;
  lastApiCallDate: string;
}

interface Question {
  id: number;
  text: string;
  jobTrack: {
    id: number;
    name: string;
  };
}

interface JobTrack {
  id: number;
  name: string;
}

export function AdminDashboard({ userEmail, onNavigate, onLogout }: AdminDashboardProps) {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newQuestionText, setNewQuestionText] = useState("");
  const [newJobTrackId, setNewJobTrackId] = useState<number>(1);
  const [jobTracks, setJobTracks] = useState<JobTrack[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedJobTrack, setSelectedJobTrack] = useState<number | null>(null);
  const [isNewQuestionOpen, setIsNewQuestionOpen] = useState(false);
  const [newTrackName, setNewTrackName] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);

  // Fetch job tracks
  useEffect(() => {
    const fetchJobTracks = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/api/tracks', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem('token');
            navigate('/login');
            return;
          }
          throw new Error('Failed to fetch job tracks');
        }

        const data = await response.json();
        setJobTracks(data);
        if (data.length > 0) {
          setNewJobTrackId(data[0].id);
        }
      } catch (err) {
        console.error('Error fetching job tracks:', err);
      }
    };

    fetchJobTracks();
  }, [navigate]);

  // Fetch questions
  useEffect(() => {
    const fetchQuestions = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/api/admin/questions', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          if (response.status === 403) {
            setError('Access Denied');
            navigate('/dashboard');
            return;
          }
          if (response.status === 401) {
            localStorage.removeItem('token');
            navigate('/login');
            return;
          }
          throw new Error('Failed to fetch questions');
        }

        const data = await response.json();
        setQuestions(data);
      } catch (err) {
        console.error('Error fetching questions:', err);
        setError('Failed to load questions');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [navigate]);

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        setUsersLoading(false);
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/api/admin/users', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          if (response.status === 403) {
            setError('Access Denied');
            navigate('/dashboard');
            return;
          }
          if (response.status === 401) {
            localStorage.removeItem('token');
            navigate('/login');
            return;
          }
          throw new Error('Failed to fetch users');
        }

        const data: User[] = await response.json();
        setUsers(data);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to load users');
        setUsers([]);
      } finally {
        setUsersLoading(false);
      }
    };

    fetchUsers();
  }, [navigate]);

  const handleDelete = async (questionId: number) => {
    // Security: Add confirmation dialog before deletion
    const question = questions.find(q => q.id === questionId);
    const questionText = question?.text || 'this question';
    const confirmMessage = `Are you sure you want to delete this question?\n\n"${questionText.substring(0, 100)}${questionText.length > 100 ? '...' : ''}"\n\nThis action cannot be undone.`;
    
    if (!window.confirm(confirmMessage)) {
      return; // User cancelled
    }

    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/admin/questions/${questionId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        if (response.status === 403) {
          setError('Access Denied');
          navigate('/dashboard');
          return;
        }
        if (response.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
          return;
        }
        throw new Error('Failed to delete question');
      }

      // Remove the deleted question from state
      setQuestions(questions.filter(q => q.id !== questionId));
    } catch (err) {
      console.error('Error deleting question:', err);
      setError('Failed to delete question');
    }
  };

  const handleCreateTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/admin/tracks', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: newTrackName
        })
      });

      if (!response.ok) {
        if (response.status === 403) {
          setError('Access Denied');
          navigate('/dashboard');
          return;
        }
        if (response.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
          return;
        }
        throw new Error('Failed to create track');
      }

      const data = await response.json();
      // Add the new track to state
      setJobTracks([...jobTracks, data]);
      // Clear form
      setNewTrackName("");
    } catch (err) {
      console.error('Error creating track:', err);
      setError('Failed to create track');
    }
  };

  const handleDeleteTrack = async (trackId: number) => {
    // Security: Add confirmation dialog before deletion
    const track = jobTracks.find(t => t.id === trackId);
    const trackName = track?.name || 'this track';
    const questionCount = questions.filter(q => q.jobTrack.id === trackId).length;
    const confirmMessage = `Are you sure you want to delete "${trackName}"?\n\nThis will also delete ${questionCount} question${questionCount !== 1 ? 's' : ''} associated with this track.\n\nThis action cannot be undone.`;
    
    if (!window.confirm(confirmMessage)) {
      return; // User cancelled
    }

    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/admin/tracks/${trackId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        if (response.status === 403) {
          setError('Access Denied');
          navigate('/dashboard');
          return;
        }
        if (response.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
          return;
        }
        throw new Error('Failed to delete track');
      }

      // Remove the deleted track from state
      setJobTracks(jobTracks.filter(t => t.id !== trackId));
      // Also remove questions associated with this track
      setQuestions(questions.filter(q => q.jobTrack.id !== trackId));
    } catch (err) {
      console.error('Error deleting track:', err);
      setError('Failed to delete track');
    }
  };

  const handleSubmitNewQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/admin/questions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: newQuestionText,
          jobTrackId: newJobTrackId
        })
      });

      if (!response.ok) {
        if (response.status === 403) {
          setError('Access Denied');
          navigate('/dashboard');
          return;
        }
        if (response.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
          return;
        }
        throw new Error('Failed to create question');
      }

      const data = await response.json();
      // Add the new question to the state
      setQuestions([...questions, data]);
      
      // Clear form
      setNewQuestionText("");
      if (jobTracks.length > 0) {
        setNewJobTrackId(jobTracks[0].id);
      }
      setIsNewQuestionOpen(false);
    } catch (err) {
      console.error('Error creating question:', err);
      setError('Failed to create question');
    }
  };

  const filteredQuestions = selectedJobTrack
    ? questions.filter(q => q.jobTrack.id === selectedJobTrack)
    : questions;

  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatJoinDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return 'Unknown';
    }
  };

  const remainingRequests = (user: User) => {
    const remaining = 20 - user.apiCallCount;
    return remaining < 0 ? 0 : remaining;
  };

  const apiUsagePercent = (user: User) =>
    Math.min(100, Math.max(0, (user.apiCallCount / 20) * 100));

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <DashboardSidebar 
        currentPage="dashboard"
        onNavigate={onNavigate}
        onLogout={onLogout}
        userEmail={userEmail}
      />
      
      <main className="flex-1 p-6 lg:p-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0D9488] to-[#14B8A6] flex items-center justify-center shadow-md">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}>
                  Admin Dashboard
                </h1>
              </div>
            </div>
            <p className="text-[#64748B]">
              Manage users, questions, and system settings
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid sm:grid-cols-4 gap-4 mb-8">
            <Card className="p-6 border-[#E2E8F0]">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-[#64748B]">Total Users</p>
                <Users className="w-5 h-5 text-[#0D9488]" />
              </div>
              <p className="text-3xl" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, color: '#0F172A' }}>
                {users.length}
              </p>
            </Card>

            <Card className="p-6 border-[#E2E8F0]">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-[#64748B]">Total Questions</p>
                <MessageSquare className="w-5 h-5 text-[#10B981]" />
              </div>
              <p className="text-3xl" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, color: '#0F172A' }}>
                {questions.length}
              </p>
            </Card>

            <Card className="p-6 border-[#E2E8F0]">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-[#64748B]">Total API Calls</p>
                <Eye className="w-5 h-5 text-[#F59E0B]" />
              </div>
              <p className="text-3xl" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, color: '#0F172A' }}>
                {users.reduce((sum, user) => sum + (user.apiCallCount || 0), 0)}
              </p>
            </Card>

            <Card className="p-6 border-[#E2E8F0]">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-[#64748B]">Active Today</p>
                <Users className="w-5 h-5 text-[#14B8A6]" />
              </div>
              <p className="text-3xl" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, color: '#0F172A' }}>
                {Math.max(0, Math.floor(users.length * 0.6))}
              </p>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="users" className="space-y-6">
            <TabsList className="bg-white border border-[#E2E8F0]">
              <TabsTrigger value="users" className="data-[state=active]:bg-[#0D9488] data-[state=active]:text-white">
                <Users className="w-4 h-4 mr-2" />
                User Management
              </TabsTrigger>
              <TabsTrigger value="tracks" className="data-[state=active]:bg-[#0D9488] data-[state=active]:text-white">
                <Shield className="w-4 h-4 mr-2" />
                Job Tracks
              </TabsTrigger>
              <TabsTrigger value="questions" className="data-[state=active]:bg-[#0D9488] data-[state=active]:text-white">
                <MessageSquare className="w-4 h-4 mr-2" />
                Question Management
              </TabsTrigger>
            </TabsList>

            {/* User Management Tab */}
            <TabsContent value="users" className="space-y-6">
              <Card className="border-[#E2E8F0]">
                <div className="p-6 border-b border-[#E2E8F0]">
                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    <div>
                      <h2 className="text-xl mb-1" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}>
                        Users
                      </h2>
                      <p className="text-sm text-[#64748B]">
                        Manage user accounts and permissions
                      </p>
                    </div>
                    <div className="w-full sm:w-auto">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
                        <Input
                          placeholder="Search users..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 w-full sm:w-64 border-[#E2E8F0] focus:border-[#0D9488] focus:ring-[#0D9488]"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-[#E2E8F0]">
                        <TableHead>Email</TableHead>
                        <TableHead>Join Date</TableHead>
                        <TableHead>API Calls</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {usersLoading ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center text-[#64748B] py-8">
                            Loading users...
                          </TableCell>
                        </TableRow>
                      ) : filteredUsers.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center text-[#64748B] py-8">
                            No users found
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredUsers.map((user) => {
                          const usagePercent = apiUsagePercent(user);
                          const remaining = remainingRequests(user);

                          return (
                            <TableRow key={user.id} className="border-[#E2E8F0]">
                              <TableCell className="font-medium">
                                <div className="flex flex-col">
                                  <span>{user.email}</span>
                                  <span className="text-xs text-[#94A3B8]">{user.provider?.toUpperCase() || 'EMAIL'}</span>
                                </div>
                              </TableCell>
                              <TableCell className="text-[#64748B]">
                                {formatJoinDate(user.createdAt)}
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant="outline"
                                  className={usagePercent >= 80 ? "border-[#EF4444] text-[#EF4444] bg-[#EF4444]/10" : "border-[#0D9488] text-[#0D9488] bg-[#0D9488]/10"}
                                >
                                  {user.apiCallCount} used / {remaining} left
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge 
                                  variant={user.role === "ADMIN" ? "default" : "outline"}
                                  className={user.role === "ADMIN" ? "bg-gradient-to-r from-[#0D9488] to-[#14B8A6] text-white border-0" : ""}
                                >
                                  {user.role || 'USER'}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex gap-2 justify-end">
                                  <Button variant="ghost" size="sm" className="text-[#0D9488] hover:bg-[#0D9488]/10">
                                    <Pencil className="w-4 h-4" />
                                  </Button>
                                  <Button variant="ghost" size="sm" className="text-[#EF4444] hover:bg-[#EF4444]/10" disabled>
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })
                      )}
                    </TableBody>
                  </Table>
                </div>
              </Card>
            </TabsContent>

            {/* Job Tracks Management Tab */}
            <TabsContent value="tracks" className="space-y-6">
              <Card className="border-[#E2E8F0]">
                <div className="p-6 border-b border-[#E2E8F0]">
                  <div>
                    <h2 className="text-xl mb-1" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}>
                      Job Tracks
                    </h2>
                    <p className="text-sm text-[#64748B]">
                      Create and manage job tracks
                    </p>
                  </div>
                </div>

                {/* Create New Track Form */}
                <div className="p-6 border-b border-[#E2E8F0]">
                  <h3 className="text-lg mb-4" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}>
                    Create New Track
                  </h3>
                  <form onSubmit={handleCreateTrack} className="flex gap-3">
                    <Input
                      placeholder="Enter track name (e.g., Software Engineer)"
                      value={newTrackName}
                      onChange={(e) => setNewTrackName(e.target.value)}
                      className="flex-1 border-[#E2E8F0] focus:border-[#0D9488] focus:ring-[#0D9488]"
                      required
                    />
                    <Button 
                      type="submit"
                      className="bg-[#0D9488] hover:bg-[#0D9488]/90 text-white"
                      disabled={!newTrackName.trim()}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create Track
                    </Button>
                  </form>
                </div>

                {/* Tracks List */}
                <div className="p-6">
                  <h3 className="text-lg mb-4" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}>
                    All Job Tracks
                  </h3>
                  {jobTracks.length === 0 ? (
                    <p className="text-[#64748B] text-center py-8">No job tracks found</p>
                  ) : (
                    <div className="space-y-3">
                      {jobTracks.map((track) => (
                        <div 
                          key={track.id} 
                          className="flex items-center justify-between p-4 border border-[#E2E8F0] rounded-lg hover:bg-[#F8FAFC]"
                        >
                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className="border-[#0D9488] text-[#0D9488] text-base px-3 py-1">
                              {track.name}
                            </Badge>
                            <span className="text-sm text-[#64748B]">
                              {questions.filter(q => q.jobTrack.id === track.id).length} questions
                            </span>
                          </div>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-[#EF4444] hover:bg-[#EF4444]/10"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Job Track</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{track.name}"? This will also delete all {questions.filter(q => q.jobTrack.id === track.id).length} questions associated with this track. This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteTrack(track.id)}
                                  className="bg-[#EF4444] hover:bg-[#EF4444]/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            </TabsContent>

            {/* Question Management Tab */}
            <TabsContent value="questions" className="space-y-6">
              <Card className="border-[#E2E8F0]">
                <div className="p-6 border-b border-[#E2E8F0]">
                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    <div>
                      <h2 className="text-xl mb-1" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}>
                        Questions
                      </h2>
                      <p className="text-sm text-[#64748B]">
                        Create and manage interview questions
                      </p>
                    </div>
                    <div className="flex gap-3 w-full sm:w-auto">
                      <Select 
                        value={selectedJobTrack?.toString() || "all"} 
                        onValueChange={(value) => setSelectedJobTrack(value === "all" ? null : parseInt(value))}
                      >
                        <SelectTrigger className="w-full sm:w-48 border-[#E2E8F0]">
                          <SelectValue placeholder="Select job track" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Tracks</SelectItem>
                          {jobTracks.map((track) => (
                            <SelectItem key={track.id} value={track.id.toString()}>
                              {track.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Dialog open={isNewQuestionOpen} onOpenChange={setIsNewQuestionOpen}>
                        <DialogTrigger asChild>
                          <Button className="bg-[#0D9488] hover:bg-[#0D9488]/90 text-white">
                            <Plus className="w-4 h-4 mr-2" />
                            New Question
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-xl">
                          <DialogHeader>
                            <DialogTitle style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}>
                              Create New Question
                            </DialogTitle>
                            <DialogDescription>
                              Add a new interview question to the selected job track
                            </DialogDescription>
                          </DialogHeader>
                          <form onSubmit={handleSubmitNewQuestion} className="space-y-4 mt-4">
                            <div className="space-y-2">
                              <Label htmlFor="jobTrack">Job Track</Label>
                              <Select 
                                value={newJobTrackId.toString()} 
                                onValueChange={(value) => setNewJobTrackId(parseInt(value))}
                              >
                                <SelectTrigger className="border-[#E2E8F0] focus:border-[#0D9488] focus:ring-[#0D9488]">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {jobTracks.map((track) => (
                                    <SelectItem key={track.id} value={track.id.toString()}>
                                      {track.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="question">Question</Label>
                              <Textarea
                                id="question"
                                placeholder="Enter the interview question..."
                                value={newQuestionText}
                                onChange={(e) => setNewQuestionText(e.target.value)}
                                className="min-h-[150px] border-[#E2E8F0] focus:border-[#0D9488] focus:ring-[#0D9488]"
                                required
                              />
                            </div>

                            <div className="flex gap-3 justify-end">
                              <Button 
                                type="button"
                                variant="outline" 
                                onClick={() => setIsNewQuestionOpen(false)}
                                className="border-[#E2E8F0]"
                              >
                                Cancel
                              </Button>
                              <Button 
                                type="submit"
                                className="bg-[#0D9488] hover:bg-[#0D9488]/90 text-white"
                                disabled={!newQuestionText.trim()}
                              >
                                Create Question
                              </Button>
                            </div>
                          </form>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </div>

                {loading && (
                  <div className="p-6 text-center text-[#64748B]">
                    Loading questions...
                  </div>
                )}

                {error && !loading && (
                  <div className="p-6 text-center text-[#EF4444]">
                    {error}
                  </div>
                )}

                {!loading && !error && (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-[#E2E8F0]">
                          <TableHead className="w-[50%]">Question</TableHead>
                          <TableHead>Job Track</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredQuestions.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={3} className="text-center text-[#64748B] py-8">
                              No questions found
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredQuestions.map((question) => (
                            <TableRow key={question.id} className="border-[#E2E8F0]">
                              <TableCell className="max-w-md">
                                <p className="line-clamp-2">{question.text}</p>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className="border-[#0D9488] text-[#0D9488]">
                                  {question.jobTrack.name}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex gap-2 justify-end">
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        className="text-[#EF4444] hover:bg-[#EF4444]/10"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>Delete Question</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          Are you sure you want to delete this question? This action cannot be undone.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction
                                          onClick={() => handleDelete(question.id)}
                                          className="bg-[#EF4444] hover:bg-[#EF4444]/90"
                                        >
                                          Delete
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
