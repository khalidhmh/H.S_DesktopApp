import React, { useEffect, useState } from 'react'
import { useComplaintStore } from '../../../viewmodels/useComplaintStore'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../../../components/ui/card'
import { Badge } from '../../../components/ui/badge'
import { Button } from '../../../components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '../../../components/ui/dialog'
import { Textarea } from '../../../components/ui/textarea'
import { CheckCircle, AlertTriangle, User, MapPin, Clock, MessageSquare } from 'lucide-react'
import { format } from 'date-fns'
import { ar } from 'date-fns/locale'
import type { Issue } from '../../../services/complaint.service'

export default function ComplaintsPage() {
  const { issues, filter, fetchIssues, resolveIssue, setFilter, isLoading } = useComplaintStore()
  const [activeTab, setActiveTab] = useState('PENDING')
  const [selectedComplaint, setSelectedComplaint] = useState<Issue | null>(null)
  const [replyText, setReplyText] = useState('')
  const [isReplying, setIsReplying] = useState(false)

  // Filter to show ONLY complaints (not maintenance)
  const complaintIssues = issues.filter((issue) => issue.type === 'COMPLAINT')

  useEffect(() => {
    fetchIssues(activeTab as 'PENDING' | 'RESOLVED' | 'ALL')
  }, [activeTab])

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    setFilter(value as 'PENDING' | 'RESOLVED' | 'ALL')
  }

  const handleComplaintClick = (complaint: Issue) => {
    setSelectedComplaint(complaint)
    setReplyText('')
  }

  const handleSendReply = async () => {
    if (!selectedComplaint || !replyText.trim()) return

    setIsReplying(true)
    // Simulate API call
    setTimeout(async () => {
      await resolveIssue(selectedComplaint.id, selectedComplaint.type)
      setIsReplying(false)
      setSelectedComplaint(null)
      setReplyText('')
    }, 500)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return 'bg-red-500 hover:bg-red-600'
      case 'MEDIUM':
        return 'bg-yellow-500 hover:bg-yellow-600'
      case 'LOW':
        return 'bg-blue-500 hover:bg-blue-600'
      default:
        return 'bg-gray-500'
    }
  }

  const getStatusBadge = (status: string) => {
    if (status === 'RESOLVED') {
      return (
        <Badge className="bg-green-100 text-green-800 border-0">
          <CheckCircle size={12} className="ml-1" />
          تمت الإجابة
        </Badge>
      )
    }
    return (
      <Badge className="bg-red-100 text-red-800 border-0">
        <AlertTriangle size={12} className="ml-1" />
        قيد الانتظار
      </Badge>
    )
  }

  return (
    <div className="p-6 space-y-6" dir="rtl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight" style={{ color: '#002147' }}>
            الشكاوى الإدارية
          </h1>
          <p className="text-muted-foreground mt-2">
            متابعة شكاوى الطلاب الإدارية والسلوكية (باستثناء طلبات الصيانة)
          </p>
        </div>
      </div>

      <Tabs defaultValue="PENDING" onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-[400px] grid-cols-2">
          <TabsTrigger value="PENDING">
            قيد الانتظار
            {complaintIssues.filter((i) => i.status !== 'RESOLVED').length > 0 && (
              <Badge
                variant="destructive"
                className="mr-2 ml-0 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px]"
              >
                {complaintIssues.filter((i) => i.status !== 'RESOLVED').length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="RESOLVED">تمت الإجابة</TabsTrigger>
        </TabsList>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading ? (
            <div className="col-span-full text-center py-10 text-muted-foreground">
              جاري التحميل...
            </div>
          ) : complaintIssues.length === 0 ? (
            <div className="col-span-full text-center py-10 text-muted-foreground border-2 border-dashed rounded-lg">
              لا يوجد شكاوى في هذه القائمة
            </div>
          ) : (
            complaintIssues.map((issue) => (
              <Card
                key={`${issue.type}-${issue.id}`}
                className="flex flex-col relative overflow-hidden group hover:shadow-md transition-all cursor-pointer"
                onClick={() => handleComplaintClick(issue)}
              >
                <div
                  className={`absolute top-0 right-0 w-1 h-full ${getPriorityColor(issue.priority)}`}
                />

                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <User size={16} className="text-blue-500" />
                        <span className="text-xs font-medium text-muted-foreground">
                          شكوى طالب
                        </span>
                        {getStatusBadge(issue.status)}
                      </div>
                      <CardTitle className="text-lg font-semibold leading-tight">
                        {issue.title}
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="flex-grow text-sm text-gray-600 space-y-3">
                  <p className="line-clamp-3">{issue.description}</p>

                  <div className="flex flex-col gap-1 text-xs text-muted-foreground mt-4 pt-4 border-t">
                    {issue.location && (
                      <div className="flex items-center gap-2">
                        <MapPin size={14} />
                        <span>{issue.location}</span>
                      </div>
                    )}
                    {issue.studentName && (
                      <div className="flex items-center gap-2">
                        <User size={14} />
                        <span>{issue.studentName}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Clock size={14} />
                      <span>
                        {format(new Date(issue.createdAt), 'dd MMMM yyyy - hh:mm a', {
                          locale: ar
                        })}
                      </span>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="pt-2">
                  <Button className="w-full gap-2" variant="outline">
                    <MessageSquare size={16} />
                    {issue.status === 'RESOLVED' ? 'عرض الرد' : 'الرد على الشكوى'}
                  </Button>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      </Tabs>

      {/* Reply Modal */}
      <Dialog open={!!selectedComplaint} onOpenChange={() => setSelectedComplaint(null)}>
        <DialogContent className="max-w-2xl" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-xl">{selectedComplaint?.title}</DialogTitle>
            <DialogDescription className="text-right">
              من: {selectedComplaint?.studentName} • {selectedComplaint?.location}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm font-medium mb-2">تفاصيل الشكوى:</p>
              <p className="text-sm text-gray-700">{selectedComplaint?.description}</p>
              <p className="text-xs text-muted-foreground mt-2">
                {selectedComplaint &&
                  format(new Date(selectedComplaint.createdAt), 'dd MMMM yyyy - hh:mm a', {
                    locale: ar
                  })}
              </p>
            </div>

            {selectedComplaint?.status !== 'RESOLVED' && (
              <div className="space-y-2">
                <label className="text-sm font-medium">رد المشرف / المدير:</label>
                <Textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="اكتب ردك على الشكوى هنا..."
                  rows={5}
                />
              </div>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setSelectedComplaint(null)}>
              إغلاق
            </Button>
            {selectedComplaint?.status !== 'RESOLVED' && (
              <Button
                onClick={handleSendReply}
                disabled={!replyText.trim() || isReplying}
                style={{ backgroundColor: '#002147' }}
              >
                {isReplying ? 'جاري الإرسال...' : 'إرسال الرد'}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
