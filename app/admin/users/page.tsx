"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import {
  Search,
  Filter,
  ChevronDown,
  Edit,
  Trash,
  Eye,
  MoreHorizontal,
  Plus,
  Mail,
  UserPlus,
  UserMinus,
  Shield,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

interface UserData {
  id: string
  name: string
  email: string
  role: string
  status: "active" | "inactive"
  joinDate: string
  lastActive: string
  avatar: string
}

export default function UsersPage() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [users, setUsers] = useState<UserData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterRole, setFilterRole] = useState("all")
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [addUserDialogOpen, setAddUserDialogOpen] = useState(false)
  const [editUserDialogOpen, setEditUserDialogOpen] = useState(false)
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "Viewer",
    status: "active",
  })

  useEffect(() => {
    // Check authentication
    if (!isAuthenticated) {
      router.push("/admin/login")
      return
    }

    // Mock users data
    const mockUsers: UserData[] = [
      {
        id: "1",
        name: "John Smith",
        email: "john.smith@example.com",
        role: "Admin",
        status: "active",
        joinDate: "2024-12-15",
        lastActive: "2025-03-24",
        avatar: "/placeholder.svg?height=100&width=100",
      },
      {
        id: "2",
        name: "Sarah Johnson",
        email: "sarah.j@example.com",
        role: "Editor",
        status: "active",
        joinDate: "2025-01-10",
        lastActive: "2025-03-23",
        avatar: "/placeholder.svg?height=100&width=100",
      },
      {
        id: "3",
        name: "Michael Chen",
        email: "m.chen@example.com",
        role: "Viewer",
        status: "active",
        joinDate: "2025-02-05",
        lastActive: "2025-03-20",
        avatar: "/placeholder.svg?height=100&width=100",
      },
      {
        id: "4",
        name: "Emily Davis",
        email: "emily.d@example.com",
        role: "Editor",
        status: "inactive",
        joinDate: "2025-01-22",
        lastActive: "2025-03-01",
        avatar: "/placeholder.svg?height=100&width=100",
      },
      {
        id: "5",
        name: "Robert Wilson",
        email: "r.wilson@example.com",
        role: "Viewer",
        status: "active",
        joinDate: "2025-02-18",
        lastActive: "2025-03-22",
        avatar: "/placeholder.svg?height=100&width=100",
      },
    ]

    setUsers(mockUsers)
    setIsLoading(false)
  }, [isAuthenticated, router])

  const handleDeleteUser = (user: UserData) => {
    setSelectedUser(user)
    setDeleteDialogOpen(true)
  }

  const confirmDeleteUser = () => {
    if (selectedUser) {
      // Filter out the deleted user
      const updatedUsers = users.filter((user) => user.id !== selectedUser.id)
      setUsers(updatedUsers)

      // Show success toast
      toast({
        title: "User deleted",
        description: `"${selectedUser.name}" has been deleted successfully.`,
        variant: "success",
      })

      // Close dialog
      setDeleteDialogOpen(false)
      setSelectedUser(null)
    }
  }

  const handleEditUser = (user: UserData) => {
    setSelectedUser(user)
    setEditUserDialogOpen(true)
  }

  const handleAddUser = () => {
    // Generate a new user ID
    const newUserId = (users.length + 1).toString()

    // Create new user object
    const userToAdd: UserData = {
      id: newUserId,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      status: newUser.status as "active" | "inactive",
      joinDate: new Date().toISOString().split("T")[0],
      lastActive: new Date().toISOString().split("T")[0],
      avatar: "/placeholder.svg?height=100&width=100",
    }

    // Add user to list
    setUsers([...users, userToAdd])

    // Show success toast
    toast({
      title: "User added",
      description: `"${newUser.name}" has been added successfully.`,
      variant: "success",
    })

    // Reset form and close dialog
    setNewUser({
      name: "",
      email: "",
      role: "Viewer",
      status: "active",
    })
    setAddUserDialogOpen(false)
  }

  const saveEditedUser = () => {
    if (selectedUser) {
      // Update user in the list
      const updatedUsers = users.map((user) => (user.id === selectedUser.id ? selectedUser : user))

      setUsers(updatedUsers)

      // Show success toast
      toast({
        title: "User updated",
        description: `"${selectedUser.name}" has been updated successfully.`,
        variant: "success",
      })

      // Close dialog
      setEditUserDialogOpen(false)
      setSelectedUser(null)
    }
  }

  const filteredUsers = users.filter((user) => {
    // Apply search filter
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())

    // Apply role filter
    const matchesRole = filterRole === "all" || user.role.toLowerCase() === filterRole.toLowerCase()

    return matchesSearch && matchesRole
  })

  if (!isAuthenticated) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-black">User Management</h1>
            <p className="text-gray-500">Manage user accounts and permissions</p>
          </div>
          <Button className="bg-[#F0B90B] hover:bg-[#F0B90B]/90 text-black" onClick={() => setAddUserDialogOpen(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Add New User
          </Button>
        </div>

        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Search users..."
              className="pl-10 w-full bg-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Role: {filterRole === "all" ? "All" : filterRole}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setFilterRole("all")}>All</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterRole("Admin")}>Admin</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterRole("Editor")}>Editor</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterRole("Viewer")}>Viewer</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F0B90B]"></div>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="bg-gray-100 p-3 rounded-full mb-4">
                  <UserMinus className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-700 mb-1">No users found</h3>
                <p className="text-sm text-gray-500 mb-4">
                  {searchQuery ? "Try a different search term" : "Add your first user to get started"}
                </p>
                {!searchQuery && (
                  <Button
                    className="bg-[#F0B90B] hover:bg-[#F0B90B]/90 text-black"
                    onClick={() => setAddUserDialogOpen(true)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add User
                  </Button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">User</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Email</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Role</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Join Date</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Last Active</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="relative w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                              <Image
                                src={user.avatar || "/placeholder.svg"}
                                alt={user.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <span className="font-medium text-sm">{user.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm">{user.email}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1">
                            {user.role === "Admin" && <ShieldAlert className="h-3.5 w-3.5 text-red-500" />}
                            {user.role === "Editor" && <ShieldCheck className="h-3.5 w-3.5 text-blue-500" />}
                            {user.role === "Viewer" && <Shield className="h-3.5 w-3.5 text-gray-500" />}
                            <span className="text-sm">{user.role}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <Badge
                            variant="outline"
                            className={`
                              ${user.status === "active" ? "bg-green-50 text-green-600 border-green-200" : ""}
                              ${user.status === "inactive" ? "bg-gray-50 text-gray-600 border-gray-200" : ""}
                            `}
                          >
                            {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-sm">{user.joinDate}</td>
                        <td className="py-3 px-4 text-sm">{user.lastActive}</td>
                        <td className="py-3 px-4">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEditUser(user)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Mail className="h-4 w-4 mr-2" />
                                Email
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Eye className="h-4 w-4 mr-2" />
                                View
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-500" onClick={() => handleDeleteUser(user)}>
                                <Trash className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Add User Dialog */}
      <Dialog open={addUserDialogOpen} onOpenChange={setAddUserDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>Create a new user account with specific permissions.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="Enter user's full name"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter user's email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select value={newUser.role} onValueChange={(value) => setNewUser({ ...newUser, role: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Editor">Editor</SelectItem>
                  <SelectItem value="Viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="status">Active Status</Label>
              <Switch
                id="status"
                checked={newUser.status === "active"}
                onCheckedChange={(checked) => setNewUser({ ...newUser, status: checked ? "active" : "inactive" })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddUserDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-[#F0B90B] hover:bg-[#F0B90B]/90 text-black"
              onClick={handleAddUser}
              disabled={!newUser.name || !newUser.email}
            >
              Add User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={editUserDialogOpen} onOpenChange={setEditUserDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Update user information and permissions.</DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Full Name</Label>
                <Input
                  id="edit-name"
                  value={selectedUser.name}
                  onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={selectedUser.email}
                  onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-role">Role</Label>
                <Select
                  value={selectedUser.role}
                  onValueChange={(value) => setSelectedUser({ ...selectedUser, role: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Editor">Editor</SelectItem>
                    <SelectItem value="Viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="edit-status">Active Status</Label>
                <Switch
                  id="edit-status"
                  checked={selectedUser.status === "active"}
                  onCheckedChange={(checked) =>
                    setSelectedUser({ ...selectedUser, status: checked ? "active" : "inactive" })
                  }
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditUserDialogOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-[#F0B90B] hover:bg-[#F0B90B]/90 text-black" onClick={saveEditedUser}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="flex items-center gap-3 py-3">
              <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                <Image
                  src={selectedUser.avatar || "/placeholder.svg"}
                  alt={selectedUser.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <p className="font-medium">{selectedUser.name}</p>
                <p className="text-sm text-gray-500">{selectedUser.email}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteUser}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

