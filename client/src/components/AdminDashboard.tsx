import { useState } from "react";
import { DashboardSidebar } from "./DashboardSidebar";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "./ui/dialog";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Shield, Users, MessageSquare, Search, Plus, Pencil, Trash2, Eye } from "lucide-react";

interface AdminDashboardProps {
  userEmail: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

interface User {
  id: string;
  email: string;
  joinDate: string;
  apiCallCount: number;
  role: string;
}

interface Question {
  id: string;
  question: string;
  jobTrack: string;
  difficulty: string;
}

const mockUsers: User[] = [
  { id: "1", email: "user1@example.com", joinDate: "2025-11-01", apiCallCount: 45, role: "user" },
  { id: "2", email: "user2@example.com", joinDate: "2025-11-03", apiCallCount: 23, role: "user" },
  { id: "3", email: "admin@example.com", joinDate: "2025-10-15", apiCallCount: 120, role: "admin" },
  { id: "4", email: "user3@example.com", joinDate: "2025-11-05", apiCallCount: 12, role: "user" },
];

const mockQuestions: Question[] = [
  { 
    id: "1", 
    question: "Tell me about a time you faced a difficult technical challenge. How did you approach it?", 
    jobTrack: "software-engineer",
    difficulty: "medium"
  },
  { 
    id: "2", 
    question: "Describe a situation where you had to work with a difficult team member. How did you handle it?", 
    jobTrack: "software-engineer",
    difficulty: "medium"
  },
  { 
    id: "3", 
    question: "How do you prioritize features when you have competing stakeholder demands?", 
    jobTrack: "product-manager",
    difficulty: "hard"
  },
];

export function AdminDashboard({ userEmail, onNavigate, onLogout }: AdminDashboardProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedJobTrack, setSelectedJobTrack] = useState("software-engineer");
  const [isNewQuestionOpen, setIsNewQuestionOpen] = useState(false);
  const [newQuestion, setNewQuestion] = useState({ question: "", jobTrack: "software-engineer", difficulty: "medium" });

  const filteredUsers = mockUsers.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredQuestions = mockQuestions.filter(q => q.jobTrack === selectedJobTrack);

  const handleCreateQuestion = () => {
    console.log("Creating question:", newQuestion);
    setIsNewQuestionOpen(false);
    setNewQuestion({ question: "", jobTrack: "software-engineer", difficulty: "medium" });
  };

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
                {mockUsers.length}
              </p>
            </Card>

            <Card className="p-6 border-[#E2E8F0]">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-[#64748B]">Total Questions</p>
                <MessageSquare className="w-5 h-5 text-[#10B981]" />
              </div>
              <p className="text-3xl" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, color: '#0F172A' }}>
                {mockQuestions.length}
              </p>
            </Card>

            <Card className="p-6 border-[#E2E8F0]">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-[#64748B]">Total API Calls</p>
                <Eye className="w-5 h-5 text-[#F59E0B]" />
              </div>
              <p className="text-3xl" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, color: '#0F172A' }}>
                {mockUsers.reduce((sum, user) => sum + user.apiCallCount, 0)}
              </p>
            </Card>

            <Card className="p-6 border-[#E2E8F0]">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-[#64748B]">Active Today</p>
                <Users className="w-5 h-5 text-[#14B8A6]" />
              </div>
              <p className="text-3xl" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, color: '#0F172A' }}>
                {Math.floor(mockUsers.length * 0.6)}
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
                      {filteredUsers.map((user) => (
                        <TableRow key={user.id} className="border-[#E2E8F0]">
                          <TableCell>{user.email}</TableCell>
                          <TableCell className="text-[#64748B]">{user.joinDate}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="border-[#0D9488] text-[#0D9488]">
                              {user.apiCallCount}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={user.role === "admin" ? "default" : "outline"}
                              className={user.role === "admin" ? "bg-gradient-to-r from-[#0D9488] to-[#14B8A6] text-white border-0" : ""}
                            >
                              {user.role}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex gap-2 justify-end">
                              <Button variant="ghost" size="sm" className="text-[#0D9488] hover:bg-[#0D9488]/10">
                                <Pencil className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="text-[#EF4444] hover:bg-[#EF4444]/10">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
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
                      <Select value={selectedJobTrack} onValueChange={setSelectedJobTrack}>
                        <SelectTrigger className="w-full sm:w-48 border-[#E2E8F0]">
                          <SelectValue placeholder="Select job track" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="software-engineer">Software Engineer</SelectItem>
                          <SelectItem value="product-manager">Product Manager</SelectItem>
                          <SelectItem value="designer">UX/UI Designer</SelectItem>
                          <SelectItem value="data-analyst">Data Analyst</SelectItem>
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
                          <div className="space-y-4 mt-4">
                            <div className="space-y-2">
                              <Label htmlFor="jobTrack">Job Track</Label>
                              <Select 
                                value={newQuestion.jobTrack} 
                                onValueChange={(value) => setNewQuestion({...newQuestion, jobTrack: value})}
                              >
                                <SelectTrigger className="border-[#E2E8F0] focus:border-[#0D9488] focus:ring-[#0D9488]">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="software-engineer">Software Engineer</SelectItem>
                                  <SelectItem value="product-manager">Product Manager</SelectItem>
                                  <SelectItem value="designer">UX/UI Designer</SelectItem>
                                  <SelectItem value="data-analyst">Data Analyst</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="difficulty">Difficulty</Label>
                              <Select 
                                value={newQuestion.difficulty} 
                                onValueChange={(value) => setNewQuestion({...newQuestion, difficulty: value})}
                              >
                                <SelectTrigger className="border-[#E2E8F0] focus:border-[#0D9488] focus:ring-[#0D9488]">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="easy">Easy</SelectItem>
                                  <SelectItem value="medium">Medium</SelectItem>
                                  <SelectItem value="hard">Hard</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="question">Question</Label>
                              <Textarea
                                id="question"
                                placeholder="Enter the interview question..."
                                value={newQuestion.question}
                                onChange={(e) => setNewQuestion({...newQuestion, question: e.target.value})}
                                className="min-h-[150px] border-[#E2E8F0] focus:border-[#0D9488] focus:ring-[#0D9488]"
                              />
                            </div>

                            <div className="flex gap-3 justify-end">
                              <Button 
                                variant="outline" 
                                onClick={() => setIsNewQuestionOpen(false)}
                                className="border-[#E2E8F0]"
                              >
                                Cancel
                              </Button>
                              <Button 
                                onClick={handleCreateQuestion}
                                className="bg-[#0D9488] hover:bg-[#0D9488]/90 text-white"
                                disabled={!newQuestion.question.trim()}
                              >
                                Create Question
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-[#E2E8F0]">
                        <TableHead className="w-[50%]">Question</TableHead>
                        <TableHead>Difficulty</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredQuestions.map((question) => (
                        <TableRow key={question.id} className="border-[#E2E8F0]">
                          <TableCell className="max-w-md">
                            <p className="line-clamp-2">{question.question}</p>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant="outline"
                              className={
                                question.difficulty === "hard" 
                                  ? "border-[#EF4444] text-[#EF4444]"
                                  : question.difficulty === "medium"
                                  ? "border-[#F59E0B] text-[#F59E0B]"
                                  : "border-[#10B981] text-[#10B981]"
                              }
                            >
                              {question.difficulty}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex gap-2 justify-end">
                              <Button variant="ghost" size="sm" className="text-[#0D9488] hover:bg-[#0D9488]/10">
                                <Pencil className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="text-[#EF4444] hover:bg-[#EF4444]/10">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
