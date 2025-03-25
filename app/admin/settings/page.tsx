"use client"

import { Badge } from "@/components/ui/badge"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { motion } from "framer-motion"
import { Save, Upload, AlertCircle } from "lucide-react"
import Image from "next/image"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function SettingsPage() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [resetPasswordDialogOpen, setResetPasswordDialogOpen] = useState(false)
  const [deleteAccountDialogOpen, setDeleteAccountDialogOpen] = useState(false)

  useEffect(() => {
    // Check authentication
    if (!isAuthenticated) {
      router.push("/admin/login")
      return
    }

    // Simulate loading data
    const timer = setTimeout(() => {
      setLogoPreview("/images/logo.png")
      setIsLoading(false)
    }, 800)

    return () => clearTimeout(timer)
  }, [isAuthenticated, router])

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setLogoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSaveSettings = async () => {
    setIsSaving(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Settings saved",
        description: "Your settings have been updated successfully.",
        variant: "success",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error saving your settings.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleResetPassword = async () => {
    setIsSaving(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Password reset email sent",
        description: "Check your email for instructions to reset your password.",
        variant: "success",
      })

      setResetPasswordDialogOpen(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error sending the password reset email.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (!isAuthenticated) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="p-6 max-w-7xl mx-auto w-full">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-black">Settings</h1>
            <p className="text-gray-500">Manage your account and website preferences</p>
          </div>
          <Button
            className="bg-[#F0B90B] hover:bg-[#F0B90B]/90 text-black flex items-center gap-2"
            onClick={handleSaveSettings}
            disabled={isLoading || isSaving}
          >
            <Save className="h-4 w-4" />
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>

        {isLoading ? (
          <div className="space-y-6">
            <Card className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="h-10 bg-gray-200 rounded"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Tabs defaultValue="account" className="space-y-6">
            <TabsList className="mb-4">
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="site">Site Settings</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>

            <TabsContent value="account">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>Update your account details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="md:w-1/3">
                        <div className="flex flex-col items-center space-y-3">
                          <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200">
                            <Image
                              src={logoPreview || "/placeholder.svg?height=100&width=100"}
                              alt="Profile picture"
                              fill
                              className="object-cover"
                            />
                          </div>
                          <Label
                            htmlFor="profile-picture"
                            className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-md text-sm font-medium inline-flex items-center"
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            Change Photo
                            <Input
                              id="profile-picture"
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleLogoChange}
                            />
                          </Label>
                        </div>
                      </div>
                      <div className="md:w-2/3 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="first-name">First Name</Label>
                            <Input id="first-name" defaultValue="Admin" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="last-name">Last Name</Label>
                            <Input id="last-name" defaultValue="User" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input id="email" type="email" defaultValue="admin@chaintalkdaily.com" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="role">Role</Label>
                          <Input id="role" defaultValue="Administrator" disabled />
                          <p className="text-xs text-gray-500">
                            Your role determines your permissions on the platform.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Account Preferences</CardTitle>
                    <CardDescription>Customize your account settings</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="language">Language</Label>
                      <Select defaultValue="en">
                        <SelectTrigger>
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="zh">Chinese</SelectItem>
                          <SelectItem value="es">Spanish</SelectItem>
                          <SelectItem value="fr">French</SelectItem>
                          <SelectItem value="de">German</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Timezone</Label>
                      <Select defaultValue="utc">
                        <SelectTrigger>
                          <SelectValue placeholder="Select timezone" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="utc">UTC (Coordinated Universal Time)</SelectItem>
                          <SelectItem value="est">EST (Eastern Standard Time)</SelectItem>
                          <SelectItem value="cst">CST (Central Standard Time)</SelectItem>
                          <SelectItem value="mst">MST (Mountain Standard Time)</SelectItem>
                          <SelectItem value="pst">PST (Pacific Standard Time)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="two-factor" className="text-base">
                          Two-Factor Authentication
                        </Label>
                        <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                      </div>
                      <Switch id="two-factor" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-red-600">Danger Zone</CardTitle>
                    <CardDescription>Irreversible account actions</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
                      <div>
                        <h3 className="font-medium">Delete Account</h3>
                        <p className="text-sm text-gray-500">Permanently delete your account and all associated data</p>
                      </div>
                      <Button variant="destructive" onClick={() => setDeleteAccountDialogOpen(true)}>
                        Delete Account
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="site">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Site Information</CardTitle>
                    <CardDescription>Update your website details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="md:w-1/3">
                        <div className="flex flex-col items-center space-y-3">
                          <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200">
                            <Image
                              src={logoPreview || "/placeholder.svg?height=100&width=100"}
                              alt="Site logo"
                              fill
                              className="object-cover"
                            />
                          </div>
                          <Label
                            htmlFor="site-logo"
                            className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-md text-sm font-medium inline-flex items-center"
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            Change Logo
                            <Input
                              id="site-logo"
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleLogoChange}
                            />
                          </Label>
                        </div>
                      </div>
                      <div className="md:w-2/3 space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="site-name">Site Name</Label>
                          <Input id="site-name" defaultValue="ChainTalkDaily" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="site-description">Site Description</Label>
                          <Textarea
                            id="site-description"
                            defaultValue="Crypto Learning Platform with educational videos from CZ and Yi He"
                            rows={3}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="site-keywords">Keywords (SEO)</Label>
                          <Input
                            id="site-keywords"
                            defaultValue="crypto, blockchain, education, CZ, Yi He, cryptocurrency, learning"
                          />
                          <p className="text-xs text-gray-500">Separate keywords with commas</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Social Media</CardTitle>
                    <CardDescription>Connect your social media accounts</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="twitter">Twitter</Label>
                        <Input id="twitter" defaultValue="https://twitter.com/chaintalkdaily" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="telegram">Telegram</Label>
                        <Input id="telegram" defaultValue="https://t.me/chaintalkdaily" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="discord">Discord</Label>
                        <Input id="discord" defaultValue="https://discord.gg/chaintalkdaily" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="youtube">YouTube</Label>
                        <Input id="youtube" defaultValue="https://youtube.com/chaintalkdaily" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Advanced Settings</CardTitle>
                    <CardDescription>Configure technical settings</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="analytics-id">Google Analytics ID</Label>
                      <Input id="analytics-id" defaultValue="UA-123456789-1" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="maintenance-mode" className="text-base">
                          Maintenance Mode
                        </Label>
                        <p className="text-sm text-gray-500">Temporarily disable the site for maintenance</p>
                      </div>
                      <Switch id="maintenance-mode" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="cache-clear" className="text-base">
                          Clear Cache
                        </Label>
                        <p className="text-sm text-gray-500">Clear the site cache to apply recent changes</p>
                      </div>
                      <Button variant="outline">Clear Cache</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>Manage how you receive notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Email Notifications</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="email-comments" className="text-base">
                            Comments
                          </Label>
                          <p className="text-sm text-gray-500">
                            Receive notifications when someone comments on your videos
                          </p>
                        </div>
                        <Switch id="email-comments" defaultChecked />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="email-uploads" className="text-base">
                            New Uploads
                          </Label>
                          <p className="text-sm text-gray-500">Receive notifications when new videos are uploaded</p>
                        </div>
                        <Switch id="email-uploads" defaultChecked />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="email-analytics" className="text-base">
                            Analytics Reports
                          </Label>
                          <p className="text-sm text-gray-500">Receive weekly analytics reports</p>
                        </div>
                        <Switch id="email-analytics" defaultChecked />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="email-marketing" className="text-base">
                            Marketing Emails
                          </Label>
                          <p className="text-sm text-gray-500">Receive promotional emails and newsletters</p>
                        </div>
                        <Switch id="email-marketing" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">System Notifications</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="system-security" className="text-base">
                            Security Alerts
                          </Label>
                          <p className="text-sm text-gray-500">Receive notifications about security events</p>
                        </div>
                        <Switch id="system-security" defaultChecked />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="system-updates" className="text-base">
                            System Updates
                          </Label>
                          <p className="text-sm text-gray-500">Receive notifications about system updates</p>
                        </div>
                        <Switch id="system-updates" defaultChecked />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="bg-[#F0B90B] hover:bg-[#F0B90B]/90 text-black" onClick={handleSaveSettings}>
                    Save Notification Settings
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="security">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Password</CardTitle>
                    <CardDescription>Update your password</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <Input id="current-password" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input id="new-password" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <Input id="confirm-password" type="password" />
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={() => setResetPasswordDialogOpen(true)}>
                      Forgot Password?
                    </Button>
                    <Button className="bg-[#F0B90B] hover:bg-[#F0B90B]/90 text-black">Update Password</Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Two-Factor Authentication</CardTitle>
                    <CardDescription>Add an extra layer of security to your account</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Two-Factor Authentication</h3>
                        <p className="text-sm text-gray-500">Protect your account with 2FA</p>
                      </div>
                      <Switch id="enable-2fa" />
                    </div>
                    <div className="p-4 border border-yellow-200 rounded-lg bg-yellow-50 flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-yellow-800">Two-factor authentication is not enabled</h4>
                        <p className="text-sm text-yellow-700 mt-1">
                          We strongly recommend enabling two-factor authentication to secure your account.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Login Sessions</CardTitle>
                    <CardDescription>Manage your active sessions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">Current Session</h4>
                            <p className="text-sm text-gray-500 mt-1">Chrome on Windows • IP: 192.168.1.1</p>
                            <p className="text-xs text-gray-400 mt-1">Started: March 24, 2025, 10:40 PM</p>
                          </div>
                          <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                            Active
                          </Badge>
                        </div>
                      </div>

                      <div className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">Safari on macOS</h4>
                            <p className="text-sm text-gray-500 mt-1">IP: 192.168.1.2</p>
                            <p className="text-xs text-gray-400 mt-1">Last active: March 23, 2025, 8:15 PM</p>
                          </div>
                          <Button variant="outline" size="sm" className="text-red-500">
                            Revoke
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="text-red-500">
                      Revoke All Other Sessions
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </motion.div>

      {/* Reset Password Dialog */}
      <Dialog open={resetPasswordDialogOpen} onOpenChange={setResetPasswordDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>We'll send you an email with instructions to reset your password.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-3">
            <div className="space-y-2">
              <Label htmlFor="reset-email">Email</Label>
              <Input id="reset-email" type="email" defaultValue="admin@chaintalkdaily.com" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setResetPasswordDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-[#F0B90B] hover:bg-[#F0B90B]/90 text-black"
              onClick={handleResetPassword}
              disabled={isSaving}
            >
              {isSaving ? "Sending..." : "Send Reset Link"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Account Dialog */}
      <Dialog open={deleteAccountDialogOpen} onOpenChange={setDeleteAccountDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-600">Delete Account</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your account and remove all associated data.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-3">
            <div className="p-4 border border-red-200 rounded-lg bg-red-50">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-red-800">Warning: Permanent Action</h4>
                  <p className="text-sm text-red-700 mt-1">
                    All your data, including videos, comments, and settings will be permanently deleted.
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-delete">Type "DELETE" to confirm</Label>
              <Input id="confirm-delete" placeholder="DELETE" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteAccountDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive">Delete Account</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

