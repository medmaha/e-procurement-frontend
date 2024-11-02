import React from 'react'
import { format } from 'date-fns'
import { CalendarIcon, ClockIcon, FileIcon, UserIcon, BuildingIcon, CheckCircleIcon, XCircleIcon, AlertTriangleIcon, DownloadIcon, EyeIcon } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar"
import { Badge } from "@/Components/ui/badge"
import { Button } from "@/Components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card"
import { Separator } from "@/Components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table"

interface ID {
  id: string | number
}

interface RFQInterface {
  id: ID
  officer: {
    id: ID
    name: string
  }
  title: string
  unique_id: string
  level: string
  open_status: boolean
  approval_status: string
  deadline: string
  approved_status: "PROCESSING" | "ACCEPTED" | "REJECTED"
  created_date: string
}

interface RFQItem {
  id: ID
  description: string
  quantity: number
  unit_price: number
  total_price: number
}

interface QuoteEvaluation {
  id: ID
  criteria: string
  score: number
  max_score: number
  remarks: string
}

interface RFQResponse {
  id: ID
  unique_id: string
  remarks: string
  status: "pending" | "approved" | "rejected"
  deadline: string
  approved_status: "PROCESSING" | "ACCEPTED" | "REJECTED"
  items: RFQItem[]
  apposable: boolean
  proforma: string
  form101?: string
  invited_at: string
  rfq: RFQInterface
  created_date: string
  last_modified: string
  vendor: {
    id: ID
    name: string
  }
  brochures: {
    id: ID
    name: string
    file: string
  }[]
  delivery_terms: string
  payment_method?: string
  pricing: number
  validity_period: string
  evaluation?: QuoteEvaluation[]
  approved_date?: string
  approved_remarks?: string
  approved_officer?: {
    id: string
    name: string
  }
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'approved':
    case 'accepted':
      return 'bg-green-100 text-green-800'
    case 'rejected':
      return 'bg-red-100 text-red-800'
    case 'processing':
      return 'bg-blue-100 text-blue-800'
    default:
      return 'bg-yellow-100 text-yellow-800'
  }
}

const getStatusIcon = (status: string) => {
  switch (status.toLowerCase()) {
    case 'approved':
    case 'accepted':
      return <CheckCircleIcon className="w-5 h-5 text-green-600" />
    case 'rejected':
      return <XCircleIcon className="w-5 h-5 text-red-600" />
    default:
      return <AlertTriangleIcon className="w-5 h-5 text-yellow-600" />
  }
}

const RFQDetails: React.FC<{ rfqResponse: RFQResponse }> = ({ rfqResponse }) => {
  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">RFQ Response Details</CardTitle>
          <Badge className={`text-sm ${getStatusColor(rfqResponse.status)}`}>
            {rfqResponse.status.charAt(0).toUpperCase() + rfqResponse.status.slice(1)}
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">General Information</h3>
              <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
                <dt className="text-sm font-medium text-muted-foreground">RFQ ID</dt>
                <dd className="text-sm">{rfqResponse.rfq.unique_id}</dd>
                <dt className="text-sm font-medium text-muted-foreground">Response ID</dt>
                <dd className="text-sm">{rfqResponse.unique_id}</dd>
                <dt className="text-sm font-medium text-muted-foreground">Created Date</dt>
                <dd className="text-sm flex items-center">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(new Date(rfqResponse.created_date), 'PPP')}
                </dd>
                <dt className="text-sm font-medium text-muted-foreground">Last Modified</dt>
                <dd className="text-sm flex items-center">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(new Date(rfqResponse.last_modified), 'PPP')}
                </dd>
                <dt className="text-sm font-medium text-muted-foreground">Deadline</dt>
                <dd className="text-sm flex items-center">
                  <ClockIcon className="mr-2 h-4 w-4" />
                  {format(new Date(rfqResponse.deadline), 'PPP')}
                </dd>
                <dt className="text-sm font-medium text-muted-foreground">Invited At</dt>
                <dd className="text-sm flex items-center">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(new Date(rfqResponse.invited_at), 'PPP')}
                </dd>
              </dl>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Vendor Information</h3>
              <div className="flex items-center mb-4">
                <Avatar className="h-10 w-10 mr-4">
                  <AvatarImage src={`/placeholder.svg?height=40&width=40`} alt={rfqResponse.vendor.name} />
                  <AvatarFallback>{rfqResponse.vendor.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{rfqResponse.vendor.name}</p>
                  <p className="text-sm text-muted-foreground">Vendor ID: {rfqResponse.vendor.id.toString()}</p>
                </div>
              </div>
              <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
                <dt className="text-sm font-medium text-muted-foreground">Delivery Terms</dt>
                <dd className="text-sm">{rfqResponse.delivery_terms}</dd>
                <dt className="text-sm font-medium text-muted-foreground">Payment Method</dt>
                <dd className="text-sm">{rfqResponse.payment_method || 'Not specified'}</dd>
                <dt className="text-sm font-medium text-muted-foreground">Pricing</dt>
                <dd className="text-sm">${rfqResponse.pricing.toFixed(2)}</dd>
                <dt className="text-sm font-medium text-muted-foreground">Validity Period</dt>
                <dd className="text-sm">{rfqResponse.validity_period}</dd>
              </dl>
            </div>
          </div>

          <Separator className="my-6" />

          <div>
            <h3 className="text-lg font-semibold mb-4">RFQ Items</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Unit Price</TableHead>
                  <TableHead>Total Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rfqResponse.items.map((item) => (
                  <TableRow key={item.id.toString()}>
                    <TableCell>{item.description}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>${item.unit_price.toFixed(2)}</TableCell>
                    <TableCell>${item.total_price.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <Separator className="my-6" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Documents</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Proforma</span>
                  <Button variant="outline" size="sm">
                    <DownloadIcon className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </div>
                {rfqResponse.form101 && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Form 101</span>
                    <Button variant="outline" size="sm">
                      <DownloadIcon className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </div>
                )}
                {rfqResponse.brochures.map((brochure) => (
                  <div key={brochure.id.toString()} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{brochure.name}</span>
                    <Button variant="outline" size="sm">
                      <DownloadIcon className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Approval Information</h3>
              <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
                <dt className="text-sm font-medium text-muted-foreground">Approval Status</dt>
                <dd className="text-sm">
                  <Badge className={getStatusColor(rfqResponse.approved_status)}>
                    {rfqResponse.approved_status}
                  </Badge>
                </dd>
                {rfqResponse.approved_date && (
                  <>
                    <dt className="text-sm font-medium text-muted-foreground">Approved Date</dt>
                    <dd className="text-sm flex items-center">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(new Date(rfqResponse.approved_date), 'PPP')}
                    </dd>
                  </>
                )}
                {rfqResponse.approved_officer && (
                  <>
                    <dt className="text-sm font-medium text-muted-foreground">Approved By</dt>
                    <dd className="text-sm flex items-center">
                      <UserIcon className="mr-2 h-4 w-4" />
                      {rfqResponse.approved_officer.name}
                    </dd>
                  </>
                )}
              </dl>
              {rfqResponse.approved_remarks && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Approval Remarks</h4>
                  <p className="text-sm">{rfqResponse.approved_remarks}</p>
                </div>
              )}
            </div>
          </div>

          {rfqResponse.evaluation && rfqResponse.evaluation.length > 0 && (
            <>
              <Separator className="my-6" />
              <div>
                <h3 className="text-lg font-semibold mb-4">Evaluation</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Criteria</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Max Score</TableHead>
                      <TableHead>Remarks</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rfqResponse.evaluation.map((_eval) => (
                      <TableRow key={_eval.id.toString()}>
                        <TableCell>{_eval.criteria}</TableCell>
                        <TableCell>{_eval.score}</TableCell>
                        <TableCell>{_eval.max_score}</TableCell>
                        <TableCell>{_eval.remarks}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
          )}

          {rfqResponse.remarks && (
            <>
              <Separator className="my-6" />
              <div>
                <h3 className="text-lg font-semibold mb-2">Remarks</h3>
                <p className="text-sm text-muted-foreground">{rfqResponse.remarks}</p>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default function RFQDetailsPage() {
  // Mock data for demonstration purposes
  const mockRFQResponse: RFQResponse = {
    id: { id: 1 },
    unique_id: "RFQ-2023-001-RESP",
    remarks: "Competitive pricing with quick delivery",
    status: "pending",
    deadline: "2023-06-15T23:59:59Z",
    approved_status: "PROCESSING",
    items: [
      { id: { id: 1 }, description: "Laptop", quantity: 10, unit_price: 1000, total_price: 10000 },
      { id: { id: 2 }, description: "Monitor", quantity: 20, unit_price: 200, total_price: 4000 },
    ],
    apposable: true,
    proforma: "https://example.com/proforma.pdf",
    form101: "https://example.com/form101.pdf",
    invited_at: "2023-05-01T10:00:00Z",
    rfq: {
      id: { id: 1 },
      officer: { id: { id: 1  }, name: "John Doe" },
      title: "IT Equipment Purchase",
      unique_id: "RFQ-2023-001",
      level: "DEPARTMENT",
      open_status: true,
      approval_status: "APPROVED",
      deadline: "2023-06-15T23:59:59Z",
      approved_status: "ACCEPTED",
      created_date: "2023-05-01T09:00:00Z",
    },
    created_date: "2023-05-02T11:00:00Z",
    last_modified: "2023-05-03T14:30:00Z",
    vendor: { id: { id: 1 }, name: "Tech Solutions Inc." },
    brochures: [
      { id: { id: 1 }, name: "Laptop Specs", file: "https://example.com/laptop-specs.pdf" },
      { id: { id: 2 }, name: "Monitor Specs", file: "https://example.com/monitor-specs.pdf" },
    ],
    delivery_terms: "Within 2 weeks of order confirmation",
    payment_method: "Net 30",
    pricing: 14000,
    validity_period: "30 days",
    evaluation: [
      { id: { id: 1 }, criteria: "Price", score: 8, max_score: 10, remarks: "Competitive pricing" },
      { id: { id: 2 }, criteria: "Delivery Time", score: 9, max_score: 10, remarks: "Quick delivery offered" },
    ],
    approved_date: "2023-05-10T15:00:00Z",
    approved_remarks: "Quotation meets all requirements and offers competitive pricing",
    approved_officer: { id: "2", name: "Jane Smith" },
  }

  return <RFQDetails rfqResponse={mockRFQResponse} />
}